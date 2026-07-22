import { supabase } from "@/lib/supabase";
import type { FinancialReport } from "@/lib/types";

const MONTH_NAMES_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export function getMonthNameID(month: number): string {
  return MONTH_NAMES_ID[month - 1] ?? "";
}

/** Format ukuran file, mis. 1258291 -> "1.2 MB". */
export function formatFileSize(bytes?: number | null): string {
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

/** URL unduh langsung (browser force-download) pakai nama file asli. */
export function getDownloadUrl(
  report: Pick<FinancialReport, "file_url" | "file_name">
): string {
  const sep = report.file_url.includes("?") ? "&" : "?";
  const name = report.file_name ? encodeURIComponent(report.file_name) : "laporan";
  return `${report.file_url}${sep}download=${name}`;
}

/** Laporan published saja, untuk laman publik /laporan-keuangan. */
export async function getAllFinancialReports(): Promise<FinancialReport[]> {
  const { data, error } = await supabase
    .from("financial_reports")
    .select("*")
    .eq("status", "published")
    .order("year", { ascending: false })
    .order("month", { ascending: false });

  if (error) {
    console.error("Gagal mengambil laporan keuangan:", error.message);
    return [];
  }
  return data ?? [];
}

/** Semua laporan (draft + published), untuk admin panel. */
export async function getAllFinancialReportsAdmin(): Promise<FinancialReport[]> {
  const { data, error } = await supabase
    .from("financial_reports")
    .select("*")
    .order("year", { ascending: false })
    .order("month", { ascending: false });

  if (error) {
    console.error("Gagal mengambil laporan keuangan (admin):", error.message);
    return [];
  }
  return data ?? [];
}

export async function getFinancialReportById(id: number): Promise<FinancialReport | null> {
  const { data, error } = await supabase
    .from("financial_reports")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Gagal mengambil detail laporan keuangan:", error.message);
    return null;
  }
  return data;
}

interface FinancialReportInput {
  month: number;
  year: number;
  name: string;
  description?: string | null;
  file_url: string;
  file_path: string;
  file_name: string;
  file_size: number;
  status: "draft" | "published";
}

/** Buat laporan baru. */
export async function createFinancialReport(
  input: FinancialReportInput
): Promise<FinancialReport> {
  const { data, error } = await supabase
    .from("financial_reports")
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as FinancialReport;
}

export async function updateFinancialReport(
  id: number,
  input: Partial<FinancialReportInput>
): Promise<FinancialReport> {
  const { data, error } = await supabase
    .from("financial_reports")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as FinancialReport;
}

/** Hapus baris laporan + file dokumennya di storage. */
export async function deleteFinancialReport(
  id: number,
  filePath?: string | null
): Promise<void> {
  const { error } = await supabase.from("financial_reports").delete().eq("id", id);
  if (error) throw new Error(error.message);

  if (filePath) {
    const { error: storageError } = await supabase.storage
      .from("financial-reports")
      .remove([filePath]);
    if (storageError) {
      console.error(
        "Baris laporan terhapus, tapi file di storage gagal dihapus:",
        storageError.message
      );
    }
  }
}

/** Upload dokumen (PDF/gambar) laporan ke storage bucket `financial-reports`. */
export async function uploadFinancialReportFile(file: File): Promise<{
  url: string;
  path: string;
  name: string;
  size: number;
}> {
  const ext = file.name.split(".").pop() || "pdf";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("financial-reports").upload(path, file);
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("financial-reports").getPublicUrl(path);
  return { url: data.publicUrl, path, name: file.name, size: file.size };
}

/** Daftar tahun yang ada di data, terbaru duluan — buat opsi filter. */
export function getAvailableYears(reports: FinancialReport[]): number[] {
  return Array.from(new Set(reports.map((r) => r.year))).sort((a, b) => b - a);
}

/** Filter client-side berdasarkan tahun + kata kunci (nama/deskripsi/bulan/tahun). */
export function filterFinancialReports(
  reports: FinancialReport[],
  year: number | "Semua",
  query: string
): FinancialReport[] {
  const q = query.trim().toLowerCase();
  return reports.filter((r) => {
    const matchesYear = year === "Semua" || r.year === year;
    const matchesQuery =
      q === "" ||
      r.name.toLowerCase().includes(q) ||
      (r.description ?? "").toLowerCase().includes(q) ||
      getMonthNameID(r.month).toLowerCase().includes(q) ||
      String(r.year).includes(q);
    return matchesYear && matchesQuery;
  });
}