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

// Kategori bersifat bebas (text) karena daftar produk toko bisa terus
// bertambah kategorinya seiring waktu, tidak seketat kategori publikasi.
export type ProductCategory = string;

// Bentuk data persis seperti kolom di tabel `products` pada Supabase.
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image: string;
  tokopedia_url: string;
  shopee_url: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}
