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
const ALLOWED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-m4a",
  "audio/m4a",
  "audio/aac",
  "audio/ogg",
  "audio/mp4",
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
export const PUBLIKASI_AUDIO_ACCEPT = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/m4a",
  "audio/aac",
  "audio/ogg",
  ".mp3",
  ".m4a",
  ".wav",
  ".aac",
  ".ogg",
].join(",");

export function isAllowedImage(file: File): boolean {
  return ALLOWED_IMAGE_TYPES.includes(file.type);
}

export function isAllowedDocument(file: File): boolean {
  return ALLOWED_DOCUMENT_TYPES.includes(file.type);
}

export function isAllowedAudio(file: File): boolean {
  if (ALLOWED_AUDIO_TYPES.includes(file.type)) return true;
  const ext = file.name.split(".").pop()?.toLowerCase();
  return ["mp3", "m4a", "wav", "aac", "ogg"].includes(ext ?? "");
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

/**
 * Upload 1 file audio renungan (MP3/M4A/WAV/AAC/OGG).
 * Maksimal 10MB (sesuai batas durasi maksimal 5 menit). Mengembalikan URL publik Supabase Storage.
 */
export async function uploadPublikasiAudio(file: File): Promise<string> {
  if (!isAllowedAudio(file)) {
    throw new Error("Format audio tidak didukung. Gunakan MP3, M4A, WAV, atau AAC.");
  }

  const MAX_SIZE = 3 * 1024 * 1024; // 3 MB (hemat kuota, cukup untuk rekaman suara 5 menit)
  if (file.size > MAX_SIZE) {
    throw new Error("Ukuran file audio maksimal 3 MB (durasi maksimal 5 menit).");
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "mp3";
  const path = `audios/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || "audio/mpeg",
    upsert: false,
  });

  if (error) {
    throw new Error(`Gagal upload audio: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}