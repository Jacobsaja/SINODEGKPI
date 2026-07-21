"use client";

import { supabase } from "@/lib/supabase";
import { compressBeforeUpload } from "@/lib/image-compress";
import type { PublicationDocument } from "@/lib/types";

const BUCKET = "publications";

const ALLOWED_IMAGE_TYPES = ["image/webp", "image/jpeg", "image/png"];
const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

// Dipakai untuk atribut `accept` di <input type="file"> pada form admin.
export const PUBLIKASI_IMAGE_ACCEPT = ALLOWED_IMAGE_TYPES.join(",");
export const PUBLIKASI_DOCUMENT_ACCEPT = [
  "application/pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
].join(",");

export function isAllowedImage(file: File): boolean {
  return ALLOWED_IMAGE_TYPES.includes(file.type);
}

export function isAllowedDocument(file: File): boolean {
  return ALLOWED_DOCUMENT_TYPES.includes(file.type);
}

/** Format ukuran file jadi label enak dibaca, mis. "2.4 MB". */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

/**
 * Kompres lalu upload 1 gambar untuk galeri publikasi.
 * Mengembalikan URL publik yang siap disimpan ke kolom `images`.
 */
export async function uploadPublikasiImage(file: File): Promise<string> {
  if (!isAllowedImage(file)) {
    throw new Error("Format gambar tidak didukung. Gunakan JPG, PNG, atau WEBP.");
  }

  const compressed = await compressBeforeUpload(file, "publikasi");
  const path = `images/${crypto.randomUUID()}.webp`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, compressed, {
    contentType: "image/webp",
    upsert: false,
  });

  if (error) {
    throw new Error(`Gagal upload gambar: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Upload 1 dokumen (PDF/Word/Excel) tanpa kompresi.
 * Mengembalikan objek siap disimpan ke kolom `documents` (jsonb array).
 */
export async function uploadPublikasiDocument(file: File): Promise<PublicationDocument> {
  if (!isAllowedDocument(file)) {
    throw new Error("Format dokumen tidak didukung. Gunakan PDF, DOC/DOCX, atau XLS/XLSX.");
  }

  const ext = file.name.split(".").pop() ?? "bin";
  const path = `documents/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error(`Gagal upload dokumen: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return {
    name: file.name,
    url: data.publicUrl,
    size: formatFileSize(file.size),
  };
}

/** Upload banyak gambar sekaligus (berurutan, supaya progress mudah dipantau di UI). */
export async function uploadPublikasiImages(files: File[]): Promise<string[]> {
  const urls: string[] = [];
  for (const file of files) {
    urls.push(await uploadPublikasiImage(file));
  }
  return urls;
}

/** Upload banyak dokumen sekaligus. */
export async function uploadPublikasiDocuments(
  files: File[]
): Promise<PublicationDocument[]> {
  const docs: PublicationDocument[] = [];
  for (const file of files) {
    docs.push(await uploadPublikasiDocument(file));
  }
  return docs;
}