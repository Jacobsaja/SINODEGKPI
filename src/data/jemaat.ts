// ─── Jemaat Data Layer ─────────────────────────────────────────────────────
// This file replaces the old hardcoded array with a Supabase-backed data
// layer, following the same pattern used for publikasi / toko / pengurus.
//
// IMPORTANT: the `Jemaat` interface and the import path "@/data/jemaat" are
// kept exactly the same on purpose, so every existing component
// (ChurchDetailPanel, ChurchListItem, ChurchListPanel, MapView,
// NearestChurchFinder, page.tsx, etc.) keeps working without any changes to
// their imports.
//
// ASSUMPTION: this file imports the Supabase client from "@/lib/supabase"
// (the same convention used for the publikasi/toko/pengurus features). If
// your project's client lives at a different path, just update the single
// import line below.

import { supabase } from "@/lib/supabase";

export interface Jemaat {
  // ── Core (Phase 1) ──────────────────────────────────────────────────────
  id: string;
  nama: string;        // Full church name
  pendeta: string;     // Lead pastor / pelayan
  alamat: string;      // Full address
  telepon: string;     // Contact number
  lat: number;         // Latitude
  lng: number;         // Longitude
  foto: string;        // Image URL (relative or absolute)
  kota: string;        // City name
  provinsi: string;    // Province name

  // ── Phase 2 (optional) ───────────────────────────────────────────────────
  resort_id?: string;
  wilayah_id?: string;
  jadwal_ibadah?: string[];
}

// Fields an admin fills in when creating/editing a church. `id` is optional
// on create — if left blank it's auto-generated (slugified) from `nama`.
export type JemaatInput = Omit<Jemaat, "id"> & { id?: string };

// ── Read ─────────────────────────────────────────────────────────────────────

/**
 * Fetch every jemaat, ordered by name. Used by the public map/list page and
 * by the admin panel. Returns [] (and logs) on error rather than throwing,
 * so the public page never crashes if Supabase is briefly unavailable.
 */
export async function getAllJemaat(): Promise<Jemaat[]> {
  const { data, error } = await supabase
    .from("jemaat")
    .select("*")
    .order("nama", { ascending: true });

  if (error) {
    console.error("Error fetching jemaat:", error.message);
    return [];
  }

  return (data ?? []) as Jemaat[];
}

export async function getJemaatById(id: string): Promise<Jemaat | null> {
  const { data, error } = await supabase
    .from("jemaat")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching jemaat by id:", error.message);
    return null;
  }

  return data as Jemaat;
}

// ── Write (admin only — protected by RLS "authenticated" policies) ─────────

export async function createJemaat(input: JemaatInput): Promise<Jemaat> {
  const id = input.id?.trim() || slugify(input.nama);

  const { data, error } = await supabase
    .from("jemaat")
    .insert([{ ...input, id }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Jemaat;
}

export async function updateJemaat(
  id: string,
  updates: Partial<JemaatInput>
): Promise<Jemaat> {
  const { data, error } = await supabase
    .from("jemaat")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Jemaat;
}

export async function deleteJemaat(id: string): Promise<void> {
  const { error } = await supabase.from("jemaat").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ── Storage: church photo upload ────────────────────────────────────────────

const PHOTO_BUCKET = "jemaat-photos";

/**
 * Uploads a photo file to the `jemaat-photos` bucket and returns its public
 * URL. Mirrors the pattern used for products/publications image uploads.
 */
export async function uploadJemaatPhoto(file: File, jemaatId: string): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${jemaatId}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(path, file, { upsert: true });

  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

export function slugify(nama: string): string {
  const base = nama
    .toLowerCase()
    .replace(/^gkpi\s+jemaat\s+/i, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `jemaat-${base || Date.now()}`;
}
