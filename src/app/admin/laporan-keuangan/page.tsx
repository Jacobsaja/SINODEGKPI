"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { FinancialReport } from "@/lib/types";
import {
  getAllFinancialReportsAdmin,
  getFinancialReportById,
  createFinancialReport,
  updateFinancialReport,
  deleteFinancialReport,
  uploadFinancialReportFile,
  getMonthNameID,
  getAvailableYears,
  filterFinancialReports,
  formatFileSize,
} from "@/lib/laporan-keuangan";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Upload,
  FileText,
  X,
  ArrowLeft,
  Wallet,
  Calendar,
  ExternalLink,
} from "lucide-react";

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: getMonthNameID(i + 1),
}));

const emptyForm = {
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  name: "",
  description: "",
  file_url: "",
  file_path: "",
  file_name: "",
  file_size: 0,
  status: "draft" as "draft" | "published",
};

function formatDateTime(iso?: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
}

function LaporanKeuanganAdminContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [items, setItems] = useState<FinancialReport[]>([]);
  const [activeTab, setActiveTab] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [formError, setFormError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | "Semua">("Semua");

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    const editParam = searchParams.get("edit");
    const newParam = searchParams.get("action");

    if (tabParam === "form" || newParam === "new") {
      resetForm();
      setActiveTab("form");
    } else if (editParam) {
      const id = parseInt(editParam);
      if (!isNaN(id)) {
        const itemToEdit = items.find((i) => i.id === id);
        if (itemToEdit) {
          startEdit(itemToEdit);
        } else {
          loadSingleItemAndEdit(id);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, items]);

  async function loadItems() {
    const data = await getAllFinancialReportsAdmin();
    setItems(data);
  }

  async function loadSingleItemAndEdit(id: number) {
    const data = await getFinancialReportById(id);
    if (data) startEdit(data);
  }

  const availableYears = useMemo(() => getAvailableYears(items), [items]);

  const filteredItems = useMemo(
    () => filterFinancialReports(items, selectedYear, searchQuery),
    [items, selectedYear, searchQuery]
  );

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    setUploading(true);
    try {
      const uploaded = await uploadFinancialReportFile(file);
      setForm((prev) => ({
        ...prev,
        file_url: uploaded.url,
        file_path: uploaded.path,
        file_name: uploaded.name,
        file_size: uploaded.size,
      }));
    } catch (err) {
      setUploadError("Gagal upload file: " + (err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  function startEdit(item: FinancialReport) {
    setEditingId(item.id);
    setForm({
      month: item.month,
      year: item.year,
      name: item.name,
      description: item.description ?? "",
      file_url: item.file_url,
      file_path: item.file_path,
      file_name: item.file_name,
      file_size: item.file_size ?? 0,
      status: item.status,
    });
    setActiveTab("form");
  }

  function resetForm() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setUploadError("");
    setFormError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim()) {
      setFormError("Nama laporan wajib diisi.");
      return;
    }
    if (!form.file_url) {
      setFormError("Dokumen laporan wajib diunggah.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        month: form.month,
        year: form.year,
        name: form.name.trim(),
        description: form.description.trim() || null,
        file_url: form.file_url,
        file_path: form.file_path,
        file_name: form.file_name,
        file_size: form.file_size,
        status: form.status,
      };

      if (editingId) {
        await updateFinancialReport(editingId, payload);
      } else {
        await createFinancialReport(payload);
      }

      await loadItems();
      resetForm();
      setActiveTab("list");
      router.replace("/admin/laporan-keuangan");
    } catch (err) {
      setFormError("Gagal menyimpan: " + (err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: FinancialReport) {
    if (!confirm(`Hapus laporan "${item.name}"? Dokumen di storage juga akan dihapus.`)) return;
    try {
      await deleteFinancialReport(item.id, item.file_path);
      await loadItems();
    } catch (err) {
      alert("Gagal menghapus: " + (err as Error).message);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-text-primary">
            <Wallet size={20} className="text-primary" /> Laporan Keuangan
          </h1>
          <p className="mt-1 text-xs text-text-secondary">Kelola dokumen laporan keuangan sinode.</p>
        </div>
        {activeTab === "list" && (
          <button
            onClick={() => {
              resetForm();
              setActiveTab("form");
            }}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-background transition-all hover:bg-primary-dark"
          >
            <Plus size={14} /> Laporan Baru
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "list" ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Search & filter */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/60"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama, bulan, atau tahun..."
                  className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-text-primary outline-none focus:border-primary/40"
                />
              </div>
              <select
                value={selectedYear}
                onChange={(e) =>
                  setSelectedYear(e.target.value === "Semua" ? "Semua" : parseInt(e.target.value))
                }
                className="cursor-pointer rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary/40"
              >
                <option value="Semua">Semua Tahun</option>
                {availableYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface text-left text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                    <th className="p-4">Laporan</th>
                    <th className="p-4">Periode</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Dibuat</th>
                    <th className="p-4">Diubah</th>
                    <th className="p-4">Dipublikasikan</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="transition-colors hover:bg-surface/20">
                      <td className="max-w-[220px] p-4">
                        <a
                          href={item.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 truncate font-semibold text-text-primary hover:text-primary"
                        >
                          <FileText size={14} className="shrink-0 text-primary" />
                          <span className="truncate">{item.name}</span>
                          <ExternalLink size={11} className="shrink-0 text-text-secondary/50" />
                        </a>
                        {item.file_size ? (
                          <p className="mt-0.5 text-[10px] text-text-secondary/60">
                            {formatFileSize(item.file_size)}
                          </p>
                        ) : null}
                      </td>
                      <td className="whitespace-nowrap p-4 text-xs text-text-secondary">
                        {getMonthNameID(item.month)} {item.year}
                      </td>
                      <td className="p-4">
                        <span
                          className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
                            item.status === "published"
                              ? "bg-success/10 text-success"
                              : "bg-warning/10 text-warning"
                          }`}
                        >
                          {item.status === "published" ? "Terbit" : "Draft"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap p-4 text-xs text-text-secondary">
                        {formatDateTime(item.created_at)}
                      </td>
                      <td className="whitespace-nowrap p-4 text-xs text-text-secondary">
                        {formatDateTime(item.updated_at)}
                      </td>
                      <td className="whitespace-nowrap p-4 text-xs text-text-secondary">
                        {formatDateTime(item.published_at)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => startEdit(item)}
                            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-text-secondary hover:bg-primary/5 hover:text-primary"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-text-secondary hover:bg-primary/5 hover:text-primary"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-xs text-text-secondary">
                        Tidak ada laporan ditemukan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="space-y-5"
          >
            <button
              type="button"
              onClick={() => {
                resetForm();
                setActiveTab("list");
                router.replace("/admin/laporan-keuangan");
              }}
              className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-primary"
            >
              <ArrowLeft size={14} /> Kembali ke daftar
            </button>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {/* Left: info dasar */}
              <div className="space-y-5 rounded-2xl border border-border bg-surface/20 p-6 shadow-md md:col-span-2">
                <h4 className="border-b border-border pb-3 text-sm font-bold text-text-primary">
                  Informasi Laporan
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                      Bulan
                    </label>
                    <select
                      value={form.month}
                      onChange={(e) => setForm({ ...form, month: parseInt(e.target.value) })}
                      className="w-full cursor-pointer rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary/40"
                    >
                      {MONTHS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                      Tahun
                    </label>
                    <input
                      type="number"
                      value={form.year}
                      onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })}
                      className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary/40"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                    Nama Laporan
                  </label>
                  <input
                    type="text"
                    placeholder="mis. Laporan Keuangan Bulan Januari 2026"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary/40"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                    Deskripsi{" "}
                    <span className="font-normal normal-case text-text-secondary/60">
                      (opsional)
                    </span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Catatan singkat tentang laporan ini..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full resize-none rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary/40"
                  />
                </div>

                {formError && (
                  <p className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5 text-xs font-semibold text-primary">
                    {formError}
                  </p>
                )}
              </div>

              {/* Right: dokumen & status */}
              <div className="space-y-5 rounded-2xl border border-border bg-surface/20 p-6 shadow-md">
                <h4 className="flex items-center gap-1.5 border-b border-border pb-3 text-sm font-bold text-text-primary">
                  <FileText size={16} className="text-primary" /> Dokumen & Status
                </h4>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                    File Laporan (PDF/Gambar)
                  </label>
                  <div className="group relative flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/20 p-4 transition-all hover:border-primary/40">
                    <input
                      type="file"
                      accept="application/pdf,image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                    />
                    <Upload
                      size={22}
                      className="text-text-secondary transition-colors group-hover:text-primary"
                    />
                    <span className="mt-2 text-xs font-semibold text-text-primary">
                      Pilih File Laporan
                    </span>
                    <span className="mt-1 text-[10px] text-text-secondary/70">
                      Format PDF, PNG, atau JPG
                    </span>
                  </div>

                  {uploading && (
                    <div className="flex items-center justify-center gap-2 py-2 text-xs text-primary">
                      <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Mengunggah file...
                    </div>
                  )}
                  {uploadError && (
                    <p className="mt-1 text-center text-[10px] text-primary">{uploadError}</p>
                  )}

                  {form.file_url && !uploading && (
                    <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-background/40 p-3">
                      <FileText size={16} className="shrink-0 text-primary" />
                      <a
                        href={form.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 truncate text-xs font-semibold text-text-primary hover:text-primary"
                      >
                        {form.file_name || "Lihat file terlampir"}
                      </a>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            file_url: "",
                            file_path: "",
                            file_name: "",
                            file_size: 0,
                          }))
                        }
                        className="cursor-pointer text-text-secondary hover:text-primary"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border/80 bg-background/35 p-3.5">
                  <div>
                    <p className="text-xs font-bold text-text-primary">Publikasikan ke Jemaat</p>
                    <p className="mt-0.5 text-[10px] text-text-secondary">
                      Kalau nonaktif, laporan tersimpan sebagai draft
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.status === "published"}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.checked ? "published" : "draft" })
                    }
                    className="h-4.5 w-4.5 cursor-pointer rounded border-border bg-background/50 text-primary focus:ring-primary/40"
                  />
                </div>

                {editingId && (
                  <div className="space-y-1 rounded-xl border border-border/60 bg-background/20 p-3 text-[10px] text-text-secondary">
                    <p className="flex items-center gap-1.5">
                      <Calendar size={11} /> Dibuat:{" "}
                      {formatDateTime(items.find((i) => i.id === editingId)?.created_at)}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Calendar size={11} /> Diubah:{" "}
                      {formatDateTime(items.find((i) => i.id === editingId)?.updated_at)}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Calendar size={11} /> Dipublikasikan:{" "}
                      {formatDateTime(items.find((i) => i.id === editingId)?.published_at)}
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-2.5 pt-2">
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-primary py-3 text-xs font-bold text-background shadow-md shadow-primary/10 transition-all hover:bg-primary-dark disabled:opacity-50"
                  >
                    {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Simpan Laporan Baru"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setActiveTab("list");
                      router.replace("/admin/laporan-keuangan");
                    }}
                    className="w-full cursor-pointer rounded-xl border border-border py-3 text-xs font-bold text-text-secondary transition-all hover:bg-background/40 hover:text-primary"
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminLaporanKeuanganPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[400px] items-center justify-center text-sm font-semibold text-text-secondary">
          Memuat data laporan keuangan...
        </div>
      }
    >
      <LaporanKeuanganAdminContent />
    </Suspense>
  );
}