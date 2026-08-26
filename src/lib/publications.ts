import { supabase } from "@/lib/supabase";
import type { Publication, PublicationDepartment } from "@/lib/types";

/**
 * Publikasi terbaru untuk section "Publikasi & Literasi" di Beranda.
 * Dipanggil dari server component (Home), jadi selalu ambil data terbaru
 * setiap kali halaman di-render di server.
 */
export async function getLatestPublications(limit = 3): Promise<Publication[]> {
  const { data, error } = await supabase
    .from("publications")
    .select("*")
    .order("date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Gagal mengambil publikasi terbaru:", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Semua publikasi untuk halaman /publikasi (client component, filter & search
 * dilakukan di sisi client setelah data ini dimuat).
 * Jika parameter department diisi, filter publikasi berdasarkan departemen tersebut.
 */
export async function getAllPublications(
  department?: PublicationDepartment
): Promise<Publication[]> {
  let query = supabase
    .from("publications")
    .select("*")
    .order("date", { ascending: false });

  if (department) {
    query = query.eq("department", department);
  }

  const { data, error } = await query;

  if (error) {
    // Jika kolom 'department' belum dibuat di database Supabase,
    // lakukan fallback dengan mengambil publikasi tanpa filter query agar tidak merusak halaman.
    if (error.message.includes("department") || error.code === "PGRST204") {
      const { data: fallbackData } = await supabase
        .from("publications")
        .select("*")
        .order("date", { ascending: false });

      if (fallbackData) {
        if (department) {
          return fallbackData.filter(
            (item: Publication) => (item.department ?? "Sinode") === department
          );
        }
        return fallbackData;
      }
    }
    console.error("Gagal mengambil publikasi:", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Satu publikasi berdasarkan id, untuk halaman detail /publikasi/[id].
 * Dipanggil dari server component agar mendukung generateMetadata (SEO).
 */
export async function getPublicationById(id: string): Promise<Publication | null> {
  const { data, error } = await supabase
    .from("publications")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Gagal mengambil detail publikasi:", error.message);
    return null;
  }
  return data;
}

/** Format tanggal ISO ("2026-07-03") menjadi format Indonesia ("03 Juli 2026"). */
export function formatDateID(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/** Format angka views menjadi format ribuan Indonesia (1248 -> "1.248"). */
export function formatViewsID(views: number): string {
  return views.toLocaleString("id-ID");
}
