import { supabase } from "@/lib/supabase";
import type { Publication } from "@/lib/types";

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
 */
export async function getAllPublications(): Promise<Publication[]> {
  const { data, error } = await supabase
    .from("publications")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Gagal mengambil semua publikasi:", error.message);
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
