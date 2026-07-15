import { supabase } from "@/lib/supabase";
import type {
  FinancialReport,
  FinancialReportEntry,
  FinancialReportHistoryLog,
} from "@/lib/types";

const MONTH_NAMES_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export function getMonthNameID(month: number): string {
  return MONTH_NAMES_ID[month - 1] ?? "";
}

/** Format angka jadi Rupiah, mis. 1250000 -> "Rp1.250.000". */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Laporan yang published saja, untuk laman publik /laporan-keuangan. */
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

/** Semua laporan termasuk draft, untuk admin panel. */
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

/** Riwayat edit satu laporan, terbaru duluan. */
export async function getFinancialReportHistory(
  reportId: number
): Promise<FinancialReportHistoryLog[]> {
  const { data, error } = await supabase
    .from("financial_report_history")
    .select("*")
    .eq("report_id", reportId)
    .order("changed_at", { ascending: false });

  if (error) {
    console.error("Gagal mengambil riwayat laporan keuangan:", error.message);
    return [];
  }
  return data ?? [];
}

interface FinancialReportInput {
  month: number;
  year: number;
  title: string;
  summary?: string | null;
  file_url?: string | null;
  entries: FinancialReportEntry[];
  status: "draft" | "published";
  last_edited_by_name: string;
}

/** Buat laporan baru. total_income/expense/ending_balance dihitung otomatis di DB. */
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

export async function deleteFinancialReport(id: number): Promise<void> {
  const { error } = await supabase.from("financial_reports").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/** Upload file PDF/gambar laporan ke storage bucket `financial-reports`. */
export async function uploadFinancialReportFile(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from("financial-reports").upload(fileName, file);
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("financial-reports").getPublicUrl(fileName);
  return data.publicUrl;
}

/** Ringkasan satu tahun, dihitung dari data yang sudah difetch (client-side). */
export function getYearlySummary(reports: FinancialReport[], year: number) {
  const reportsInYear = reports.filter((r) => r.year === year);
  return {
    totalIncome: reportsInYear.reduce((sum, r) => sum + r.total_income, 0),
    totalExpense: reportsInYear.reduce((sum, r) => sum + r.total_expense, 0),
    endingBalance: reportsInYear.reduce(
      (sum, r) => sum + (r.total_income - r.total_expense),
      0
    ),
    reportCount: reportsInYear.length,
  };
}

/** Data tren bulanan (Jan -> Des) satu tahun tertentu, untuk grafik. */
export function getMonthlyTrend(reports: FinancialReport[], year: number) {
  return Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const report = reports.find((r) => r.year === year && r.month === month);
    return {
      month,
      monthName: getMonthNameID(month).slice(0, 3),
      income: report?.total_income ?? 0,
      expense: report?.total_expense ?? 0,
    };
  });
}

/** Daftar tahun yang ada di data, terbaru duluan — buat opsi filter. */
export function getAvailableYears(reports: FinancialReport[]): number[] {
  return Array.from(new Set(reports.map((r) => r.year))).sort((a, b) => b - a);
}

/** Filter client-side berdasarkan tahun + kata kunci (nama bulan/judul). */
export function filterFinancialReports(
  reports: FinancialReport[],
  year: number | "Semua",
  query: string
): FinancialReport[] {
  return reports.filter((r) => {
    const matchesYear = year === "Semua" || r.year === year;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      q === "" ||
      r.title.toLowerCase().includes(q) ||
      getMonthNameID(r.month).toLowerCase().includes(q) ||
      String(r.year).includes(q);
    return matchesYear && matchesQuery;
  });
}

// ============================================================
// Diff riwayat: bandingkan snapshot sebelum & sesudah supaya
// bisa ditampilkan rincian "apa yang berubah", bukan cuma
// "diubah oleh X pada Y". Dihitung di sisi app (bukan trigger),
// jadi gak perlu migration tambahan.
// ============================================================

export type FinancialReportHistoryLogWithChanges = FinancialReportHistoryLog & {
  changes: string[];
};

function diffEntries(
  oldEntries: FinancialReportEntry[],
  newEntries: FinancialReportEntry[]
): string[] {
  const key = (e: FinancialReportEntry) => `${e.type}|${e.category}|${e.label}`;
  const oldMap = new Map(oldEntries.map((e) => [key(e), e.amount]));
  const newMap = new Map(newEntries.map((e) => [key(e), e.amount]));
  const changes: string[] = [];

  newMap.forEach((amount, k) => {
    const [type, category, label] = k.split("|");
    const typeLabel = type === "income" ? "Pemasukan" : "Pengeluaran";
    if (!oldMap.has(k)) {
      changes.push(`+ ${typeLabel} baru: ${category} - ${label} (${formatRupiah(amount)})`);
    } else if (oldMap.get(k) !== amount) {
      changes.push(
        `${typeLabel} "${category} - ${label}" diubah dari ${formatRupiah(
          oldMap.get(k) as number
        )} ke ${formatRupiah(amount)}`
      );
    }
  });

  oldMap.forEach((amount, k) => {
    if (!newMap.has(k)) {
      const [type, category, label] = k.split("|");
      const typeLabel = type === "income" ? "Pemasukan" : "Pengeluaran";
      changes.push(`- ${typeLabel} dihapus: ${category} - ${label} (${formatRupiah(amount)})`);
    }
  });

  return changes;
}

/** Bandingin satu snapshot riwayat dengan snapshot sebelumnya, hasilnya list teks perubahan. */
function getChangeSummary(
  curr: FinancialReport,
  action: "created" | "updated",
  prev: FinancialReport | null
): string[] {
  if (action === "created" || !prev) {
    return ["Laporan dibuat pertama kali"];
  }

  const changes: string[] = [];

  if (prev.title !== curr.title) {
    changes.push(`Judul diubah menjadi "${curr.title}"`);
  }
  if ((prev.summary ?? "") !== (curr.summary ?? "")) {
    changes.push("Ringkasan diperbarui");
  }
  if ((prev.file_url ?? "") !== (curr.file_url ?? "")) {
    if (!prev.file_url && curr.file_url) changes.push("File laporan ditambahkan");
    else if (prev.file_url && !curr.file_url) changes.push("File laporan dihapus");
    else changes.push("File laporan diganti");
  }
  if (prev.status !== curr.status) {
    const label = (s: string) => (s === "published" ? "Terbit" : "Draft");
    changes.push(`Status diubah dari ${label(prev.status)} ke ${label(curr.status)}`);
  }

  changes.push(...diffEntries(prev.entries, curr.entries));

  if (changes.length === 0) {
    changes.push("Data disimpan ulang, tidak ada perubahan nilai");
  }

  return changes;
}

/**
 * Riwayat satu laporan, lengkap dengan rincian apa yang berubah di tiap edit
 * (dibandingkan snapshot sebelumnya). Terbaru ditaruh paling atas.
 */
export async function getFinancialReportHistoryWithChanges(
  reportId: number
): Promise<FinancialReportHistoryLogWithChanges[]> {
  const logs = await getFinancialReportHistory(reportId); // urutan: terbaru -> lama
  const chronological = [...logs].reverse(); // lama -> terbaru, biar gampang dibandingin

  const withChanges: FinancialReportHistoryLogWithChanges[] = chronological.map((log, i) => {
    const prevSnapshot = i > 0 ? chronological[i - 1].snapshot : null;
    return {
      ...log,
      changes: getChangeSummary(log.snapshot, log.action, prevSnapshot),
    };
  });

  return withChanges.reverse(); // balikin lagi ke terbaru -> lama
}

/** Riwayat edit untuk halaman PUBLIK — otomatis exclude email pengedit. */
export async function getFinancialReportHistoryPublic(
  reportId: number
): Promise<FinancialReportHistoryLog[]> {
  const { data, error } = await supabase
    .from("financial_report_history_public")
    .select("*")
    .eq("report_id", reportId)
    .order("changed_at", { ascending: false });

  if (error) {
    console.error("Gagal mengambil riwayat laporan keuangan:", error.message);
    return [];
  }
  return data ?? [];
}