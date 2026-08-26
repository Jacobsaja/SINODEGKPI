export type PublicationCategory =
  | "Berita"
  | "Pengumuman"
  | "Kegiatan"
  | "Dokumen"
  | "Renungan Harian";

export type PublicationDepartment =
  | "Sinode"
  | "Diakonat"
  | "Apostolat"
  | "Pastorat";

export interface PublicationDocument {
  name: string;
  url: string;
  size?: string;
}

// Supabase `publications` DTO
export interface Publication {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: PublicationCategory;
  department?: PublicationDepartment;
  date: string; // ISO 8601 string
  author: string;
  image: string;
  images: string[];
  documents: PublicationDocument[];
  read_time: string;
  views: number;
  is_featured: boolean;
  document_url: string | null;
  created_at: string;
  updated_at: string;
}

export type ProductCategory = string;

// Supabase `products` DTO
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

// Supabase `financial_reports` DTO
export interface FinancialReport {
  id: number;
  month: number;
  year: number;
  name: string;
  description: string | null;
  file_url: string;
  file_path: string;
  file_name: string;
  file_size: number;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
  published_at: string | null;
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