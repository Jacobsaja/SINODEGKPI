"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  FolderLock,
  ArrowUpDown,
  Pencil,
  Check,
  X,
  Trash2,
  ChevronRight,
  FileStack,
} from "lucide-react";

interface FolderRow {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  status: "draft" | "published";
  is_active: boolean;
  access_mode: "email" | "code";
  last_action: string | null;
  last_action_at: string | null;
  created_at: string;
  share_folder_files: { count: number }[];
}

type SortField = "title" | "created_at";

function generateSlug() {
  return (
    Math.random().toString(36).slice(2, 8) +
    Date.now().toString(36).slice(-4)
  );
}

function formatDateTime(iso: string | null) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const emptyForm = {
  title: "",
  description: "",
  access_mode: "email" as "email" | "code",
  access_code: "",
};

export default function ShareFilesListPage() {
  const router = useRouter();
  const [folders, setFolders] = useState<FolderRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published">("all");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortAsc, setSortAsc] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const [editingCell, setEditingCell] = useState<{ id: string; field: "title" | "description" } | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    loadFolders();
  }, []);

  async function loadFolders() {
    setLoading(true);
    const { data, error } = await supabase
      .from("share_folders")
      .select("*, share_folder_files(count)")
      .order("created_at", { ascending: false });
    if (!error && data) setFolders(data as unknown as FolderRow[]);
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateError("");
    if (form.access_mode === "code" && !form.access_code.trim()) {
      setCreateError("Isi kode registrasi untuk folder ini.");
      return;
    }
    setCreating(true);
    const slug = generateSlug();
    const { data, error } = await supabase
      .from("share_folders")
      .insert({
        title: form.title.trim(),
        description: form.description.trim() || null,
        slug,
        access_mode: form.access_mode,
        access_code: form.access_mode === "code" ? form.access_code.trim() : null,
        status: "draft",
        is_active: true,
        last_action: "Folder dibuat",
        last_action_at: new Date().toISOString(),
      })
      .select()
      .single();

    setCreating(false);
    if (error || !data) {
      setCreateError("Gagal membuat folder: " + (error?.message ?? "unknown error"));
      return;
    }
    setShowCreate(false);
    setForm(emptyForm);
    router.push(`/admin/sharefiles/${data.id}`);
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Hapus folder "${title}"? Semua file & daftar akses di dalamnya ikut terhapus.`)) return;
    await supabase.from("share_folders").delete().eq("id", id);
    loadFolders();
  }

  function startEditCell(id: string, field: "title" | "description", current: string) {
    setEditingCell({ id, field });
    setEditValue(current ?? "");
  }

  async function saveEditCell() {
    if (!editingCell) return;
    const { id, field } = editingCell;
    await supabase
      .from("share_folders")
      .update({
        [field]: editValue.trim() || null,
        last_action: field === "title" ? "Judul diubah" : "Deskripsi diubah",
        last_action_at: new Date().toISOString(),
      })
      .eq("id", id);
    setEditingCell(null);
    loadFolders();
  }

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortAsc((prev) => !prev);
    } else {
      setSortField(field);
      setSortAsc(field === "title");
    }
  }

  const filtered = useMemo(() => {
    let list = folders.filter((f) => {
      const matchesSearch =
        f.title.toLowerCase().includes(search.toLowerCase()) ||
        (f.description ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || f.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortField === "title") cmp = a.title.localeCompare(b.title);
      else cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return sortAsc ? cmp : -cmp;
    });

    return list;
  }, [folders, search, statusFilter, sortField, sortAsc]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <FolderLock size={24} className="text-accent" />
            Share Files
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Folder dokumen yang hanya bisa diakses lewat link tersembunyi + verifikasi.
          </p>
        </div>
        <button
          onClick={() => setShowCreate((s) => !s)}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary-dark transition-all shadow-md shadow-primary/20 cursor-pointer"
        >
          <Plus size={16} />
          Buat Folder Baru
        </button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showCreate && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreate}
            className="overflow-hidden rounded-2xl border border-border bg-surface/30 p-6 space-y-4"
          >
            <h3 className="font-bold text-white text-sm">Folder Baru</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Judul Folder</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Contoh: Arsip Notulen Sinode 2026"
                  className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent/40 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Cara Verifikasi Akses</label>
                <select
                  value={form.access_mode}
                  onChange={(e) => setForm({ ...form, access_mode: e.target.value as "email" | "code" })}
                  className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent/40 transition-all cursor-pointer"
                >
                  <option value="email">Email terdaftar</option>
                  <option value="code">Kode registrasi</option>
                </select>
              </div>
            </div>

            {form.access_mode === "code" && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Kode Registrasi</label>
                <input
                  required
                  value={form.access_code}
                  onChange={(e) => setForm({ ...form, access_code: e.target.value })}
                  placeholder="Contoh: SINODE2026"
                  className="w-full md:w-1/2 rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent/40 transition-all"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Deskripsi (opsional)</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent/40 transition-all"
              />
            </div>

            {createError && <p className="text-xs font-semibold text-red-400">{createError}</p>}

            <div className="flex gap-2.5">
              <button
                type="submit"
                disabled={creating}
                className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-dark transition-all disabled:opacity-50 cursor-pointer"
              >
                {creating ? "Membuat..." : "Buat & Lanjutkan"}
              </button>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="rounded-xl border border-border px-5 py-2.5 text-xs font-bold text-text-secondary hover:text-white transition-all cursor-pointer"
              >
                Batal
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Search & filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul atau deskripsi folder..."
            className="w-full rounded-xl border border-border bg-surface/30 pl-11 pr-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent/40 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "all" | "draft" | "published")}
          className="rounded-xl border border-border bg-surface/30 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent/40 transition-all cursor-pointer"
        >
          <option value="all">Semua Status</option>
          <option value="draft">Draf</option>
          <option value="published">Terbit</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface/40 text-left text-[11px] font-bold uppercase tracking-wider text-text-secondary">
              <th className="px-5 py-3.5">
                <button onClick={() => toggleSort("title")} className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                  Judul <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="px-5 py-3.5">Deskripsi</th>
              <th className="px-5 py-3.5">
                <button onClick={() => toggleSort("created_at")} className="flex items-center gap-1.5 cursor-pointer hover:text-white">
                  Dibuat <ArrowUpDown size={12} />
                </button>
              </th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Status Terakhir</th>
              <th className="px-5 py-3.5 text-center">File</th>
              <th className="px-5 py-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-text-secondary">
                  Memuat data folder...
                </td>
              </tr>
            )}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-text-secondary">
                  Belum ada folder yang cocok. Buat folder baru untuk mulai membagikan dokumen.
                </td>
              </tr>
            )}

            {!loading &&
              filtered.map((f) => (
                <tr key={f.id} className="border-b border-border/60 hover:bg-surface/20 transition-colors">
                  <td className="px-5 py-3.5">
                    {editingCell?.id === f.id && editingCell.field === "title" ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          autoFocus
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && saveEditCell()}
                          className="rounded-lg border border-accent/40 bg-background/60 px-2.5 py-1.5 text-sm text-text-primary outline-none w-48"
                        />
                        <button onClick={saveEditCell} className="text-success cursor-pointer"><Check size={16} /></button>
                        <button onClick={() => setEditingCell(null)} className="text-text-secondary cursor-pointer"><X size={16} /></button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 group">
                        <Link href={`/admin/sharefiles/${f.id}`} className="font-bold text-text-primary hover:text-accent transition-colors">
                          {f.title}
                        </Link>
                        <button
                          onClick={() => startEditCell(f.id, "title", f.title)}
                          className="opacity-0 group-hover:opacity-100 text-text-secondary hover:text-accent transition-all cursor-pointer"
                        >
                          <Pencil size={12} />
                        </button>
                      </div>
                    )}
                  </td>

                  <td className="px-5 py-3.5 max-w-xs">
                    {editingCell?.id === f.id && editingCell.field === "description" ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          autoFocus
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && saveEditCell()}
                          className="rounded-lg border border-accent/40 bg-background/60 px-2.5 py-1.5 text-sm text-text-primary outline-none w-56"
                        />
                        <button onClick={saveEditCell} className="text-success cursor-pointer"><Check size={16} /></button>
                        <button onClick={() => setEditingCell(null)} className="text-text-secondary cursor-pointer"><X size={16} /></button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 group">
                        <span className="text-text-secondary truncate block max-w-[220px]">
                          {f.description || "-"}
                        </span>
                        <button
                          onClick={() => startEditCell(f.id, "description", f.description ?? "")}
                          className="opacity-0 group-hover:opacity-100 shrink-0 text-text-secondary hover:text-accent transition-all cursor-pointer"
                        >
                          <Pencil size={12} />
                        </button>
                      </div>
                    )}
                  </td>

                  <td className="px-5 py-3.5 text-text-secondary whitespace-nowrap">{formatDateTime(f.created_at)}</td>

                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                        f.status === "published"
                          ? "bg-success/10 text-success"
                          : "bg-text-secondary/10 text-text-secondary"
                      }`}
                    >
                      {f.status === "published" ? "Terbit" : "Draf"}
                    </span>
                    {!f.is_active && (
                      <span className="ml-1.5 inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-red-400">
                        Nonaktif
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-3.5 text-text-secondary whitespace-nowrap">
                    {f.last_action ? (
                      <>
                        <span className="text-text-primary font-medium">{f.last_action}</span>
                        <br />
                        <span className="text-[11px]">{formatDateTime(f.last_action_at)}</span>
                      </>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="px-5 py-3.5 text-center">
                    <span className="inline-flex items-center gap-1.5 text-text-secondary">
                      <FileStack size={14} />
                      {f.share_folder_files?.[0]?.count ?? 0}
                    </span>
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/sharefiles/${f.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-accent transition-colors cursor-pointer"
                      >
                        Buka <ChevronRight size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(f.id, f.title)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-red-500/10 hover:text-red-400 transition-all cursor-pointer"
                        title="Hapus Folder"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
