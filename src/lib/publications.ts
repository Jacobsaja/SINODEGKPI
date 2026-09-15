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
 * Renungan harian terbaru untuk section "Renungan" di Beranda.
 * Hanya memuat renungan yang usianya maksimal 30 hari dari hari ini.
 */
export async function getLatestDevotions(limit = 3): Promise<Publication[]> {
  const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const { data, error } = await supabase
    .from("publications")
    .select("*")
    .eq("category", "Renungan Harian")
    .gte("date", cutoffDate)
    .order("date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Gagal mengambil renungan terbaru:", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Publikasi warta & berita non-renungan untuk section "Publikasi" di Beranda.
 */
export async function getLatestArticles(limit = 3): Promise<Publication[]> {
  const { data, error } = await supabase
    .from("publications")
    .select("*")
    .neq("category", "Renungan Harian")
    .order("date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Gagal mengambil publikasi artikel:", error.message);
    return [];
  }
  return data ?? [];
}

/**
 * Semua publikasi untuk halaman /publikasi (client component, filter & search
 * dilakukan di sisi client setelah data ini dimuat).
 * Jika parameter department diisi, filter publikasi berdasarkan departemen tersebut.
 * Otomatis menyaring renungan harian yang usianya sudah lebih dari 30 hari.
 */
export async function getAllPublications(
  department?: PublicationDepartment
): Promise<Publication[]> {
  const cutoffDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

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
        const filtered = fallbackData.filter(
          (item: Publication) =>
            (item.category !== "Renungan Harian" || item.date >= cutoffDate) &&
            (!department || (item.department ?? "Sinode") === department)
        );
        return filtered;
      }
    }
    console.error("Gagal mengambil publikasi:", error.message);
    return [];
  }

  // Saring renungan harian yang usianya lebih dari 30 hari
  const activeItems = (data ?? []).filter(
    (item: Publication) => item.category !== "Renungan Harian" || item.date >= cutoffDate
  );

  return activeItems;
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

/** Format tanggal lengkap dengan nama hari ("Selasa, 15 September 2026"). */
export function formatFullDateID(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return isoDate;
    return d.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return isoDate;
  }
}

/**
 * Menambah hitungan views saat publikasi / renungan dibaca.
 * Dijalankan secara non-blocking agar tidak memperlambat respon server.
 */
export async function incrementPublicationViews(id: string | number): Promise<void> {
  try {
    const numericId = typeof id === "string" ? parseInt(id, 10) : id;
    if (isNaN(numericId)) return;

    const { data } = await supabase
      .from("publications")
      .select("views")
      .eq("id", numericId)
      .single();

    if (data) {
      await supabase
        .from("publications")
        .update({ views: (data.views || 0) + 1 })
        .eq("id", numericId);
    }
  } catch (err) {
    console.warn("Gagal update counter views:", err);
  }
}
