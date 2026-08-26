"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { detectFileType } from "@/lib/sharefile-types";
import {
  ArrowLeft,
  Copy,
  Check,
  RefreshCw,
  Image as ImageIcon,
  Upload,
  Trash2,
  Pencil,
  Plus,
  Search,
  Mail,
  KeyRound,
  BellOff,
  FileText,
  FileSpreadsheet,
  File as FileGeneric,
  X,
} from "lucide-react";

interface FolderDetail {
  id: string;
  title: string;
  description: string | null;
  cover_image_path: string | null;
  slug: string;
  status: "draft" | "published";
  is_active: boolean;
  access_mode: "email" | "code";
  access_code: string | null;
  published_at: string | null;
  last_action: string | null;
  last_action_at: string | null;
  created_at: string;
}

interface FileRow {
  id: string;
  folder_id: string;
  title: string;
  description: string | null;
  storage_path: string | null;
  original_filename: string | null;
  file_type: string | null;
  sort_order: number;
}

interface AccessRow {
  id: string;
  folder_id: string;
  name: string;
  email: string | null;
  created_at: string;
}

function fmtDateTime(iso: string | null) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function iconFor(type: string | null) {
  if (type === "pdf") return FileText;
  if (type === "xlsx") return FileSpreadsheet;
  return FileGeneric;
}

export default function ShareFolderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const folderId = params.id;

  const [folder, setFolder] = useState<FolderDetail | null>(null);
  const [files, setFiles] = useState<FileRow[]>([]);
  const [accessList, setAccessList] = useState<AccessRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [accessSearch, setAccessSearch] = useState("");
  const [showAddAccess, setShowAddAccess] = useState(false);
  const [accessForm, setAccessForm] = useState({ name: "", email: "" });
  const [savingAccess, setSavingAccess] = useState(false);

  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<"title" | "description" | null>(null);
  const [editValue, setEditValue] = useState("");
  const [uploadingFileId, setUploadingFileId] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [{ data: f }, { data: fl }, { data: ac }] = await Promise.all([
      supabase.from("share_folders").select("*").eq("id", folderId).maybeSingle(),
      supabase.from("share_folder_files").select("*").eq("folder_id", folderId).order("sort_order", { ascending: true }),
      supabase.from("share_folder_access").select("*").eq("folder_id", folderId).order("created_at", { ascending: false }),
    ]);
    setFolder(f as FolderDetail);
    setFiles((fl as FileRow[]) ?? []);
    setAccessList((ac as AccessRow[]) ?? []);

    if (f?.cover_image_path) {
      const { data: signed } = await supabase.storage
        .from("sharefiles")
        .createSignedUrl(f.cover_image_path, 3600);
      setCoverUrl(signed?.signedUrl ?? null);
    } else {
      setCoverUrl(null);
    }
    setLoading(false);
  }, [folderId]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  async function touch(action: string) {
    await supabase
      .from("share_folders")
      .update({ last_action: action, last_action_at: new Date().toISOString() })
      .eq("id", folderId);
  }

  // ---------- Status box actions ----------
  async function updateStatus(status: "draft" | "published") {
    const patch: Record<string, unknown> = {
      status,
      last_action: status === "published" ? "Folder diterbitkan" : "Folder dijadikan draf",
      last_action_at: new Date().toISOString(),
    };
    if (status === "published") patch.published_at = new Date().toISOString();
    await supabase.from("share_folders").update(patch).eq("id", folderId);
    loadAll();
  }

  async function toggleActive() {
    if (!folder) return;
    await supabase
      .from("share_folders")
      .update({
        is_active: !folder.is_active,
        last_action: !folder.is_active ? "Folder diaktifkan" : "Folder dinonaktifkan",
        last_action_at: new Date().toISOString(),
      })
      .eq("id", folderId);
    loadAll();
  }

  async function refreshLink() {
    if (!confirm("Buat ulang link folder? Link lama akan langsung berhenti berfungsi.")) return;
    const newSlug = Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4);
    await supabase
      .from("share_folders")
      .update({ slug: newSlug, last_action: "Link diperbarui", last_action_at: new Date().toISOString() })
      .eq("id", folderId);
    loadAll();
  }

  function copyLink() {
    if (!folder) return;
    const url = `${window.location.origin}/gkpi/sharefile/${folder.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ---------- Cover image ----------
  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !folder) return;
    setCoverUploading(true);
    const ext = file.name.split(".").pop();
    const path = `covers/${folder.id}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("sharefiles").upload(path, file, { upsert: true });
    if (!error) {
      await supabase.from("share_folders").update({ cover_image_path: path }).eq("id", folder.id);
      await touch("Gambar sampul diubah");
      loadAll();
    }
    setCoverUploading(false);
  }

  // ---------- Files ----------
  async function addFileSlot() {
    const nextOrder = files.length > 0 ? Math.max(...files.map((f) => f.sort_order)) + 1 : 0;
    await supabase.from("share_folder_files").insert({
      folder_id: folderId,
      title: `Dokumen ${files.length + 1}`,
      sort_order: nextOrder,
    });
    await touch("Menambah dokumen baru");
    loadAll();
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, fileRow: FileRow) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFileId(fileRow.id);
    const path = `files/${folderId}/${fileRow.id}-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("sharefiles").upload(path, file, { upsert: true });
    if (!error) {
      await supabase
        .from("share_folder_files")
        .update({
          storage_path: path,
          original_filename: file.name,
          file_type: detectFileType(file.name),
          file_size: file.size,
        })
        .eq("id", fileRow.id);
      await touch(`Berkas "${fileRow.title}" diunggah`);
      loadAll();
    }
    setUploadingFileId(null);
  }

  async function deleteFile(fileRow: FileRow) {
    if (!confirm(`Hapus "${fileRow.title}" dari folder ini?`)) return;
    if (fileRow.storage_path) {
      await supabase.storage.from("sharefiles").remove([fileRow.storage_path]);
    }
    await supabase.from("share_folder_files").delete().eq("id", fileRow.id);
    await touch(`Berkas "${fileRow.title}" dihapus`);
    loadAll();
  }

  function startEditFile(id: string, field: "title" | "description", current: string) {
    setEditingFileId(id);
    setEditingField(field);
    setEditValue(current ?? "");
  }

  async function saveEditFile() {
    if (!editingFileId || !editingField) return;
    await supabase
      .from("share_folder_files")
      .update({ [editingField]: editValue.trim() || null })
      .eq("id", editingFileId);
    await touch("Detail dokumen diperbarui");
    setEditingFileId(null);
    setEditingField(null);
    loadAll();
  }

  // ---------- Access ----------
  async function handleAddAccess(e: React.FormEvent) {
    e.preventDefault();
    if (!accessForm.name.trim()) return;
    if (folder?.access_mode === "email" && !accessForm.email.trim()) return;
    setSavingAccess(true);
    await supabase.from("share_folder_access").insert({
      folder_id: folderId,
      name: accessForm.name.trim(),
      email: accessForm.email.trim() || null,
    });
    await touch(`Akses ditambahkan untuk ${accessForm.name.trim()}`);
    setSavingAccess(false);
    setAccessForm({ name: "", email: "" });
    setShowAddAccess(false);
    loadAll();
  }

  async function removeAccess(row: AccessRow) {
    if (!confirm(`Cabut akses untuk ${row.name}?`)) return;
    await supabase.from("share_folder_access").delete().eq("id", row.id);
    await touch(`Akses ${row.name} dicabut`);
    loadAll();
  }

  const filteredAccess = accessList.filter(
    (a) =>
      a.name.toLowerCase().includes(accessSearch.toLowerCase()) ||
      (a.email ?? "").toLowerCase().includes(accessSearch.toLowerCase())
  );

  if (loading || !folder) {
    return <div className="py-20 text-center text-text-secondary">Memuat folder...</div>;
  }

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/gkpi/sharefile/${folder.slug}` : "";

  return (
    <div className="space-y-6">
      {/* Back + link */}
      <div className="space-y-3">
        <Link href="/admin/sharefiles" className="inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-primary transition-colors">
          <ArrowLeft size={14} /> Kembali ke Share Files
        </Link>

        <div className="flex flex-col md:flex-row md:items-center gap-3 rounded-2xl border border-border bg-surface p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary shrink-0">Link Folder</span>
          <code className="flex-1 truncate text-xs text-primary bg-background/40 rounded-lg px-3 py-2">{shareUrl}</code>
          <button
            onClick={copyLink}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-bold text-text-primary hover:border-primary/40 hover:text-primary transition-all cursor-pointer shrink-0"
          >
            {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
            {copied ? "Tersalin" : "Salin"}
          </button>
        </div>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">{folder.title}</h1>
        {folder.description && <p className="text-sm text-text-secondary mt-1">{folder.description}</p>}
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: cover + files */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cover */}
          <div className="rounded-2xl border border-border bg-surface/20 overflow-hidden">
            <div className="relative aspect-[21/9] bg-background/40 flex items-center justify-center">
              {coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverUrl || undefined} alt={folder.title} className="h-full w-full object-cover" />
              ) : (
                <ImageIcon size={32} className="text-text-secondary/40" />
              )}
              <label className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-lg bg-background/80 backdrop-blur px-3 py-2 text-xs font-bold text-text-primary cursor-pointer hover:bg-background hover:text-primary transition-all">
                <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} disabled={coverUploading} />
                <Upload size={13} />
                {coverUploading ? "Mengunggah..." : "Ubah Sampul"}
              </label>
            </div>
          </div>

          {/* Files */}
          <div className="rounded-2xl border border-border bg-surface/20 p-5 space-y-3">
            <h3 className="font-bold text-white text-sm">Dokumen</h3>

            {files.map((f, idx) => {
              const Icon = iconFor(f.file_type);
              return (
                <div key={f.id} className="rounded-xl border border-border/80 bg-background/30 p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                        <Icon size={16} />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        {editingFileId === f.id && editingField === "title" ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              autoFocus
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && saveEditFile()}
                              className="rounded-lg border border-primary/40 bg-background/60 px-2.5 py-1.5 text-sm text-text-primary outline-none w-full"
                            />
                            <button onClick={saveEditFile} className="text-success cursor-pointer shrink-0"><Check size={16} /></button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 group">
                            <p className="font-bold text-text-primary text-sm truncate">{f.title || `Dokumen ${idx + 1}`}</p>
                            <button onClick={() => startEditFile(f.id, "title", f.title)} className="opacity-0 group-hover:opacity-100 text-text-secondary hover:text-primary transition-all cursor-pointer shrink-0">
                              <Pencil size={11} />
                            </button>
                          </div>
                        )}

                        {editingFileId === f.id && editingField === "description" ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              autoFocus
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && saveEditFile()}
                              placeholder="Deskripsi singkat (opsional)"
                              className="rounded-lg border border-primary/40 bg-background/60 px-2.5 py-1.5 text-xs text-text-primary outline-none w-full"
                            />
                            <button onClick={saveEditFile} className="text-success cursor-pointer shrink-0"><Check size={14} /></button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 group">
                            <p className="text-xs text-text-secondary truncate">{f.description || "Tanpa deskripsi"}</p>
                            <button onClick={() => startEditFile(f.id, "description", f.description ?? "")} className="opacity-0 group-hover:opacity-100 text-text-secondary hover:text-primary transition-all cursor-pointer shrink-0">
                              <Pencil size={11} />
                            </button>
                          </div>
                        )}

                        {f.original_filename && (
                          <p className="text-[10px] text-text-secondary/70 truncate">Berkas: {f.original_filename}</p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => deleteFile(f)}
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-secondary hover:bg-red-500/10 hover:text-red-400 transition-all cursor-pointer"
                      title="Hapus Dokumen"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <label className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-2 text-xs font-semibold text-text-secondary hover:border-primary/40 hover:text-primary transition-all cursor-pointer">
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, f)} disabled={uploadingFileId === f.id} />
                    <Upload size={12} />
                    {uploadingFileId === f.id ? "Mengunggah..." : f.storage_path ? "Ganti Berkas" : "Unggah Berkas"}
                  </label>
                </div>
              );
            })}

            {files.length === 0 && (
              <p className="text-sm text-text-secondary text-center py-6">Belum ada dokumen. Tambahkan dokumen pertama.</p>
            )}

            <button
              onClick={addFileSlot}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-3 text-xs font-bold text-text-secondary hover:border-primary/40 hover:text-primary transition-all cursor-pointer"
            >
              <Plus size={14} /> Tambah Dokumen
            </button>
          </div>
        </div>

        {/* Right: status box */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface/20 p-5 space-y-4">
            <h3 className="font-bold text-white text-sm">Status</h3>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Status Terbit</label>
              <select
                value={folder.status}
                onChange={(e) => updateStatus(e.target.value as "draft" | "published")}
                className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary/40 transition-all cursor-pointer"
              >
                <option value="draft">Draf</option>
                <option value="published">Terbit</option>
              </select>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border/80 bg-background/30 p-3.5">
              <div>
                <p className="text-xs font-bold text-text-primary">Visibilitas Link</p>
                <p className="text-[10px] text-text-secondary mt-0.5">{folder.is_active ? "Aktif — link bisa diakses" : "Nonaktif — link ditolak"}</p>
              </div>
              <button
                onClick={toggleActive}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ease-in-out cursor-pointer ${folder.is_active ? "bg-success" : "bg-border"}`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${
                    folder.is_active ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="text-xs text-text-secondary space-y-1">
              <p>Waktu terbit: <span className="text-white font-medium">{fmtDateTime(folder.published_at)}</span></p>
              <p>Mode verifikasi: <span className="text-white font-medium">{folder.access_mode === "email" ? "Email terdaftar" : "Kode registrasi"}</span></p>
              {folder.access_mode === "code" && (
                <p>Kode: <span className="text-white font-mono font-medium">{folder.access_code}</span></p>
              )}
            </div>

            <button
              onClick={refreshLink}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-border py-2.5 text-xs font-bold text-text-secondary hover:border-primary/40 hover:text-primary transition-all cursor-pointer"
            >
              <RefreshCw size={13} /> Perbarui Link
            </button>
          </div>
        </div>
      </div>

      {/* Access section */}
      <div className="rounded-2xl border border-border bg-surface/20 p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h3 className="font-bold text-white text-sm">Akses</h3>
          <div className="flex gap-2.5">
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                value={accessSearch}
                onChange={(e) => setAccessSearch(e.target.value)}
                placeholder="Cari nama atau email..."
                className="rounded-xl border border-border bg-background/40 pl-9 pr-3 py-2 text-xs text-text-primary outline-none focus:border-primary/40 transition-all"
              />
            </div>
            <button
              onClick={() => setShowAddAccess((s) => !s)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark transition-all cursor-pointer"
            >
              <Plus size={13} /> Tambah Akses
            </button>
          </div>
        </div>

        {showAddAccess && (
          <form onSubmit={handleAddAccess} className="rounded-xl border border-border bg-background/30 p-4 space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <input
                required
                value={accessForm.name}
                onChange={(e) => setAccessForm({ ...accessForm, name: e.target.value })}
                placeholder="Nama pengakses"
                className="rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary/40 transition-all"
              />
              <input
                type="email"
                required={folder.access_mode === "email"}
                value={accessForm.email}
                onChange={(e) => setAccessForm({ ...accessForm, email: e.target.value })}
                placeholder={folder.access_mode === "email" ? "Email (wajib)" : "Email (opsional, untuk catatan)"}
                className="rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary/40 transition-all"
              />
            </div>
            <label className="flex items-center gap-2 text-xs text-text-secondary/70 cursor-not-allowed" title="Fitur notifikasi email belum dikonfigurasi — hubungi admin sistem">
              <input type="checkbox" disabled className="rounded border-border" />
              <BellOff size={13} />
              Kirim notifikasi email (belum dikonfigurasi)
            </label>
            <div className="flex gap-2.5">
              <button type="submit" disabled={savingAccess} className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white hover:bg-primary-dark transition-all disabled:opacity-50 cursor-pointer">
                {savingAccess ? "Menyimpan..." : "Simpan Akses"}
              </button>
              <button type="button" onClick={() => setShowAddAccess(false)} className="rounded-xl border border-border px-5 py-2 text-xs font-bold text-text-secondary hover:text-primary hover:border-primary/30 transition-all cursor-pointer">
                Batal
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background/30 text-left text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Email / Kode</th>
                <th className="px-4 py-3">Notifikasi</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccess.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-text-secondary">Belum ada pengakses terdaftar.</td>
                </tr>
              )}
              {filteredAccess.map((a) => (
                <tr key={a.id} className="border-b border-border/60">
                  <td className="px-4 py-3 font-semibold text-text-primary">{a.name}</td>
                  <td className="px-4 py-3 text-text-secondary">
                    <span className="inline-flex items-center gap-1.5">
                      {folder.access_mode === "email" ? <Mail size={13} /> : <KeyRound size={13} />}
                      {folder.access_mode === "email" ? (a.email ?? "-") : folder.access_code}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-text-secondary text-xs">Belum dikonfigurasi</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => removeAccess(a)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:bg-red-500/10 hover:text-red-400 transition-all cursor-pointer"
                      title="Cabut Akses"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
