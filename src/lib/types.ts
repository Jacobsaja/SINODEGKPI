export type PublicationCategory =
  | "Berita"
  | "Pengumuman"
  | "Kegiatan"
  | "Dokumen"
  | "Renungan Harian";

// Satu lampiran dokumen di dalam kolom `documents` (jsonb array).
export interface PublicationDocument {
  name: string;
  url: string;
  size?: string; // contoh: "2.4 MB"
}

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
  images: string[]; // galeri gambar tambahan, kolom `images` (text[])
  documents: PublicationDocument[]; // lampiran dokumen, kolom `documents` (jsonb)
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

export type FinancialEntryType = "income" | "expense";

export interface FinancialReportEntry {
  type: FinancialEntryType;
  category: string;
  label: string;
  amount: number;
}

// Bentuk data persis seperti kolom di tabel `financial_reports` pada Supabase.
export interface FinancialReport {
  id: number;
  month: number;
  year: number;
  title: string;
  summary: string | null;
  file_url: string | null;
  entries: FinancialReportEntry[];
  total_income: number;
  total_expense: number;
  ending_balance: number;
  status: "draft" | "published";
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  last_edited_by_name?: string | null;
}

export interface FinancialReportHistoryLog {
  id: number;
  report_id: number;
  action: "created" | "updated";
  snapshot: FinancialReport;
  changed_by: string | null;
  changed_by_email: string | null;
  changed_at: string;
  changed_by_name?: string | null;
}