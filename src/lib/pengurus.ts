import { supabase } from "@/lib/supabase";

// ─── Types ───────────────────────────────────────────────────────────────────

export type LayoutType =
  | "leaders_grid"
  | "komisi_groups"
  | "single_group"
  | "flat_grid";

export type CardVariant = "leader" | "standard" | "compact";

export const LAYOUT_TYPE_LABELS: Record<LayoutType, string> = {
  leaders_grid: "Pimpinan (slot besar di atas + grid jabatan di bawah)",
  komisi_groups: "Multi Grup / Komisi (beberapa grup, tiap grup: ketua + sekretaris + anggota)",
  single_group: "Satu Grup (ketua + sekretaris + anggota)",
  flat_grid: "Grid Rata (daftar nama + jabatan + deskripsi, tanpa grup)",
};

export interface PengurusAnggota {
  id: string;
  seksi_id: string;
  grup_id: string | null;
  name: string;
  role: string | null;
  description: string | null;
  bio: string | null;
  email: string | null;
  phone: string | null;
  photo_url: string | null;
  variant: CardVariant;
  order_index: number;
}

export interface PengurusGrup {
  id: string;
  seksi_id: string;
  name: string | null;
  order_index: number;
  anggota: PengurusAnggota[];
}

export interface PengurusSeksi {
  id: string;
  title: string;
  tab_label: string;
  slug: string;
  layout_type: LayoutType;
  order_index: number;
  groups: PengurusGrup[];
  /** Anggota tanpa grup: dipakai oleh leaders_grid & flat_grid */
  members: PengurusAnggota[];
}

// Input types (tanpa id, dipakai untuk create/update dari form admin)
export type PengurusSeksiInput = {
  title: string;
  tab_label: string;
  slug: string;
  layout_type: LayoutType;
  order_index?: number;
};

export type PengurusGrupInput = {
  seksi_id: string;
  name: string | null;
  order_index?: number;
};

export type PengurusAnggotaInput = {
  seksi_id: string;
  grup_id: string | null;
  name: string;
  role?: string | null;
  description?: string | null;
  bio?: string | null;
  email?: string | null;
  phone?: string | null;
  photo_url?: string | null;
  variant?: CardVariant;
  order_index?: number;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function nextOrder(items: { order_index: number }[]): number {
  if (items.length === 0) return 0;
  return Math.max(...items.map((i) => i.order_index)) + 1;
}

// ─── Fetch (public + admin) ─────────────────────────────────────────────────

/**
 * Ambil semua seksi pengurus beserta grup & anggotanya, tersusun rapi
 * sesuai order_index masing-masing. Dipakai baik oleh halaman publik
 * /pengurus maupun admin /admin/pengurus.
 */
export async function getAllSeksi(): Promise<PengurusSeksi[]> {
  const [seksiRes, grupRes, anggotaRes] = await Promise.all([
    supabase.from("pengurus_seksi").select("*").order("order_index", { ascending: true }),
    supabase.from("pengurus_grup").select("*").order("order_index", { ascending: true }),
    supabase.from("pengurus_anggota").select("*").order("order_index", { ascending: true }),
  ]);

  if (seksiRes.error) throw seksiRes.error;
  if (grupRes.error) throw grupRes.error;
  if (anggotaRes.error) throw anggotaRes.error;

  const seksiList: PengurusSeksi[] = (seksiRes.data ?? []).map((s) => ({
    id: s.id,
    title: s.title,
    tab_label: s.tab_label,
    slug: s.slug,
    layout_type: s.layout_type,
    order_index: s.order_index,
    groups: [],
    members: [],
  }));

  const seksiById = new Map(seksiList.map((s) => [s.id, s]));
  const grupById = new Map<string, PengurusGrup>();

  for (const g of grupRes.data ?? []) {
    const grup: PengurusGrup = {
      id: g.id,
      seksi_id: g.seksi_id,
      name: g.name,
      order_index: g.order_index,
      anggota: [],
    };
    grupById.set(g.id, grup);
    seksiById.get(g.seksi_id)?.groups.push(grup);
  }

  for (const a of anggotaRes.data ?? []) {
    const anggota: PengurusAnggota = {
      id: a.id,
      seksi_id: a.seksi_id,
      grup_id: a.grup_id,
      name: a.name,
      role: a.role,
      description: a.description,
      bio: a.bio,
      email: a.email,
      phone: a.phone,
      photo_url: a.photo_url,
      variant: a.variant,
      order_index: a.order_index,
    };
    if (a.grup_id && grupById.has(a.grup_id)) {
      grupById.get(a.grup_id)!.anggota.push(anggota);
    } else {
      seksiById.get(a.seksi_id)?.members.push(anggota);
    }
  }

  return seksiList;
}

// ─── CRUD: Seksi ─────────────────────────────────────────────────────────────

export async function createSeksi(input: PengurusSeksiInput, existing: PengurusSeksi[]) {
  const { data, error } = await supabase
    .from("pengurus_seksi")
    .insert({
      title: input.title,
      tab_label: input.tab_label,
      slug: input.slug,
      layout_type: input.layout_type,
      order_index: input.order_index ?? nextOrder(existing),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateSeksi(id: string, input: Partial<PengurusSeksiInput>) {
  const { error } = await supabase.from("pengurus_seksi").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteSeksi(id: string) {
// CASCADE delete handles associated groups & members via DB constraints
  const { error } = await supabase.from("pengurus_seksi").delete().eq("id", id);
  if (error) throw error;
}

// ─── CRUD: Group ─────────────────────────────────────────────────────────────

export async function createGrup(input: PengurusGrupInput, existing: PengurusGrup[]) {
  const { data, error } = await supabase
    .from("pengurus_grup")
    .insert({
      seksi_id: input.seksi_id,
      name: input.name,
      order_index: input.order_index ?? nextOrder(existing),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateGrup(id: string, input: Partial<PengurusGrupInput>) {
  const { error } = await supabase.from("pengurus_grup").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteGrup(id: string) {
  const { error } = await supabase.from("pengurus_grup").delete().eq("id", id);
  if (error) throw error;
}

// ─── CRUD: Member ───────────────────────────────────────────────────────────

export async function createAnggota(input: PengurusAnggotaInput, existing: PengurusAnggota[]) {
  const { error } = await supabase.from("pengurus_anggota").insert({
    seksi_id: input.seksi_id,
    grup_id: input.grup_id,
    name: input.name,
    role: input.role ?? null,
    description: input.description ?? null,
    bio: input.bio ?? null,
    email: input.email ?? null,
    phone: input.phone ?? null,
    photo_url: input.photo_url ?? null,
    variant: input.variant ?? "standard",
    order_index: input.order_index ?? nextOrder(existing),
  });
  if (error) throw error;
}

export async function updateAnggota(id: string, input: Partial<PengurusAnggotaInput>) {
  const { error } = await supabase.from("pengurus_anggota").update(input).eq("id", id);
  if (error) throw error;
}

export async function deleteAnggota(id: string) {
  const { error } = await supabase.from("pengurus_anggota").delete().eq("id", id);
  if (error) throw error;
}

// ─── Photo Upload (Supabase Storage) ─────────────────────────────────────────

const PHOTO_BUCKET = "pengurus";


function extFromMimeType(mimeType: string): string {
  const map: Record<string, string> = {
    "image/webp": "webp",
    "image/jpeg": "jpg",
    "image/png": "png",
  };
  return map[mimeType] ?? "jpg";
}

export async function uploadPengurusPhoto(file: File): Promise<string> {
  const ext = extFromMimeType(file.type);
  const fileName = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(PHOTO_BUCKET).upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(fileName);
  return data.publicUrl;
}

// ─── Reorder Helpers ─────────────────────────────────────────────────────────

export async function swapSeksiOrder(a: PengurusSeksi, b: PengurusSeksi) {
  await Promise.all([
    updateSeksi(a.id, { order_index: b.order_index }),
    updateSeksi(b.id, { order_index: a.order_index }),
  ]);
}

export async function swapGrupOrder(a: PengurusGrup, b: PengurusGrup) {
  await Promise.all([
    updateGrup(a.id, { order_index: b.order_index }),
    updateGrup(b.id, { order_index: a.order_index }),
  ]);
}

export async function swapAnggotaOrder(a: PengurusAnggota, b: PengurusAnggota) {
  await Promise.all([
    updateAnggota(a.id, { order_index: b.order_index }),
    updateAnggota(b.id, { order_index: a.order_index }),
  ]);
}

export async function deletePengurusPhoto(photoUrl: string) {
  const marker = `/${PHOTO_BUCKET}/`;
  const idx = photoUrl.indexOf(marker);
  if (idx === -1) return;
  const path = photoUrl.slice(idx + marker.length);
  if (!path) return;
  await supabase.storage.from(PHOTO_BUCKET).remove([path]);
}