export type FolderAccessMode = "email" | "code";
export type FolderStatus = "draft" | "published";

export interface ShareFolder {
  id: string;
  title: string;
  description: string | null;
  cover_image_path: string | null;
  slug: string;
  status: FolderStatus;
  is_active: boolean;
  access_mode: FolderAccessMode;
  access_code: string | null;
  published_at: string | null;
  last_action: string | null;
  last_action_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ShareFolderFile {
  id: string;
  folder_id: string;
  title: string;
  description: string | null;
  storage_path: string | null;
  original_filename: string | null;
  file_type: string | null;
  file_size: number | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ShareFolderAccess {
  id: string;
  folder_id: string;
  name: string;
  email: string | null;
  created_at: string;
}

// Dipakai untuk menampilkan label & ikon berkas berdasarkan ekstensi.
export function detectFileType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "pdf";
  if (["doc", "docx"].includes(ext)) return "docx";
  if (["xls", "xlsx"].includes(ext)) return "xlsx";
  if (["ppt", "pptx"].includes(ext)) return "pptx";
  if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) return "image";
  return "other";
}

// Label singkat untuk badge status folder.
export const FOLDER_STATUS_LABEL: Record<FolderStatus, string> = {
  draft: "Draf",
  published: "Terbit",
};
