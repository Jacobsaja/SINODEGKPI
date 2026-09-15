import { supabase } from "@/lib/supabase";
import type { Publication } from "@/lib/types";

const BUCKET = "publications";

/**
 * Mengekstrak path relatif file di bucket Supabase Storage dari sebuah URL publik.
 * Contoh URL: https://cpzplvifayzyihjzecdp.supabase.co/storage/v1/object/public/publications/audios/abc-123.mp3
 * Output: "audios/abc-123.mp3"
 */
export function extractStoragePath(url?: string | null): string | null {
  if (!url || typeof url !== "string") return null;

  // Hanya proses jika URL berasal dari Supabase Storage bucket publications
  const marker = `/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx !== -1) {
    const rawPath = url.slice(idx + marker.length);
    // Hilangkan query params jika ada
    const cleanPath = rawPath.split("?")[0];
    return cleanPath || null;
  }

  // Jika formatnya sudah relatif (misal "audios/abc-123.mp3" atau "12345.webp")
  if (
    url.startsWith("audios/") ||
    url.startsWith("images/") ||
    url.startsWith("documents/") ||
    url.match(/^\d+-[a-z0-9]+\.webp$/i)
  ) {
    return url;
  }

  return null;
}

/**
 * Mengumpulkan semua path file di Supabase Storage milik sebuah publikasi/renungan:
 * - Cover image (`image`)
 * - Galeri gambar (`images`)
 * - Audio renungan (`audio_url` atau `document_url`)
 * - Lampiran dokumen (`documents[].url`)
 */
export function extractPublicationStoragePaths(item: Partial<Publication>): string[] {
  const paths: string[] = [];

  // 1. Gambar utama / cover
  if (item.image) {
    const p = extractStoragePath(item.image);
    if (p) paths.push(p);
  }

  // 2. Galeri gambar tambahan
  if (Array.isArray(item.images)) {
    for (const imgUrl of item.images) {
      const p = extractStoragePath(imgUrl);
      if (p) paths.push(p);
    }
  }

  // 3. Audio renungan (tersimpan di audio_url atau fallback document_url)
  if (item.audio_url) {
    const p = extractStoragePath(item.audio_url);
    if (p) paths.push(p);
  } else if (item.document_url && (item.document_url.includes("audios/") || item.document_url.endsWith(".mp3") || item.document_url.endsWith(".m4a") || item.document_url.endsWith(".wav"))) {
    const p = extractStoragePath(item.document_url);
    if (p) paths.push(p);
  }

  // 4. Lampiran dokumen
  if (Array.isArray(item.documents)) {
    for (const doc of item.documents) {
      if (doc?.url) {
        const p = extractStoragePath(doc.url);
        if (p) paths.push(p);
      }
    }
  }

  // Filter unik agar tidak ada duplikasi path
  return Array.from(new Set(paths));
}

/**
 * Hapus semua file media fisik milik 1 publikasi dari Supabase Storage.
 */
export async function deletePublicationMedia(item: Partial<Publication>): Promise<number> {
  const paths = extractPublicationStoragePaths(item);
  if (paths.length === 0) return 0;

  try {
    const { error } = await supabase.storage.from(BUCKET).remove(paths);
    if (error) {
      console.warn("Gagal menghapus beberapa file dari storage:", error.message);
    }
    return paths.length;
  } catch (err) {
    console.warn("Error saat menghapus media storage:", err);
    return 0;
  }
}

export interface CleanupResult {
  deletedCount: number;
  deletedTitles: string[];
  deletedFilesCount: number;
  error?: string;
}

/**
 * Hapus permanen renungan harian yang usianya sudah lebih dari maxAgeDays (default: 30 hari).
 * Menghapus data di tabel `publications` beserta semua file audio, foto cover, galeri, dan dokumen di Storage.
 */
export async function cleanupExpiredDevotions(maxAgeDays = 30): Promise<CleanupResult> {
  try {
    // Hitung tanggal cutoff batas 30 hari yang lalu (format YYYY-MM-DD)
    const cutoffDate = new Date(Date.now() - maxAgeDays * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    // Ambil renungan harian yang tanggal terbitnya lebih lama dari cutoffDate
    const { data: expiredDevotions, error: fetchError } = await supabase
      .from("publications")
      .select("*")
      .eq("category", "Renungan Harian")
      .lt("date", cutoffDate);

    if (fetchError) {
      return {
        deletedCount: 0,
        deletedTitles: [],
        deletedFilesCount: 0,
        error: fetchError.message,
      };
    }

    if (!expiredDevotions || expiredDevotions.length === 0) {
      return {
        deletedCount: 0,
        deletedTitles: [],
        deletedFilesCount: 0,
      };
    }

    const allPathsToDelete: string[] = [];
    const idsToDelete: number[] = [];
    const deletedTitles: string[] = [];

    for (const item of expiredDevotions) {
      idsToDelete.push(item.id);
      deletedTitles.push(item.title);

      const paths = extractPublicationStoragePaths(item);
      allPathsToDelete.push(...paths);
    }

    // 1. Hapus semua file fisik (audio, foto, dokumen) di Supabase Storage
    let deletedFilesCount = 0;
    const uniquePaths = Array.from(new Set(allPathsToDelete));
    if (uniquePaths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from(BUCKET)
        .remove(uniquePaths);
      if (storageError) {
        console.warn("Peringatan saat menghapus file storage:", storageError.message);
      } else {
        deletedFilesCount = uniquePaths.length;
      }
    }

    // 2. Hapus baris dari tabel publications
    const { error: deleteError } = await supabase
      .from("publications")
      .delete()
      .in("id", idsToDelete);

    if (deleteError) {
      return {
        deletedCount: 0,
        deletedTitles: [],
        deletedFilesCount,
        error: deleteError.message,
      };
    }

    return {
      deletedCount: idsToDelete.length,
      deletedTitles,
      deletedFilesCount,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal membersihkan renungan kadaluarsa";
    return {
      deletedCount: 0,
      deletedTitles: [],
      deletedFilesCount: 0,
      error: msg,
    };
  }
}
