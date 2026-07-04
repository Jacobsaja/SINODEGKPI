export type PublicationCategory =
  | "Berita"
  | "Pengumuman"
  | "Kegiatan"
  | "Dokumen"
  | "Renungan Harian";

// Bentuk data persis seperti kolom di tabel `publications` pada Supabase.
export interface Publication {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: PublicationCategory;
  date: string; // format ISO, mis. "2026-07-03"
  author: string;
  image: string;
  read_time: string;
  views: number;
  is_featured: boolean;
  document_url: string | null;
  created_at: string;
  updated_at: string;
}
