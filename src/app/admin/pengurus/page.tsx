"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  X,
  ChevronUp,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
  ImagePlus,
  Loader2,
  User,
  Layers,
} from "lucide-react";
import { compressBeforeUpload } from "@/lib/image-compress";
import {
  getAllSeksi,
  createSeksi,
  updateSeksi,
  deleteSeksi,
  createGrup,
  updateGrup,
  deleteGrup,
  createAnggota,
  updateAnggota,
  deleteAnggota,
  uploadPengurusPhoto,
  deletePengurusPhoto,
  swapSeksiOrder,
  swapGrupOrder,
  swapAnggotaOrder,
  slugify,
  LAYOUT_TYPE_LABELS,
  type PengurusSeksi,
  type PengurusGrup,
  type PengurusAnggota,
  type LayoutType,
  type CardVariant,
} from "@/lib/pengurus";

// ─── UI bersama untuk modal dan input ───────────────────────────────────────

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-8 bg-background/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-border/85 bg-surface/95 p-7 md:p-8 shadow-md backdrop-blur-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-text-primary">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/50 text-text-secondary hover:text-primary hover:border-primary/40 transition-all cursor-pointer"
            aria-label="Tutup"
          >
            <X size={15} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-text-primary placeholder-text-secondary/50 outline-none transition-all focus:border-primary/50 focus:bg-background/80 focus:ring-4 focus:ring-primary/10";

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

const btnGhost =
  "inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-red-700 px-2.5 py-1.5 rounded-lg hover:bg-primary/15 border border-transparent hover:border-primary/30 transition-all cursor-pointer";

const btnDanger =
  "inline-flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all cursor-pointer";

// ─── Form seksi (buat / edit) ─────────────────────────────────────────────

type SeksiFormState = {
  title: string;
  tab_label: string;
  slug: string;
  layout_type: LayoutType;
};

function SeksiFormModal({
  editing,
  onClose,
  onSaved,
  existing,
}: {
  editing: PengurusSeksi | null;
  onClose: () => void;
  onSaved: () => void;
  existing: PengurusSeksi[];
}) {
  const [form, setForm] = useState<SeksiFormState>(
    editing
      ? {
          title: editing.title,
          tab_label: editing.tab_label,
          slug: editing.slug,
          layout_type: editing.layout_type,
        }
      : { title: "", tab_label: "", slug: "", layout_type: "single_group" }
  );
  const [slugTouched, setSlugTouched] = useState(!!editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.title.trim() || !form.tab_label.trim() || !form.slug.trim()) {
      setError("Judul, label tab, dan slug wajib diisi.");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await updateSeksi(editing.id, {
          title: form.title.trim(),
          tab_label: form.tab_label.trim(),
          slug: form.slug.trim(),
        });
      } else {
        const created = await createSeksi(
          {
            title: form.title.trim(),
            tab_label: form.tab_label.trim(),
            slug: form.slug.trim(),
            layout_type: form.layout_type,
          },
          existing
        );
        // single_group memerlukan satu grup tanpa nama agar anggota bisa ditempel
        if (form.layout_type === "single_group" && created) {
          await createGrup({ seksi_id: created.id, name: null }, []);
        }
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan seksi.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={editing ? "Edit Seksi" : "Tambah Seksi Baru"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Judul Seksi (tampil sebagai heading)">
          <input
            type="text"
            value={form.title}
            onChange={(e) => {
              const title = e.target.value;
              setForm((f) => ({
                ...f,
                title,
                slug: slugTouched ? f.slug : slugify(title),
                tab_label: f.tab_label || title,
              }));
            }}
            placeholder="mis. Badan Pekerja Rapat Pendeta"
            className={inputClass}
            required
          />
        </Field>

        <Field label="Label Tab (nav sticky, singkat)">
          <input
            type="text"
            value={form.tab_label}
            onChange={(e) => setForm((f) => ({ ...f, tab_label: e.target.value }))}
            placeholder="mis. BPRP"
            className={inputClass}
            required
          />
        </Field>

        <Field label="Slug (anchor URL, huruf kecil tanpa spasi)">
          <input
            type="text"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              setForm((f) => ({ ...f, slug: slugify(e.target.value) }));
            }}
            placeholder="mis. bprp"
            className={inputClass}
            required
          />
        </Field>

        <Field label="Tipe Layout">
          {editing ? (
            <div className="rounded-xl border border-border bg-background/30 px-4 py-3 text-sm text-text-secondary">
              {LAYOUT_TYPE_LABELS[form.layout_type]}
              <p className="text-[11px] text-text-secondary/60 mt-1">
                Tipe layout tidak bisa diubah setelah seksi dibuat.
              </p>
            </div>
          ) : (
            <select
              value={form.layout_type}
              onChange={(e) => setForm((f) => ({ ...f, layout_type: e.target.value as LayoutType }))}
              className={inputClass}
            >
              {(Object.keys(LAYOUT_TYPE_LABELS) as LayoutType[]).map((lt) => (
                <option key={lt} value={lt}>
                  {LAYOUT_TYPE_LABELS[lt]}
                </option>
              ))}
            </select>
          )}
        </Field>

        {error && <p className="text-xs font-semibold text-red-400">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className={btnGhost}>
            Batal
          </button>
          <button type="submit" disabled={saving} className={btnPrimary}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : null}
            {editing ? "Simpan Perubahan" : "Buat Seksi"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Form grup / komisi ─────────────────────────────────────────────────────

function GrupFormModal({
  seksiId,
  editing,
  existing,
  onClose,
  onSaved,
}: {
  seksiId: string;
  editing: PengurusGrup | null;
  existing: PengurusGrup[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(editing?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nama komisi/grup wajib diisi.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await updateGrup(editing.id, { name: name.trim() });
      } else {
        await createGrup({ seksi_id: seksiId, name: name.trim() }, existing);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan grup.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={editing ? "Edit Nama Komisi" : "Tambah Komisi Baru"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Nama Komisi">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="mis. Komisi 4"
            className={inputClass}
            required
          />
        </Field>
        {error && <p className="text-xs font-semibold text-red-400">{error}</p>}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className={btnGhost}>
            Batal
          </button>
          <button type="submit" disabled={saving} className={btnPrimary}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : null}
            Simpan
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Form anggota ───────────────────────────────────────────────────────────

type AnggotaFormState = {
  name: string;
  role: string;
  description: string;
  bio: string;
  email: string;
  phone: string;
  photo_url: string;
  variant: CardVariant;
};

function AnggotaFormModal({
  seksiId,
  grupId,
  layoutType,
  editing,
  existingSiblings,
  onClose,
  onSaved,
}: {
  seksiId: string;
  grupId: string | null;
  layoutType: LayoutType;
  editing: PengurusAnggota | null;
  existingSiblings: PengurusAnggota[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<AnggotaFormState>(
    editing
      ? {
          name: editing.name,
          role: editing.role ?? "",
          description: editing.description ?? "",
          bio: editing.bio ?? "",
          email: editing.email ?? "",
          phone: editing.phone ?? "",
          photo_url: editing.photo_url ?? "",
          variant: editing.variant,
        }
      : {
          name: "",
          role: "",
          description: "",
          bio: "",
          email: "",
          phone: "",
          photo_url: "",
          variant: grupId ? "compact" : layoutType === "leaders_grid" ? "standard" : "standard",
        }
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const showVariantSelect = layoutType === "leaders_grid" || grupId !== null;
  const variantOptions: { value: CardVariant; label: string }[] = grupId
    ? [
        { value: "standard", label: "Pimpinan grup (kartu besar) — Ketua/Sekretaris" },
        { value: "compact", label: "Anggota (kartu kecil)" },
      ]
    : [
        { value: "leader", label: "Pimpinan utama (kartu besar)" },
        { value: "standard", label: "Jabatan biasa (kartu grid)" },
      ];

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("File terlalu besar (maks 10MB sebelum kompresi).");
      return;
    }

    setUploading(true);
    setError("");
    try {
      const oldUrl = form.photo_url;
      const compressed = await compressBeforeUpload(file, "pengurus");
      const url = await uploadPengurusPhoto(compressed);
      setForm((f) => ({ ...f, photo_url: url }));
      if (oldUrl) await deletePengurusPhoto(oldUrl).catch(() => {});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah foto.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Nama wajib diisi.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        seksi_id: seksiId,
        grup_id: grupId,
        name: form.name.trim(),
        role: form.role.trim() || null,
        description: form.description.trim() || null,
        bio: form.bio.trim() || null,
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        photo_url: form.photo_url || null,
        variant: form.variant,
      };
      if (editing) {
        await updateAnggota(editing.id, payload);
      } else {
        await createAnggota(payload, existingSiblings);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan data pengurus.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title={editing ? "Edit Pengurus" : "Tambah Pengurus"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        {/* Photo */}
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 shrink-0 rounded-2xl overflow-hidden border border-border bg-background/40 flex items-center justify-center">
            {form.photo_url ? (
              <Image src={form.photo_url} alt="" fill sizes="80px" className="object-cover" />
            ) : (
              <User size={30} className="text-text-secondary/30" strokeWidth={1.5} />
            )}
          </div>
          <label className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-red-700 px-3.5 py-2.5 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 bg-background/30 cursor-pointer transition-all">
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
            {uploading ? "Mengunggah..." : "Unggah Foto"}
            <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} disabled={uploading} />
          </label>
        </div>

        <Field label="Nama Lengkap">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className={inputClass}
            required
          />
        </Field>

        <Field label="Jabatan / Role">
          <input
            type="text"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            placeholder="mis. Ketua, Bishop, Wilayah 3"
            className={inputClass}
          />
        </Field>

        <Field label="Deskripsi singkat (tampil di kartu, opsional)">
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="mis. cakupan wilayah pelayanan"
            className={inputClass}
          />
        </Field>

        {showVariantSelect && (
          <Field label="Ukuran Kartu">
            <select
              value={form.variant}
              onChange={(e) => setForm((f) => ({ ...f, variant: e.target.value as CardVariant }))}
              className={inputClass}
            >
              {variantOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
        )}

        <div className="pt-2 border-t border-border/50">
          <p className="text-[11px] font-bold uppercase tracking-wider text-text-secondary mb-3">
            Info Modal (muncul saat kartu diklik pengunjung)
          </p>
          <div className="space-y-4">
            <Field label="Bio Singkat">
              <textarea
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                rows={3}
                placeholder="Info singkat tentang pengurus ini..."
                className={`${inputClass} resize-none`}
              />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Email (opsional)">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className={inputClass}
                />
              </Field>
              <Field label="No. HP (opsional)">
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className={inputClass}
                />
              </Field>
            </div>
          </div>
        </div>

        {error && <p className="text-xs font-semibold text-red-400">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className={btnGhost}>
            Batal
          </button>
          <button type="submit" disabled={saving || uploading} className={btnPrimary}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : null}
            {editing ? "Simpan Perubahan" : "Tambah Pengurus"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Baris anggota untuk grup atau seksi ───────────────────────────────────

function AnggotaRow({
  anggota,
  siblings,
  onEdit,
  onDeleted,
  onReload,
}: {
  anggota: PengurusAnggota;
  siblings: PengurusAnggota[];
  onEdit: () => void;
  onDeleted: () => void;
  onReload: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const idx = siblings.findIndex((s) => s.id === anggota.id);

  async function move(direction: -1 | 1) {
    const target = siblings[idx + direction];
    if (!target) return;
    setBusy(true);
    try {
      await swapAnggotaOrder(anggota, target);
      onReload();
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirm(`Hapus "${anggota.name}" dari daftar pengurus?`)) return;
    setBusy(true);
    try {
      if (anggota.photo_url) await deletePengurusPhoto(anggota.photo_url).catch(() => {});
      await deleteAnggota(anggota.id);
      onDeleted();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border/45 bg-background/20 hover:bg-background/40 p-3 transition-all">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative h-9 w-9 shrink-0 rounded-lg overflow-hidden border border-border/60 bg-surface flex items-center justify-center">
          {anggota.photo_url ? (
            <Image src={anggota.photo_url} alt="" fill sizes="36px" className="object-cover" />
          ) : (
            <User size={15} className="text-text-secondary/40" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-text-primary">{anggota.name}</p>
          {anggota.role && <p className="text-[11px] text-text-secondary truncate">{anggota.role}</p>}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          disabled={busy || idx <= 0}
          onClick={() => move(-1)}
          className="h-7 w-7 flex items-center justify-center rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10 disabled:opacity-25 transition-all cursor-pointer"
          aria-label="Naikkan urutan"
        >
          <ChevronUp size={14} />
        </button>
        <button
          type="button"
          disabled={busy || idx >= siblings.length - 1}
          onClick={() => move(1)}
          className="h-7 w-7 flex items-center justify-center rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10 disabled:opacity-25 transition-all cursor-pointer"
          aria-label="Turunkan urutan"
        >
          <ChevronDown size={14} />
        </button>
        <button type="button" onClick={onEdit} className={btnGhost}>
          <Pencil size={12} /> Edit
        </button>
        <button type="button" disabled={busy} onClick={handleDelete} className={btnDanger}>
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

// ─── Halaman utama ───────────────────────────────────────────────────────────

type AnggotaCtx = { seksiId: string; grupId: string | null; layoutType: LayoutType };

export default function AdminPengurusPage() {
  const [seksiList, setSeksiList] = useState<PengurusSeksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const [seksiModal, setSeksiModal] = useState<{ open: boolean; editing: PengurusSeksi | null }>({
    open: false,
    editing: null,
  });
  const [grupModal, setGrupModal] = useState<{
    open: boolean;
    seksiId: string;
    editing: PengurusGrup | null;
  } | null>(null);
  const [anggotaModal, setAnggotaModal] = useState<{
    ctx: AnggotaCtx;
    editing: PengurusAnggota | null;
  } | null>(null);

  async function reload() {
    setLoadError("");
    try {
      const data = await getAllSeksi();
      setSeksiList(data);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Gagal memuat data pengurus.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
  }, []);

  function toggleExpand(id: string) {
    setExpanded((e) => ({ ...e, [id]: !e[id] }));
  }

  async function handleDeleteSeksi(seksi: PengurusSeksi) {
    if (
      !confirm(
        `Hapus seksi "${seksi.title}"? Semua grup dan data pengurus di dalamnya akan ikut terhapus permanen.`
      )
    )
      return;
    await deleteSeksi(seksi.id);
    reload();
  }

  async function handleDeleteGrup(grup: PengurusGrup) {
    if (!confirm(`Hapus komisi "${grup.name}"? Semua anggota di dalamnya akan ikut terhapus.`)) return;
    await deleteGrup(grup.id);
    reload();
  }

  async function moveSeksi(seksi: PengurusSeksi, direction: -1 | 1) {
    const idx = seksiList.findIndex((s) => s.id === seksi.id);
    const target = seksiList[idx + direction];
    if (!target) return;
    await swapSeksiOrder(seksi, target);
    reload();
  }

  async function moveGrup(seksi: PengurusSeksi, grup: PengurusGrup, direction: -1 | 1) {
    const idx = seksi.groups.findIndex((g) => g.id === grup.id);
    const target = seksi.groups[idx + direction];
    if (!target) return;
    await swapGrupOrder(grup, target);
    reload();
  }

  if (loading) {
    return <div className="py-24 text-center text-text-secondary">Memuat data pengurus...</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-primary">Struktur Organisasi</p>
          <h1 className="text-3xl font-extrabold text-text-primary mt-1">
            Kelola Pengurus
          </h1>
          <p className="mt-1.5 text-sm text-text-secondary">
            Atur seksi, komisi/grup, dan data pengurus yang tampil di halaman publik /pengurus.
          </p>
        </div>
        <button type="button" onClick={() => setSeksiModal({ open: true, editing: null })} className={btnPrimary}>
          <Plus size={16} /> Tambah Seksi
        </button>
      </div>

      {loadError && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs font-semibold text-red-300">
          {loadError}
        </div>
      )}

      {seksiList.length === 0 && !loadError && (
        <div className="rounded-2xl border border-border/60 bg-surface/20 p-10 text-center">
          <Users size={28} className="mx-auto text-text-secondary/40 mb-3" />
          <p className="text-sm text-text-secondary">Belum ada seksi pengurus. Mulai dengan menambah seksi baru.</p>
        </div>
      )}

      <div className="space-y-5">
        {seksiList.map((seksi, sIdx) => {
          const isOpen = expanded[seksi.id] ?? sIdx === 0;
          const isGrouped = seksi.layout_type === "komisi_groups" || seksi.layout_type === "single_group";
          const ctxDirect: AnggotaCtx = { seksiId: seksi.id, grupId: null, layoutType: seksi.layout_type };

          return (
            <div key={seksi.id} className="rounded-2xl border border-border bg-surface overflow-hidden">
              {/* Seksi header */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-5">
                <button
                  type="button"
                  onClick={() => toggleExpand(seksi.id)}
                  className="flex items-center gap-3 text-left cursor-pointer flex-1 min-w-0"
                >
                  <ChevronRightIcon
                    size={16}
                    className={`shrink-0 text-primary transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-bold text-text-primary text-base truncate">{seksi.title}</h2>
                      <span className="shrink-0 rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-primary">
                        {LAYOUT_TYPE_LABELS[seksi.layout_type].split(" (")[0]}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-secondary mt-0.5">
                      /pengurus#{seksi.slug} &middot; label tab: {seksi.tab_label}
                    </p>
                  </div>
                </button>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    disabled={sIdx === 0}
                    onClick={() => moveSeksi(seksi, -1)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10 disabled:opacity-25 transition-all cursor-pointer"
                    aria-label="Naikkan urutan seksi"
                  >
                    <ChevronUp size={15} />
                  </button>
                  <button
                    type="button"
                    disabled={sIdx === seksiList.length - 1}
                    onClick={() => moveSeksi(seksi, 1)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-primary hover:bg-background/50 disabled:opacity-25 transition-all cursor-pointer"
                    aria-label="Turunkan urutan seksi"
                  >
                    <ChevronDown size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSeksiModal({ open: true, editing: seksi })}
                    className={btnGhost}
                  >
                    <Pencil size={12} /> Edit
                  </button>
                  <button type="button" onClick={() => handleDeleteSeksi(seksi)} className={btnDanger}>
                    <Trash2 size={12} /> Hapus
                  </button>
                </div>
              </div>

              {isOpen && (
                <div className="border-t border-border/50 p-5 space-y-5 bg-background/10">
                  {/* Ungrouped members: leaders_grid & flat_grid */}
                  {!isGrouped && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-extrabold uppercase tracking-wider text-text-secondary">
                          Daftar Pengurus
                        </p>
                        <button
                          type="button"
                          onClick={() => setAnggotaModal({ ctx: ctxDirect, editing: null })}
                          className={btnGhost}
                        >
                          <Plus size={12} /> Tambah Pengurus
                        </button>
                      </div>
                      {seksi.members.length === 0 && (
                        <p className="text-xs text-text-secondary/70 text-center py-6 bg-surface/20 rounded-xl border border-border/40">
                          Belum ada pengurus di seksi ini.
                        </p>
                      )}
                      <div className="space-y-2">
                        {seksi.members.map((a) => (
                          <AnggotaRow
                            key={a.id}
                            anggota={a}
                            siblings={seksi.members}
                            onEdit={() => setAnggotaModal({ ctx: ctxDirect, editing: a })}
                            onDeleted={reload}
                            onReload={reload}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Grouped: komisi_groups & single_group */}
                  {isGrouped && (
                    <div className="space-y-5">
                      {seksi.layout_type === "komisi_groups" && (
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-extrabold uppercase tracking-wider text-text-secondary">
                            Daftar Komisi/Grup
                          </p>
                          <button
                            type="button"
                            onClick={() => setGrupModal({ open: true, seksiId: seksi.id, editing: null })}
                            className={btnGhost}
                          >
                            <Plus size={12} /> Tambah Komisi
                          </button>
                        </div>
                      )}

                      {seksi.groups.map((grup, gIdx) => {
                        const ctxGrup: AnggotaCtx = {
                          seksiId: seksi.id,
                          grupId: grup.id,
                          layoutType: seksi.layout_type,
                        };
                        return (
                          <div key={grup.id} className="rounded-xl border border-border/60 bg-surface/20 p-4">
                            {seksi.layout_type === "komisi_groups" && (
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <Layers size={14} className="text-primary" />
                                  <p className="text-sm font-bold text-text-primary">{grup.name}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    disabled={gIdx === 0}
                                    onClick={() => moveGrup(seksi, grup, -1)}
                                    className="h-7 w-7 flex items-center justify-center rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10 disabled:opacity-25 transition-all cursor-pointer"
                                    aria-label="Naikkan urutan komisi"
                                  >
                                    <ChevronUp size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    disabled={gIdx === seksi.groups.length - 1}
                                    onClick={() => moveGrup(seksi, grup, 1)}
                                    className="h-7 w-7 flex items-center justify-center rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10 disabled:opacity-25 transition-all cursor-pointer"
                                    aria-label="Turunkan urutan komisi"
                                  >
                                    <ChevronDown size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setGrupModal({ open: true, seksiId: seksi.id, editing: grup })}
                                    className={btnGhost}
                                  >
                                    <Pencil size={12} />
                                  </button>
                                  <button type="button" onClick={() => handleDeleteGrup(grup)} className={btnDanger}>
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-end mb-2">
                              <button
                                type="button"
                                onClick={() => setAnggotaModal({ ctx: ctxGrup, editing: null })}
                                className={btnGhost}
                              >
                                <Plus size={12} /> Tambah Orang
                              </button>
                            </div>

                            {grup.anggota.length === 0 && (
                              <p className="text-xs text-text-secondary/70 text-center py-4 bg-background/20 rounded-lg border border-border/30">
                                Belum ada anggota di grup ini.
                              </p>
                            )}

                            <div className="space-y-2">
                              {grup.anggota.map((a) => (
                                <AnggotaRow
                                  key={a.id}
                                  anggota={a}
                                  siblings={grup.anggota}
                                  onEdit={() => setAnggotaModal({ ctx: ctxGrup, editing: a })}
                                  onDeleted={reload}
                                  onReload={reload}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })}

                      {seksi.groups.length === 0 && (
                        <p className="text-xs text-text-secondary/70 text-center py-6 bg-surface/20 rounded-xl border border-border/40">
                          Belum ada grup. {seksi.layout_type === "komisi_groups" ? 'Klik "Tambah Komisi" di atas.' : ""}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {seksiModal.open && (
        <SeksiFormModal
          editing={seksiModal.editing}
          existing={seksiList}
          onClose={() => setSeksiModal({ open: false, editing: null })}
          onSaved={() => {
            setSeksiModal({ open: false, editing: null });
            reload();
          }}
        />
      )}

      {grupModal?.open && (
        <GrupFormModal
          seksiId={grupModal.seksiId}
          editing={grupModal.editing}
          existing={seksiList.find((s) => s.id === grupModal.seksiId)?.groups ?? []}
          onClose={() => setGrupModal(null)}
          onSaved={() => {
            setGrupModal(null);
            reload();
          }}
        />
      )}

      {anggotaModal && (
        <AnggotaFormModal
          seksiId={anggotaModal.ctx.seksiId}
          grupId={anggotaModal.ctx.grupId}
          layoutType={anggotaModal.ctx.layoutType}
          editing={anggotaModal.editing}
          existingSiblings={
            anggotaModal.ctx.grupId
              ? seksiList
                  .find((s) => s.id === anggotaModal.ctx.seksiId)
                  ?.groups.find((g) => g.id === anggotaModal.ctx.grupId)?.anggota ?? []
              : seksiList.find((s) => s.id === anggotaModal.ctx.seksiId)?.members ?? []
          }
          onClose={() => setAnggotaModal(null)}
          onSaved={() => {
            setAnggotaModal(null);
            reload();
          }}
        />
      )}
    </div>
  );
}