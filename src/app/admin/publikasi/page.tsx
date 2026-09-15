"use client";

import { useEffect, useState, useCallback, useContext, Suspense } from "react";
import { AdminDepartmentContext } from "@/app/admin/layout";
import { supabase } from "@/lib/supabase";
import { compressBeforeUpload } from "@/lib/image-compress";
import {
  uploadPublikasiImages,
  uploadPublikasiDocuments,
  uploadPublikasiAudio,
  PUBLIKASI_IMAGE_ACCEPT,
  PUBLIKASI_DOCUMENT_ACCEPT,
  PUBLIKASI_AUDIO_ACCEPT,
} from "@/lib/publikasi-upload";
import {
  cleanupExpiredDevotions,
  deletePublicationMedia,
} from "@/lib/publikasi-cleanup";
import type { Publication, PublicationCategory, PublicationDepartment, PublicationDocument } from "@/lib/types";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar, 
  User, 
  Clock, 
  Upload, 
  X,
  FileText,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Check,
  Headphones,
  Volume2
} from "lucide-react";

const CATEGORIES: PublicationCategory[] = [
  "Renungan Harian",
  "Berita",
  "Pengumuman",
  "Kegiatan",
  "Dokumen",
];

const DEPARTMENTS_LIST: PublicationDepartment[] = [
  "Sinode",
  "Diakonat",
  "Apostolat",
  "Pastorat",
];

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  category: "Berita" as PublicationCategory,
  department: "Sinode" as PublicationDepartment,
  date: new Date().toISOString().slice(0, 10),
  author: "",
  image: "",
  images: [] as string[],
  documents: [] as PublicationDocument[],
  audio_url: "" as string | null,
  read_time: "3 menit",
  views: 0,
  is_featured: false,
};

function PublikasiAdminContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Ambil department dari context layout (null = super admin, string = scoped admin).
  const adminDepartment = useContext(AdminDepartmentContext);
  
  const [items, setItems] = useState<Publication[]>([]);
  const tabParam = searchParams.get("tab");
  const editParam = searchParams.get("edit");
  const newParam = searchParams.get("action");

  const [userTab, setUserTab] = useState<"list" | "form" | null>(null);
  const activeTab = userTab ?? ((tabParam === "form" || newParam === "new" || !!editParam) ? "form" : "list");
  const setActiveTab = (tab: "list" | "form") => setUserTab(tab);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(() => ({
    ...emptyForm,
    department: (adminDepartment ?? "Sinode") as PublicationDepartment,
  }));
  const [prevAdminDept, setPrevAdminDept] = useState(adminDepartment);
  if (prevAdminDept !== adminDepartment) {
    setPrevAdminDept(adminDepartment);
    if (adminDepartment !== null) {
      setForm((prev) => ({ ...prev, department: adminDepartment }));
    }
  }

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [galleryError, setGalleryError] = useState("");
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [docError, setDocError] = useState("");
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [audioError, setAudioError] = useState("");

  // State pencarian dan filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("Semua");
  const [showDepartmentFilter, setShowDepartmentFilter] = useState(false);

  // State untuk custom dropdown di Form
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isDepartmentDropdownOpen, setIsDepartmentDropdownOpen] = useState(false);

  // State untuk status pembersihan renungan > 30 hari
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [cleanupBanner, setCleanupBanner] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function initAndFetch() {
      // 1. Pembersihan otomatis renungan > 30 hari di background
      try {
        const cleanup = await cleanupExpiredDevotions(30);
        if (!ignore && cleanup.deletedCount > 0) {
          setCleanupBanner(
            `Sistem otomatis membersihkan ${cleanup.deletedCount} renungan berusia > 30 hari beserta ${cleanup.deletedFilesCount} file media dari penyimpanan.`
          );
        }
      } catch (err) {
        console.warn("Auto cleanup renungan error:", err);
      }

      // 2. Muat data publikasi terbaru
      const { data, error } = await supabase
        .from("publications")
        .select("*")
        .order("date", { ascending: false });
      if (!ignore && !error) setItems(data ?? []);
    }

    initAndFetch();
    return () => { ignore = true; };
  }, []);

  async function handleManualCleanup() {
    if (
      !confirm(
        "Apakah Anda yakin ingin membersihkan renungan harian yang usianya lebih dari 30 hari? Tindakan ini akan menghapus data beserta file audio, foto cover, galeri, dan dokumen dari server secara permanen."
      )
    ) {
      return;
    }

    setIsCleaningUp(true);
    try {
      const res = await cleanupExpiredDevotions(30);
      if (res.deletedCount > 0) {
        setCleanupBanner(
          `Berhasil membersihkan ${res.deletedCount} renungan dan ${res.deletedFilesCount} file media dari penyimpanan.`
        );
        loadItems();
      } else {
        setCleanupBanner("Tidak ada renungan yang berusia lebih dari 30 hari.");
      }
    } catch {
      setCleanupBanner("Gagal melakukan pembersihan renungan.");
    } finally {
      setIsCleaningUp(false);
      setTimeout(() => setCleanupBanner(null), 7000);
    }
  }

  const startEdit = useCallback((item: Publication) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      category: item.category,
      department: adminDepartment ?? item.department ?? "Sinode",
      date: item.date,
      author: item.author,
      image: item.image,
      images: item.images ?? [],
      documents: item.documents ?? [],
      audio_url: item.audio_url ?? item.document_url ?? "",
      read_time: item.read_time,
      views: item.views,
      is_featured: item.is_featured,
    });
    setUserTab("form");
  }, [adminDepartment]);

  // Pantau perubahan editParam untuk deep link
  useEffect(() => {
    if (!editParam) return;
    const id = parseInt(editParam);
    if (isNaN(id)) return;

    let ignore = false;
    async function fetchEditItem() {
      const itemToEdit = items.find((i) => i.id === id);
      if (itemToEdit) {
        if (!ignore) {
          startEdit(itemToEdit);
          setUserTab("form");
        }
      } else {
        const { data, error } = await supabase
          .from("publications")
          .select("*")
          .eq("id", id)
          .single();
        if (!ignore && !error && data) {
          startEdit(data);
          setUserTab("form");
        }
      }
    }
    fetchEditItem();
    return () => { ignore = true; };
  }, [editParam, items, startEdit]);

  async function loadItems() {
    const { data, error } = await supabase
      .from("publications")
      .select("*")
      .order("date", { ascending: false });
    if (!error) setItems(data ?? []);
  }

  // Upload gambar ke storage Supabase
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File terlalu besar (maks 10MB sebelum kompresi).");
      return;
    }

    setUploadError("");
    setUploading(true);

    try {
      const compressed = await compressBeforeUpload(file, "publikasi");

      // Selalu .webp karena compressBeforeUpload konversi ke image/webp
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;

      const { error } = await supabase.storage
        .from("publications")
        .upload(fileName, compressed, { upsert: false });

      if (error) {
        setUploadError("Gagal upload gambar: " + error.message);
        setUploading(false);
        return;
      }

      const { data } = supabase.storage.from("publications").getPublicUrl(fileName);
      setForm((prev) => ({ ...prev, image: data.publicUrl }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengupload gambar.";
      setUploadError(msg);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  // Upload galeri gambar tambahan (bisa pilih beberapa sekaligus, otomatis dikompres)
  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const oversized = files.find((f) => f.size > 10 * 1024 * 1024);
    if (oversized) {
      setGalleryError("Ada file lebih dari 10MB (sebelum kompresi).");
      return;
    }

    setGalleryError("");
    setUploadingGallery(true);
    try {
      const urls = await uploadPublikasiImages(files);
      setForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengupload galeri.";
      setGalleryError(msg);
    } finally {
      setUploadingGallery(false);
      e.target.value = "";
    }
  }

  function removeGalleryImage(index: number) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  // Upload lampiran dokumen (PDF/DOC/XLS, video sengaja tidak diizinkan)
  async function handleDocumentUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const oversized = files.find((f) => f.size > 20 * 1024 * 1024);
    if (oversized) {
      setDocError("Ada file lebih dari 20MB.");
      return;
    }

    setDocError("");
    setUploadingDocs(true);
    try {
      const docs = await uploadPublikasiDocuments(files);
      setForm((prev) => ({ ...prev, documents: [...prev.documents, ...docs] }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengupload dokumen.";
      setDocError(msg);
    } finally {
      setUploadingDocs(false);
      e.target.value = "";
    }
  }

  function removeDocument(index: number) {
    setForm((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  }

  function resetForm() {
    setEditingId(null);
    setForm({
      ...emptyForm,
      department: adminDepartment ?? "Sinode",
    });
    setUploadError("");
    setGalleryError("");
    setDocError("");
    setAudioError("");
    setIsCategoryDropdownOpen(false);
    setIsDepartmentDropdownOpen(false);
  }

  // Helper untuk memeriksa durasi audio
  function checkAudioDuration(file: File): Promise<number> {
    return new Promise((resolve) => {
      const audio = document.createElement("audio");
      audio.preload = "metadata";
      const objectUrl = URL.createObjectURL(file);
      audio.src = objectUrl;
      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(audio.duration || 0);
      };
      audio.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(0); // Fallback jika browser gagal membaca metadata
      };
    });
  }

  // Upload audio renungan (MP3/M4A/WAV, opsional, maks 5 menit & 3MB)
  async function handleAudioUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setAudioError("Ukuran file audio maksimal 3MB (sesuai batas durasi maksimal 5 menit).");
      return;
    }

    setAudioError("");
    setUploadingAudio(true);
    try {
      // Validasi durasi audio maksimal 5 menit (300 detik + 5 detik toleransi)
      const duration = await checkAudioDuration(file);
      if (duration > 305) {
        const mins = Math.floor(duration / 60);
        const secs = Math.round(duration % 60);
        throw new Error(`Durasi audio melebihi batas 5 menit (terdeteksi ${mins} menit ${secs} detik). Harap gunakan audio maksimal 5 menit.`);
      }

      const url = await uploadPublikasiAudio(file);
      setForm((prev) => ({ ...prev, audio_url: url }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengupload audio.";
      setAudioError(msg);
    } finally {
      setUploadingAudio(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    // Jika admin scoped, selalu gunakan adminDepartment dari context (bukan state form)
    // agar tidak bisa dimanipulasi dari client meskipun dropdown di-disabled secara visual.
    const safeDepartment: PublicationDepartment = adminDepartment ?? form.department;
    const payload = { 
      ...form, 
      department: safeDepartment,
      audio_url: form.audio_url || null,
      document_url: form.audio_url || null,
    };

    try {
      if (editingId) {
        const { error } = await supabase.from("publications").update(payload).eq("id", editingId);
        if (error && (error.message.includes("audio_url") || error.code === "PGRST204")) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { audio_url: _aud, ...fallbackPayload } = payload;
          await supabase.from("publications").update({ ...fallbackPayload, document_url: form.audio_url || null }).eq("id", editingId);
        }
      } else {
        const { error } = await supabase.from("publications").insert(payload);
        if (error && (error.message.includes("audio_url") || error.code === "PGRST204")) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { audio_url: _aud, ...fallbackPayload } = payload;
          await supabase.from("publications").insert({ ...fallbackPayload, document_url: form.audio_url || null });
        }
      }
    } catch (err) {
      console.error("Gagal menyimpan publikasi:", err);
    } finally {
      setSaving(false);
      resetForm();
      loadItems();
      
      // Bersihkan query params dan kembali ke daftar
      router.replace("/admin/publikasi");
      setActiveTab("list");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Apakah Anda yakin ingin menghapus publikasi ini beserta semua file medianya?")) return;
    const itemToDelete = items.find((i) => i.id === id);
    if (itemToDelete) {
      await deletePublicationMedia(itemToDelete);
    }
    await supabase.from("publications").delete().eq("id", id);
    loadItems();
  }

  // Daftar publikasi hasil filter
  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = 
      selectedCategory === "Semua" || item.category === selectedCategory;

    const matchesDepartment =
      adminDepartment !== null 
        ? (item.department ?? "Sinode") === adminDepartment 
        : selectedDepartment === "Semua" || (item.department ?? "Sinode") === selectedDepartment;

    return matchesSearch && matchesCategory && matchesDepartment;
  });

  const getPubCategoryStyle = (category: string) => {
    switch (category) {
      case "Renungan Harian":
        return "text-sky-300 bg-sky-400/10 border-sky-400/20";
      case "Berita":
        return "text-emerald-300 bg-emerald-400/10 border-emerald-400/20";
      case "Pengumuman":
        return "text-amber-300 bg-amber-400/10 border-amber-400/20";
      case "Kegiatan":
        return "text-purple-300 bg-purple-500/10 border-purple-500/20";
      case "Dokumen":
        return "text-rose-300 bg-rose-500/10 border-rose-500/20";
      default:
        return "text-slate-300 bg-slate-500/10 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-text-secondary uppercase tracking-widest">
            <span>Admin</span>
            <ChevronRight size={10} />
            <span className="text-primary">Publikasi</span>
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary mt-1">
            Kelola Publikasi
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Tulis renungan harian, warta jemaat, berita sinode, dan publikasikan dokumen resmi.
          </p>
        </div>

        {/* Tab switch buttons */}
        <div className="flex shrink-0 items-center gap-2 rounded-xl bg-surface p-1 border border-border">
          <button
            onClick={() => {
              setActiveTab("list");
              router.replace("/admin/publikasi");
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "list"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-text-secondary hover:text-primary"
            }`}
          >
            Daftar Publikasi
          </button>
          <button
            onClick={() => {
              resetForm();
              setActiveTab("form");
              router.replace("/admin/publikasi?tab=form");
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "form"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-text-secondary hover:text-primary"
            }`}
          >
            <Plus size={14} />
            Tambah Baru
          </button>
        </div>
      </div>

      {/* Main Content Areas */}
      <AnimatePresence mode="wait">
        {activeTab === "list" ? (
          <motion.div
            key="list-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* Notifikasi Pembersihan Otomatis/Manual */}
            <AnimatePresence>
              {cleanupBanner && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-xs text-primary shadow-sm"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles size={16} className="shrink-0 text-primary" />
                    <span className="font-medium">{cleanupBanner}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCleanupBanner(null)}
                    className="text-primary/70 hover:text-primary transition-colors cursor-pointer"
                    title="Tutup"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filter Bar */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between rounded-2xl border border-border bg-surface p-4">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan judul atau penulis..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background/50 pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder-text-secondary/60 outline-none focus:border-primary/40 focus:bg-background"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2 relative">
                <Filter size={16} className="text-text-secondary shrink-0" />
                
                {/* Filter Kategori */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCategoryFilter(!showCategoryFilter);
                      setShowDepartmentFilter(false);
                    }}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/50 px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 hover:border-primary/40 transition-all cursor-pointer min-w-[160px]"
                  >
                    <span className="font-medium">{selectedCategory === "Semua" ? "Semua Kategori" : selectedCategory}</span>
                    <ChevronDown size={14} className={`text-text-secondary transition-transform duration-200 ${showCategoryFilter ? "rotate-180 text-primary" : ""}`} />
                  </button>

                  {/* Overlay penutup dropdown */}
                  {showCategoryFilter && (
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowCategoryFilter(false)} 
                    />
                  )}

                  <AnimatePresence>
                    {showCategoryFilter && (
                      <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-surface p-1.5 shadow-xl z-50 flex flex-col origin-top-right"
                      >
                        <button
                          type="button"
                          onClick={() => { setSelectedCategory("Semua"); setShowCategoryFilter(false); }}
                          className={`text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-between ${selectedCategory === "Semua" ? "bg-primary/10 text-primary font-bold" : "text-text-secondary hover:text-text-primary hover:bg-background/80"}`}
                        >
                          <span>Semua Kategori</span>
                          {selectedCategory === "Semua" && <Check size={14} className="text-primary" />}
                        </button>
                        {CATEGORIES.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => { setSelectedCategory(c); setShowCategoryFilter(false); }}
                            className={`text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-between ${selectedCategory === c ? "bg-primary/10 text-primary font-bold" : "text-text-secondary hover:text-text-primary hover:bg-background/80"}`}
                          >
                            <span>{c}</span>
                            {selectedCategory === c && <Check size={14} className="text-primary" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Filter Departemen (Khusus Super Admin) */}
                {adminDepartment === null && (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDepartmentFilter(!showDepartmentFilter);
                        setShowCategoryFilter(false);
                      }}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/50 px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 hover:border-primary/40 transition-all cursor-pointer min-w-[160px]"
                    >
                      <span className="font-medium">{selectedDepartment === "Semua" ? "Semua Dept" : selectedDepartment}</span>
                      <ChevronDown size={14} className={`text-text-secondary transition-transform duration-200 ${showDepartmentFilter ? "rotate-180 text-primary" : ""}`} />
                    </button>

                    {showDepartmentFilter && (
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowDepartmentFilter(false)} 
                      />
                    )}

                    <AnimatePresence>
                      {showDepartmentFilter && (
                        <motion.div
                          initial={{ opacity: 0, y: 5, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-surface p-1.5 shadow-xl z-50 flex flex-col origin-top-right"
                        >
                          <button
                            type="button"
                            onClick={() => { setSelectedDepartment("Semua"); setShowDepartmentFilter(false); }}
                            className={`text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-between ${selectedDepartment === "Semua" ? "bg-primary/10 text-primary font-bold" : "text-text-secondary hover:text-text-primary hover:bg-background/80"}`}
                          >
                            <span>Semua Departemen</span>
                            {selectedDepartment === "Semua" && <Check size={14} className="text-primary" />}
                          </button>
                          {DEPARTMENTS_LIST.map((d) => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => { setSelectedDepartment(d); setShowDepartmentFilter(false); }}
                              className={`text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-between ${selectedDepartment === d ? "bg-primary/10 text-primary font-bold" : "text-text-secondary hover:text-text-primary hover:bg-background/80"}`}
                            >
                              <span>{d === "Sinode" ? "Sinode / Umum" : `Departemen ${d}`}</span>
                              {selectedDepartment === d && <Check size={14} className="text-primary" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Tombol Bersihkan Renungan Kadaluarsa (> 30 Hari) */}
                <button
                  type="button"
                  onClick={handleManualCleanup}
                  disabled={isCleaningUp}
                  title="Hapus permanen renungan berusia > 30 hari beserta file media di Supabase Storage"
                  className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-sm font-semibold text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/50 transition-all cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {isCleaningUp ? (
                    <svg className="animate-spin h-4 w-4 text-rose-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <Trash2 size={15} />
                  )}
                  <span>{isCleaningUp ? "Membersihkan..." : "Bersihkan Renungan >30 Hari"}</span>
                </button>
              </div>
            </div>

            {/* List / Table */}
            <div className="overflow-hidden rounded-2xl border border-border bg-surface/20 shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/70 bg-surface text-xs font-extrabold uppercase tracking-widest text-text-secondary">
                      <th className="p-4 pl-6">Publikasi</th>
                      <th className="p-4">Kategori</th>
                      <th className="p-4">Tanggal</th>
                      <th className="p-4">Dibaca</th>
                      <th className="p-4 text-right pr-6">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-surface transition-colors group">
                        <td className="p-4 pl-6 min-w-[280px]">
                          <div className="flex items-center gap-3.5">
                            {item.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.image || undefined}
                                alt={item.title}
                                className="h-11 w-11 rounded-lg object-cover border border-border/80"
                              />
                            ) : (
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface text-text-secondary border border-border/60">
                                <FileText size={18} />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-bold text-text-primary group-hover:text-primary transition-colors truncate">
                                {item.title}
                              </p>
                              <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
                                <User size={10} />
                                <span>{item.author}</span>
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col items-start gap-1">
                            <span className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getPubCategoryStyle(item.category)}`}>
                              {item.category}
                            </span>
                            <span className="inline-block rounded-md border border-border/60 bg-surface/60 px-2 py-0.5 text-[10px] font-semibold text-text-secondary">
                              {item.department ?? "Sinode"}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-xs font-semibold text-text-secondary whitespace-nowrap">
                          {new Date(item.date).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                          })}
                        </td>
                        <td className="p-4 text-xs text-text-secondary font-semibold">
                          {item.views.toLocaleString("id-ID")} x
                        </td>
                        <td className="p-4 text-right pr-6 whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2.5">
                            {item.is_featured && (
                              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-amber-400">
                                Featured
                              </span>
                            )}
                            <button
                              onClick={() => {
                                startEdit(item);
                                router.replace(`/admin/publikasi?edit=${item.id}`);
                              }}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-text-secondary transition-all hover:border-primary/40 hover:text-primary cursor-pointer"
                              title="Edit"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-red-400 transition-all hover:border-red-500/40 hover:bg-red-500/10 cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredItems.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-sm text-text-secondary">
                          Tidak ada publikasi yang cocok dengan pencarian Anda.
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
            key="form-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Form Top Actions Bar */}
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setActiveTab("list");
                  router.replace("/admin/publikasi");
                }}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h3 className="font-bold text-text-primary text-sm">
                  {editingId ? "Edit Publikasi Terdaftar" : "Buat Publikasi Baru"}
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Isi detail artikel secara teliti sebelum diterbitkan.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left Column - Main Content (2/3 width) */}
              <div className="lg:col-span-2 space-y-5 rounded-2xl border border-border bg-surface/20 p-6 shadow-md">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Judul Artikel</label>
                  <input
                    type="text"
                    placeholder="Masukkan judul publikasi yang menarik..."
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-text-primary outline-none focus:border-primary/40 focus:bg-background transition-all"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Ringkasan Singkat (Excerpt)</label>
                  <textarea
                    placeholder="Berikan 1-2 kalimat ringkasan artikel sebagai pratinjau..."
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-text-primary outline-none focus:border-primary/40 focus:bg-background transition-all"
                    rows={3}
                    maxLength={300}
                    required
                  />
                  <div className="flex justify-end">
                    <span className="text-[10px] text-text-secondary/70">
                      {form.excerpt.length}/300 karakter
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Isi Lengkap Artikel</label>
                  <textarea
                    placeholder="Ketik konten artikel secara lengkap di sini..."
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-text-primary outline-none focus:border-primary/40 focus:bg-background transition-all font-sans leading-relaxed"
                    rows={12}
                    required
                  />
                </div>
              </div>

              {/* Right Column - Sidebar Metadata (1/3 width) */}
              <div className="space-y-5 rounded-2xl border border-border bg-surface/20 p-6 shadow-md">
                <h4 className="font-bold text-text-primary text-sm border-b border-border pb-3 flex items-center gap-1.5">
                  <BookOpen size={16} className="text-primary" />
                  Metadata & Media
                </h4>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Penulis / Sumber</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                    <input
                      type="text"
                      placeholder="Nama Penulis / Tim Media"
                      value={form.author}
                      onChange={(e) => setForm({ ...form, author: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background/50 pl-10 pr-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary/40 focus:bg-background transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Custom Dropdown Kategori */}
                <div className="space-y-1.5 relative">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                    Kategori Publikasi
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCategoryDropdownOpen((prev) => !prev);
                        setIsDepartmentDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-text-primary outline-none hover:border-primary/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer shadow-sm"
                    >
                      <span className={`inline-block rounded-md border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${getPubCategoryStyle(form.category)}`}>
                        {form.category}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-text-secondary transition-transform duration-200 shrink-0 ${
                          isCategoryDropdownOpen ? "rotate-180 text-primary" : ""
                        }`}
                      />
                    </button>

                    {isCategoryDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsCategoryDropdownOpen(false)}
                        />
                        <div className="absolute left-0 right-0 top-full mt-2 rounded-xl border border-border bg-surface p-1.5 shadow-2xl z-50 flex flex-col space-y-1 backdrop-blur-xl">
                          {CATEGORIES.map((c) => {
                            const isSelected = form.category === c;
                            return (
                              <button
                                key={c}
                                type="button"
                                onClick={() => {
                                  setForm((prev) => ({ ...prev, category: c }));
                                  setIsCategoryDropdownOpen(false);
                                }}
                                className={`flex items-center justify-between px-3.5 py-2.5 text-sm rounded-lg transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-primary/15 text-primary font-bold"
                                    : "text-text-secondary hover:text-text-primary hover:bg-background/80 font-medium"
                                }`}
                              >
                                <span className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getPubCategoryStyle(c)}`}>
                                  {c}
                                </span>
                                {isSelected && <Check size={16} className="text-primary" />}
                              </button>
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Custom Dropdown Departemen Pengunggah */}
                <div className="space-y-1.5 relative">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
                    Departemen Pengunggah
                  </label>
                  {adminDepartment !== null ? (
                    <div className="w-full flex items-center justify-between rounded-xl border border-border/40 bg-surface/60 px-4 py-3 text-sm text-text-secondary opacity-80 cursor-not-allowed">
                      <span className="font-semibold">
                        {adminDepartment === "Sinode" ? "Sinode / Umum" : `Departemen ${adminDepartment}`}
                      </span>
                      <span className="text-[10px] text-amber-400/90 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                        Terkunci
                      </span>
                    </div>
                  ) : (
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setIsDepartmentDropdownOpen((prev) => !prev);
                          setIsCategoryDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-between rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-text-primary outline-none hover:border-primary/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer shadow-sm"
                      >
                        <span className="font-semibold text-text-primary">
                          {form.department === "Sinode" ? "Sinode / Umum" : `Departemen ${form.department}`}
                        </span>
                        <ChevronDown
                          size={16}
                          className={`text-text-secondary transition-transform duration-200 shrink-0 ${
                            isDepartmentDropdownOpen ? "rotate-180 text-primary" : ""
                          }`}
                        />
                      </button>

                      {isDepartmentDropdownOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsDepartmentDropdownOpen(false)}
                          />
                          <div className="absolute left-0 right-0 top-full mt-2 rounded-xl border border-border bg-surface p-1.5 shadow-2xl z-50 flex flex-col space-y-1 backdrop-blur-xl">
                            {DEPARTMENTS_LIST.map((d) => {
                              const isSelected = form.department === d;
                              return (
                                <button
                                  key={d}
                                  type="button"
                                  onClick={() => {
                                    setForm((prev) => ({ ...prev, department: d }));
                                    setIsDepartmentDropdownOpen(false);
                                  }}
                                  className={`flex items-center justify-between px-3.5 py-2.5 text-sm rounded-lg transition-all cursor-pointer ${
                                    isSelected
                                      ? "bg-primary/15 text-primary font-bold"
                                      : "text-text-secondary hover:text-text-primary hover:bg-background/80 font-medium"
                                  }`}
                                >
                                  <span>{d === "Sinode" ? "Sinode / Umum" : `Departemen ${d}`}</span>
                                  {isSelected && <Check size={16} className="text-primary" />}
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  {adminDepartment !== null && (
                    <p className="text-[10px] text-amber-400/80 font-semibold mt-1 flex items-center gap-1">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      Terkunci — akun departemen {adminDepartment}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Tanggal Terbit</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background/50 pl-10 pr-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary/40 focus:bg-background transition-all cursor-pointer"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Estimasi Waktu Baca</label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
                    <input
                      type="text"
                      placeholder="Contoh: 4 menit"
                      value={form.read_time}
                      onChange={(e) => setForm({ ...form, read_time: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background/50 pl-10 pr-4 py-2.5 text-sm text-text-primary outline-none focus:border-primary/40 focus:bg-background transition-all"
                    />
                  </div>
                </div>

                {/* File Upload Component */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Gambar Publikasi</label>
                  <div className="relative flex flex-col items-center justify-center rounded-xl border border-dashed border-border hover:border-primary/40 bg-background/20 p-4 transition-all group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload size={22} className="text-text-secondary group-hover:text-primary transition-colors" />
                    <span className="text-xs font-semibold text-text-primary mt-2">Pilih File Gambar</span>
                    <span className="text-[10px] text-text-secondary/70 mt-1">PNG/JPG, otomatis dikompres ke ~500KB</span>
                  </div>
                  
                  {uploading && (
                    <div className="flex items-center gap-2 justify-center py-2 text-xs text-primary">
                      <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Mengunggah gambar...
                    </div>
                  )}
                  {uploadError && <p className="text-[10px] text-red-400 mt-1 text-center">{uploadError}</p>}
                  
                  {form.image && !uploading && (
                    <div className="relative group mt-3 aspect-video w-full overflow-hidden rounded-xl border border-border bg-background/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.image || undefined} alt="Pratinjau" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, image: "" }))}
                        className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/80 hover:bg-red-600 text-white shadow-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Hapus Gambar"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Galeri Gambar Tambahan (banyak gambar, tampil di halaman detail) */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Galeri Gambar Tambahan</label>
                  <div className="relative flex flex-col items-center justify-center rounded-xl border border-dashed border-border hover:border-primary/40 bg-background/20 p-4 transition-all group">
                    <input
                      type="file"
                      accept={PUBLIKASI_IMAGE_ACCEPT}
                      multiple
                      onChange={handleGalleryUpload}
                      disabled={uploadingGallery}
                      className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload size={22} className="text-text-secondary group-hover:text-primary transition-colors" />
                    <span className="text-xs font-semibold text-text-primary mt-2">Tambah Gambar Galeri</span>
                    <span className="text-[10px] text-text-secondary/70 mt-1">Bisa pilih beberapa sekaligus, otomatis dikompres</span>
                  </div>

                  {uploadingGallery && (
                    <div className="flex items-center gap-2 justify-center py-2 text-xs text-primary">
                      <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Mengunggah gambar galeri...
                    </div>
                  )}
                  {galleryError && <p className="text-[10px] text-red-400 mt-1 text-center">{galleryError}</p>}

                  {form.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {form.images.map((url, i) => (
                        <div key={i} className="relative group aspect-square overflow-hidden rounded-lg border border-border bg-background/40">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url || undefined} alt={`Galeri ${i + 1}`} className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(i)}
                            className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-md bg-red-500/80 hover:bg-red-600 text-white shadow-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                            title="Hapus"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Lampiran Dokumen (PDF/DOC/XLS, banyak file, video tidak diizinkan) */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Lampiran Dokumen</label>
                  <div className="relative flex flex-col items-center justify-center rounded-xl border border-dashed border-border hover:border-primary/40 bg-background/20 p-4 transition-all group">
                    <input
                      type="file"
                      accept={PUBLIKASI_DOCUMENT_ACCEPT}
                      multiple
                      onChange={handleDocumentUpload}
                      disabled={uploadingDocs}
                      className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
                    />
                    <FileText size={22} className="text-text-secondary group-hover:text-primary transition-colors" />
                    <span className="text-xs font-semibold text-text-primary mt-2">Unggah Dokumen</span>
                    <span className="text-[10px] text-text-secondary/70 mt-1">PDF / DOC / XLS, maks 20MB per file</span>
                  </div>

                  {uploadingDocs && (
                    <div className="flex items-center gap-2 justify-center py-2 text-xs text-primary">
                      <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Mengunggah dokumen...
                    </div>
                  )}
                  {docError && <p className="text-[10px] text-red-400 mt-1 text-center">{docError}</p>}

                  {form.documents.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {form.documents.map((doc, i) => (
                        <div key={i} className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background/40 px-3 py-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText size={14} className="text-primary shrink-0" />
                            <span className="text-xs font-medium text-text-primary truncate">{doc.name}</span>
                            <span className="text-[10px] text-text-secondary shrink-0">{doc.size}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDocument(i)}
                            className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                            title="Hapus"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Audio Renungan (Opsional) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                      <Headphones size={14} className="text-primary" />
                      Audio Renungan
                    </label>
                    <span className="text-[10px] text-text-secondary/70 font-semibold bg-surface px-2 py-0.5 rounded border border-border/50">
                      Opsional
                    </span>
                  </div>

                  <div className="relative flex flex-col items-center justify-center rounded-xl border border-dashed border-border hover:border-primary/40 bg-background/20 p-4 transition-all group">
                    <input
                      type="file"
                      accept={PUBLIKASI_AUDIO_ACCEPT}
                      onChange={handleAudioUpload}
                      disabled={uploadingAudio}
                      className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Headphones size={22} className="text-text-secondary group-hover:text-primary transition-colors" />
                    <span className="text-xs font-semibold text-text-primary mt-2">
                      {form.audio_url ? "Ganti File Audio" : "Pilih File Audio"}
                    </span>
                    <span className="text-[10px] text-text-secondary/70 mt-1">MP3 / M4A / WAV / AAC, durasi maks 5 menit (maks 3MB)</span>
                  </div>

                  {uploadingAudio && (
                    <div className="flex items-center gap-2 justify-center py-2 text-xs text-primary">
                      <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Mengunggah audio...
                    </div>
                  )}
                  {audioError && <p className="text-[10px] text-red-400 mt-1 text-center">{audioError}</p>}

                  {form.audio_url && !uploadingAudio && (
                    <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-3 space-y-2 mt-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Volume2 size={15} className="text-primary shrink-0" />
                          <span className="text-xs font-semibold text-text-primary truncate">
                            Audio Terpasang
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setForm((prev) => ({ ...prev, audio_url: null }))}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                          title="Hapus Audio"
                        >
                          <X size={12} />
                          Hapus
                        </button>
                      </div>
                      <audio controls className="w-full h-8 accent-primary" src={form.audio_url} preload="none" />
                    </div>
                  )}
                </div>

                {/* Featured checkbox styled as switch container */}
                <div className="flex items-center justify-between rounded-xl border border-border/80 bg-background/35 p-3.5">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-400" />
                    <div>
                      <p className="text-xs font-bold text-text-primary">Renungan Unggulan</p>
                      <p className="text-[10px] text-text-secondary mt-0.5">Sematkan artikel di halaman utama</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                    className="h-4.5 w-4.5 rounded border-border bg-background/50 text-primary focus:ring-primary/40 cursor-pointer"
                  />
                </div>

                {/* Form submit/cancel buttons */}
                <div className="pt-2 flex flex-col gap-2.5">
                  <button
                    type="submit"
                    disabled={saving || uploading || uploadingGallery || uploadingDocs || uploadingAudio}
                    className="w-full py-3 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-all shadow-md shadow-primary/10 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Menyimpan...
                      </>
                    ) : editingId ? (
                      "Simpan Perubahan"
                    ) : (
                      "Terbitkan Artikel"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setActiveTab("list");
                      router.replace("/admin/publikasi");
                    }}
                    className="w-full py-3 border border-border text-text-secondary text-xs font-bold rounded-xl hover:text-primary hover:bg-background/40 transition-all cursor-pointer"
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

export default function AdminPublikasiPage() {
  return (
    <Suspense fallback={<div className="flex h-[400px] items-center justify-center text-text-secondary text-sm font-semibold">Memuat data publikasi...</div>}>
      <PublikasiAdminContent />
    </Suspense>
  );
}