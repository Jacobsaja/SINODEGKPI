"use client";

import { useEffect, useMemo, useState, Suspense, Fragment } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import type { FinancialReport, FinancialReportEntry } from "@/lib/types";
import {
  getAllFinancialReportsAdmin,
  getFinancialReportById,
  getFinancialReportHistoryWithChanges,
  createFinancialReport,
  updateFinancialReport,
  deleteFinancialReport,
  uploadFinancialReportFile,
  formatRupiah,
  getMonthNameID,
  type FinancialReportHistoryLogWithChanges,
} from "@/lib/laporan-keuangan";
import {
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Upload,
  FileText,
  X,
  ArrowLeft,
  ChevronRight,
  Wallet,
  History,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const MONTHS = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: getMonthNameID(i + 1) }));

const emptyForm = {
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  title: "",
  summary: "",
  file_url: "",
  entries: [] as FinancialReportEntry[],
  status: "published" as "draft" | "published",
  editor_name: "",
};

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
  const [editorEmail, setEditorEmail] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEditorEmail(data.user?.email ?? "");
    });
  }, []);

  // State pencarian & filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | "Semua">("Semua");

  // Riwayat edit per baris (expand di tabel)
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [historyLogs, setHistoryLogs] = useState<FinancialReportHistoryLogWithChanges[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  // Pantau perubahan searchParams untuk deep link (sama pola kayak admin/toko)
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

  // Saran kategori dari entries yang udah ada
  const existingCategories = useMemo(() => {
    const all = items.flatMap((r) => r.entries.map((e) => e.category));
    return Array.from(new Set(all)).filter(Boolean).sort();
  }, [items]);

  const availableYears = useMemo(
    () => Array.from(new Set(items.map((i) => i.year))).sort((a, b) => b - a),
    [items]
  );

  // Upload file laporan (PDF/gambar) ke storage bucket `financial-reports`
  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    setUploading(true);
    try {
      const url = await uploadFinancialReportFile(file);
      setForm((prev) => ({ ...prev, file_url: url }));
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
      title: item.title,
      summary: item.summary ?? "",
      file_url: item.file_url ?? "",
      entries: item.entries,
      status: item.status,
      editor_name: "",
    });
    setActiveTab("form");
  }

  function resetForm() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setUploadError("");
    setFormError("");
  }

  function addEntry(type: "income" | "expense") {
    setForm((prev) => ({
      ...prev,
      entries: [...prev.entries, { type, category: "", label: "", amount: 0 }],
    }));
  }

  function updateEntry(index: number, patch: Partial<FinancialReportEntry>) {
    setForm((prev) => ({
      ...prev,
      entries: prev.entries.map((e, i) => (i === index ? { ...e, ...patch } : e)),
    }));
  }

  function removeEntry(index: number) {
    setForm((prev) => ({
      ...prev,
      entries: prev.entries.filter((_, i) => i !== index),
    }));
  }

  // Total dihitung live di form buat UX — total resmi tetap dihitung ulang
  // di database lewat trigger, jadi gak akan pernah out-of-sync.
  const liveTotals = useMemo(() => {
    const income = form.entries.filter((e) => e.type === "income").reduce((s, e) => s + (e.amount || 0), 0);
    const expense = form.entries.filter((e) => e.type === "expense").reduce((s, e) => s + (e.amount || 0), 0);
    return { income, expense, balance: income - expense };
  }, [form.entries]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!form.title.trim()) {
      setFormError("Judul laporan wajib diisi.");
      return;
    }
    if (!form.editor_name.trim()) {
      setFormError("Nama Anda wajib diisi sebelum menyimpan.");
      return;
    }
    if (form.entries.length === 0) {
      setFormError("Tambahkan minimal satu rincian pemasukan atau pengeluaran.");
      return;
    }

    setSaving(true);
    try {
      const { editor_name, ...reportData } = form;
      const payload = { ...reportData, last_edited_by_name: editor_name };

      if (editingId) {
        await updateFinancialReport(editingId, payload);
      } else {
        await createFinancialReport(payload);
      }
      resetForm();
      await loadItems();
      router.replace("/admin/laporan-keuangan");
      setActiveTab("list");
    } catch (err) {
      setFormError("Gagal menyimpan laporan: " + (err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Yakin ingin menghapus laporan ini? Riwayat edit juga akan ikut terhapus.")) return;
    await deleteFinancialReport(id);
    loadItems();
  }

  async function toggleHistory(id: number) {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(id);
    setLoadingHistory(true);
    const logs = await getFinancialReportHistoryWithChanges(id);
    setHistoryLogs(logs);
    setLoadingHistory(false);
  }

  // Daftar laporan hasil filter
  const filteredItems = items.filter((item) => {
    const matchesYear = selectedYear === "Semua" || item.year === selectedYear;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      q === "" ||
      item.title.toLowerCase().includes(q) ||
      getMonthNameID(item.month).toLowerCase().includes(q) ||
      String(item.year).includes(q);
    return matchesYear && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-text-secondary uppercase tracking-widest">
            <span>Admin</span>
            <ChevronRight size={10} />
            <span className="text-accent">Laporan Keuangan</span>
          </div>
          <h1
            className="text-3xl font-extrabold text-text-primary mt-1"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Kelola Laporan Keuangan
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Buat laporan bulanan lengkap dengan rincian pemasukan/pengeluaran. Total dihitung otomatis dan setiap perubahan tercatat.
          </p>
        </div>

        {/* Tab switch buttons */}
        <div className="flex shrink-0 items-center gap-2 rounded-xl bg-surface/50 p-1 border border-border">
          <button
            onClick={() => {
              setActiveTab("list");
              router.replace("/admin/laporan-keuangan");
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "list"
                ? "bg-primary text-background shadow-md shadow-primary/20"
                : "text-text-secondary hover:text-accent"
            }`}
          >
            Daftar Laporan
          </button>
          <button
            onClick={() => {
              resetForm();
              setActiveTab("form");
              router.replace("/admin/laporan-keuangan?tab=form");
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "form"
                ? "bg-primary text-background shadow-md shadow-primary/20"
                : "text-text-secondary hover:text-accent"
            }`}
          >
            <Plus size={14} />
            Laporan Baru
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "list" ? (
          <motion.div
            key="lk-list-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Filter Bar */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between rounded-2xl border border-border bg-surface/30 p-4">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan bulan, tahun, atau judul..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background/50 pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder-text-secondary/60 outline-none focus:border-accent/40 focus:bg-background"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-text-secondary shrink-0" />
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value === "Semua" ? "Semua" : Number(e.target.value))}
                  className="rounded-xl border border-border bg-background/50 px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-accent/40 cursor-pointer"
                >
                  <option value="Semua">Semua Tahun</option>
                  {availableYears.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* List / Table */}
            <div className="overflow-hidden rounded-2xl border border-border bg-surface/20 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/70 bg-surface/60 text-xs font-extrabold uppercase tracking-widest text-text-secondary">
                      <th className="p-4 pl-6">Periode</th>
                      <th className="p-4">Pemasukan</th>
                      <th className="p-4">Pengeluaran</th>
                      <th className="p-4">Saldo</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right pr-6">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {filteredItems.map((item) => (
                      <Fragment key={item.id}>
                        <tr className="hover:bg-surface/30 transition-colors group">
                          <td className="p-4 pl-6 min-w-[220px]">
                            <div className="flex items-center gap-3.5">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                                <Wallet size={18} />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-text-primary group-hover:text-accent transition-colors truncate">
                                  {getMonthNameID(item.month)} {item.year}
                                </p>
                                <p className="text-xs text-text-secondary truncate mt-0.5 max-w-[220px]">
                                  {item.title}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-xs font-bold text-primary whitespace-nowrap">
                            {formatRupiah(item.total_income)}
                          </td>
                          <td className="p-4 text-xs font-bold text-accent whitespace-nowrap">
                            {formatRupiah(item.total_expense)}
                          </td>
                          <td
                            className={`p-4 text-xs font-bold whitespace-nowrap ${
                              item.ending_balance >= 0 ? "text-success" : "text-accent"
                            }`}
                          >
                            {formatRupiah(item.ending_balance)}
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                item.status === "published"
                                  ? "border-success/20 bg-success/10 text-success"
                                  : "border-warning/20 bg-warning/10 text-warning"
                              }`}
                            >
                              {item.status === "published" ? "Terbit" : "Draft"}
                            </span>
                          </td>
                          <td className="p-4 text-right pr-6 whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => toggleHistory(item.id)}
                                className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-all cursor-pointer ${
                                  expandedId === item.id
                                    ? "border-accent/40 bg-accent/10 text-accent"
                                    : "border-border bg-surface/50 text-text-secondary hover:border-accent/40 hover:text-accent"
                                }`}
                                title="Riwayat"
                              >
                                <History size={14} />
                              </button>
                              <button
                                onClick={() => {
                                  startEdit(item);
                                  router.replace(`/admin/laporan-keuangan?edit=${item.id}`);
                                }}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface/50 text-text-secondary transition-all hover:border-accent/40 hover:text-accent cursor-pointer"
                                title="Edit"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface/50 text-accent transition-all hover:border-accent/40 hover:bg-accent/10 cursor-pointer"
                                title="Hapus"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedId === item.id && (
                          <tr>
                            <td colSpan={6} className="bg-background/40 p-5 border-b border-border/40">
                              {loadingHistory ? (
                                <p className="text-xs text-text-secondary">Memuat riwayat...</p>
                              ) : historyLogs.length === 0 ? (
                                <p className="text-xs text-text-secondary">Belum ada riwayat perubahan.</p>
                              ) : (
                                <ol className="space-y-3">
                                  {historyLogs.map((log) => (
                                    <li key={log.id} className="flex items-start gap-3 text-xs">
                                      <span
                                        className={`mt-0.5 shrink-0 rounded-md border px-2 py-0.5 font-bold uppercase tracking-wide ${
                                          log.action === "created"
                                            ? "border-success/20 bg-success/10 text-success"
                                            : "border-primary/20 bg-primary/10 text-primary"
                                        }`}
                                      >
                                        {log.action === "created" ? "Dibuat" : "Diubah"}
                                      </span>
                                      <div className="flex-1">
                                        <p className="font-semibold text-text-primary">
                                          {log.changed_by_email ?? "Admin tidak diketahui"}
                                        </p>
                                        <p className="text-text-secondary mt-0.5">
                                          {new Date(log.changed_at).toLocaleString("id-ID", {
                                            dateStyle: "long",
                                            timeStyle: "short",
                                          })}
                                        </p>
                                        <ul className="mt-2 space-y-1 rounded-lg border border-border/50 bg-surface/40 p-2.5">
                                          {log.changes.map((c, ci) => (
                                            <li key={ci} className="text-text-secondary/90">
                                              &bull; {c}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </li>
                                  ))}
                                </ol>
                              )}
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                    {filteredItems.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-sm text-text-secondary">
                          Tidak ada laporan yang cocok dengan pencarian Anda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="lk-form-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Form Top Actions Bar */}
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface/40 p-4">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setActiveTab("list");
                  router.replace("/admin/laporan-keuangan");
                }}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface/50 text-text-secondary hover:text-accent transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h3 className="font-bold text-text-primary text-sm">
                  {editingId ? "Edit Laporan Keuangan" : "Buat Laporan Keuangan Baru"}
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Total pemasukan, pengeluaran, dan saldo dihitung otomatis dari rincian di bawah.
                </p>
              </div>
            </div>

            {formError && (
              <div className="rounded-xl border border-accent/20 bg-accent/10 p-4 text-xs font-semibold text-accent">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left Column - Data & Rincian (2/3 width) */}
              <div className="lg:col-span-2 space-y-5 rounded-3xl border border-border bg-surface/20 p-6 shadow-md">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Bulan</label>
                    <select
                      value={form.month}
                      onChange={(e) => setForm({ ...form, month: Number(e.target.value) })}
                      className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-text-primary outline-none focus:border-accent/40 focus:bg-background transition-all cursor-pointer"
                    >
                      {MONTHS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Tahun</label>
                    <input
                      type="number"
                      value={form.year}
                      onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                      className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-text-primary outline-none focus:border-accent/40 focus:bg-background transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Judul Laporan</label>
                  <input
                    type="text"
                    placeholder={`Contoh: Laporan Keuangan ${getMonthNameID(form.month)} ${form.year}`}
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-text-primary outline-none focus:border-accent/40 focus:bg-background transition-all"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                    Ringkasan (opsional)
                  </label>
                  <textarea
                    placeholder="Catatan singkat untuk jemaat, mis. penjelasan pos pengeluaran besar..."
                    value={form.summary}
                    onChange={(e) => setForm({ ...form, summary: e.target.value })}
                    rows={3}
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-text-primary outline-none focus:border-accent/40 focus:bg-background transition-all"
                  />
                </div>

                {/* Rincian Pemasukan */}
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-success flex items-center gap-1.5">
                      <TrendingUp size={12} /> Rincian Pemasukan
                    </label>
                    <button
                      type="button"
                      onClick={() => addEntry("income")}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-success hover:text-success/80 cursor-pointer"
                    >
                      <Plus size={12} /> Tambah
                    </button>
                  </div>
                  <div className="space-y-2">
                    {form.entries.map(
                      (entry, i) =>
                        entry.type === "income" && (
                          <div key={i} className="grid grid-cols-12 gap-2 items-center">
                            <input
                              list="lk-categories"
                              placeholder="Kategori"
                              value={entry.category}
                              onChange={(e) => updateEntry(i, { category: e.target.value })}
                              className="col-span-4 rounded-lg border border-border bg-background/50 px-3 py-2 text-xs text-text-primary outline-none focus:border-accent/40"
                            />
                            <input
                              placeholder="Keterangan"
                              value={entry.label}
                              onChange={(e) => updateEntry(i, { label: e.target.value })}
                              className="col-span-4 rounded-lg border border-border bg-background/50 px-3 py-2 text-xs text-text-primary outline-none focus:border-accent/40"
                            />
                            <input
                              type="number"
                              min={0}
                              placeholder="Jumlah"
                              value={entry.amount || ""}
                              onChange={(e) => updateEntry(i, { amount: Number(e.target.value) })}
                              className="col-span-3 rounded-lg border border-border bg-background/50 px-3 py-2 text-xs text-text-primary outline-none focus:border-accent/40"
                            />
                            <button
                              type="button"
                              onClick={() => removeEntry(i)}
                              className="col-span-1 inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:text-accent cursor-pointer"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )
                    )}
                    {form.entries.filter((e) => e.type === "income").length === 0 && (
                      <p className="text-xs text-text-secondary/70 italic">Belum ada rincian pemasukan.</p>
                    )}
                  </div>
                </div>

                {/* Rincian Pengeluaran */}
                <div className="space-y-2 pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
                      <TrendingDown size={12} /> Rincian Pengeluaran
                    </label>
                    <button
                      type="button"
                      onClick={() => addEntry("expense")}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-accent hover:text-accent/80 cursor-pointer"
                    >
                      <Plus size={12} /> Tambah
                    </button>
                  </div>
                  <div className="space-y-2">
                    {form.entries.map(
                      (entry, i) =>
                        entry.type === "expense" && (
                          <div key={i} className="grid grid-cols-12 gap-2 items-center">
                            <input
                              list="lk-categories"
                              placeholder="Kategori"
                              value={entry.category}
                              onChange={(e) => updateEntry(i, { category: e.target.value })}
                              className="col-span-4 rounded-lg border border-border bg-background/50 px-3 py-2 text-xs text-text-primary outline-none focus:border-accent/40"
                            />
                            <input
                              placeholder="Keterangan"
                              value={entry.label}
                              onChange={(e) => updateEntry(i, { label: e.target.value })}
                              className="col-span-4 rounded-lg border border-border bg-background/50 px-3 py-2 text-xs text-text-primary outline-none focus:border-accent/40"
                            />
                            <input
                              type="number"
                              min={0}
                              placeholder="Jumlah"
                              value={entry.amount || ""}
                              onChange={(e) => updateEntry(i, { amount: Number(e.target.value) })}
                              className="col-span-3 rounded-lg border border-border bg-background/50 px-3 py-2 text-xs text-text-primary outline-none focus:border-accent/40"
                            />
                            <button
                              type="button"
                              onClick={() => removeEntry(i)}
                              className="col-span-1 inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:text-accent cursor-pointer"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )
                    )}
                    {form.entries.filter((e) => e.type === "expense").length === 0 && (
                      <p className="text-xs text-text-secondary/70 italic">Belum ada rincian pengeluaran.</p>
                    )}
                  </div>
                </div>

                <datalist id="lk-categories">
                  {existingCategories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>

                {/* Live totals */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/50">
                  <div className="rounded-xl border border-success/20 bg-success/5 p-3 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-success">Pemasukan</p>
                    <p className="text-sm font-extrabold text-success mt-1">{formatRupiah(liveTotals.income)}</p>
                  </div>
                  <div className="rounded-xl border border-accent/20 bg-accent/5 p-3 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-accent">Pengeluaran</p>
                    <p className="text-sm font-extrabold text-accent mt-1">{formatRupiah(liveTotals.expense)}</p>
                  </div>
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Saldo</p>
                    <p className="text-sm font-extrabold text-primary mt-1">{formatRupiah(liveTotals.balance)}</p>
                  </div>
                </div>
              </div>

              {/* Right Column - Dokumen & Status (1/3 width) */}
              <div className="space-y-5 rounded-3xl border border-border bg-surface/20 p-6 shadow-md">
                <h4 className="font-bold text-text-primary text-sm border-b border-border pb-3 flex items-center gap-1.5">
                  <FileText size={16} className="text-accent" />
                  Dokumen & Status
                </h4>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                    File Laporan (PDF/Gambar)
                  </label>
                  <div className="relative flex flex-col items-center justify-center rounded-xl border border-dashed border-border hover:border-accent/40 bg-background/20 p-4 transition-all group">
                    <input
                      type="file"
                      accept="application/pdf,image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload size={22} className="text-text-secondary group-hover:text-accent transition-colors" />
                    <span className="text-xs font-semibold text-text-primary mt-2">Pilih File Laporan</span>
                    <span className="text-[10px] text-text-secondary/70 mt-1">Format PDF, PNG, atau JPG</span>
                  </div>

                  {uploading && (
                    <div className="flex items-center gap-2 justify-center py-2 text-xs text-accent">
                      <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Mengunggah file...
                    </div>
                  )}
                  {uploadError && <p className="text-[10px] text-accent mt-1 text-center">{uploadError}</p>}

                  {form.file_url && !uploading && (
                    <div className="flex items-center gap-2 mt-3 rounded-xl border border-border bg-background/40 p-3">
                      <FileText size={16} className="text-accent shrink-0" />
                      <a
                        href={form.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-text-primary hover:text-accent truncate flex-1"
                      >
                        Lihat file terlampir
                      </a>
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, file_url: "" }))}
                        className="text-text-secondary hover:text-accent cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Nama Pengedit (tampil ke publik) */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                    Nama Anda (tampil ke publik)
                  </label>
                  <input
                    type="text"
                    placeholder="Nama lengkap"
                    value={form.editor_name}
                    onChange={(e) => setForm({ ...form, editor_name: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent/40 focus:bg-background transition-all"
                    required
                  />
                  {editorEmail && (
                    <p className="text-[10px] text-text-secondary/60">
                      Login sebagai: {editorEmail} (tidak ditampilkan ke publik)
                    </p>
                  )}
                </div>

                {/* Publish Toggle */}
                <div className="flex items-center justify-between rounded-xl border border-border/80 bg-background/35 p-3.5">
                  <div>
                    <p className="text-xs font-bold text-text-primary">Publikasikan ke Jemaat</p>
                    <p className="text-[10px] text-text-secondary mt-0.5">Kalau nonaktif, laporan tersimpan sebagai draft</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.status === "published"}
                    onChange={(e) => setForm({ ...form, status: e.target.checked ? "published" : "draft" })}
                    className="h-4.5 w-4.5 rounded border-border bg-background/50 text-primary focus:ring-accent/40 cursor-pointer"
                  />
                </div>

                {/* Form Buttons */}
                <div className="pt-2 flex flex-col gap-2.5">
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="w-full py-3 bg-primary text-background text-xs font-bold rounded-xl hover:bg-primary-dark transition-all shadow-md shadow-primary/10 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Menyimpan...
                      </>
                    ) : editingId ? (
                      "Simpan Perubahan"
                    ) : (
                      "Simpan Laporan Baru"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setActiveTab("list");
                      router.replace("/admin/laporan-keuangan");
                    }}
                    className="w-full py-3 border border-border text-text-secondary text-xs font-bold rounded-xl hover:text-accent hover:bg-background/40 transition-all cursor-pointer"
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
        <div className="flex h-[400px] items-center justify-center text-text-secondary text-sm font-semibold">
          Memuat data laporan keuangan...
        </div>
      }
    >
      <LaporanKeuanganAdminContent />
    </Suspense>
  );
}