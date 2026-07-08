"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";
import { formatRupiah } from "@/lib/products";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  Edit3,
  Trash2,
  Tag,
  DollarSign,
  Upload,
  Image as ImageIcon,
  X,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  ShoppingBag,
  ExternalLink
} from "lucide-react";

const emptyForm = {
  name: "",
  description: "",
  price: 0,
  category: "",
  image: "",
  tokopedia_url: "https://www.tokopedia.com/",
  shopee_url: "https://shopee.co.id/",
  is_featured: false,
};

function TokoAdminContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [items, setItems] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

  useEffect(() => {
    loadItems();
  }, []);

  // Listen to searchParams changes for deep links
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
  }, [searchParams, items]);

  async function loadItems() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setItems(data ?? []);
  }

  async function loadSingleItemAndEdit(id: number) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    
    if (!error && data) {
      startEdit(data);
    }
  }

  // Kategori yang sudah pernah dipakai ditawarkan sebagai saran (datalist)
  const existingCategories = useMemo(
    () => Array.from(new Set(items.map((p) => p.category))).sort(),
    [items]
  );

  // Upload file gambar produk ke Supabase Storage
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, file, { upsert: false });

    if (error) {
      setUploadError("Gagal upload gambar: " + error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("products").getPublicUrl(fileName);
    setForm((prev) => ({ ...prev, image: data.publicUrl }));
    setUploading(false);
  }

  function startEdit(item: Product) {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      tokopedia_url: item.tokopedia_url,
      shopee_url: item.shopee_url,
      is_featured: item.is_featured,
    });
    setActiveTab("form");
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
    setUploadError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    if (editingId) {
      await supabase.from("products").update(form).eq("id", editingId);
    } else {
      await supabase.from("products").insert(form);
    }
    setSaving(false);
    resetForm();
    loadItems();

    router.replace("/admin/toko");
    setActiveTab("list");
  }

  async function handleDelete(id: number) {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;
    await supabase.from("products").delete().eq("id", id);
    loadItems();
  }

  // Filtered products
  const filteredItems = items.filter((item) => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = 
      selectedCategory === "Semua" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-text-secondary uppercase tracking-widest">
            <span>Admin</span>
            <ChevronRight size={10} />
            <span className="text-accent">Toko</span>
          </div>
          <h1
            className="text-3xl font-extrabold text-white mt-1"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Kelola Toko
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Kelola merchandise, buku, literatur GKPI, alkitab, dan cinderamata jemaat lainnya.
          </p>
        </div>

        {/* Tab switch buttons */}
        <div className="flex shrink-0 items-center gap-2 rounded-xl bg-surface/50 p-1 border border-border">
          <button
            onClick={() => {
              setActiveTab("list");
              router.replace("/admin/toko");
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "list"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-text-secondary hover:text-white"
            }`}
          >
            Daftar Produk
          </button>
          <button
            onClick={() => {
              resetForm();
              setActiveTab("form");
              router.replace("/admin/toko?tab=form");
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "form"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-text-secondary hover:text-white"
            }`}
          >
            <Plus size={14} />
            Tambah Produk
          </button>
        </div>
      </div>

      {/* Main Content Areas */}
      <AnimatePresence mode="wait">
        {activeTab === "list" ? (
          <motion.div
            key="toko-list-tab"
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
                  placeholder="Cari berdasarkan nama atau deskripsi produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background/50 pl-10 pr-4 py-2.5 text-sm text-white placeholder-text-secondary/60 outline-none focus:border-accent/40 focus:bg-background"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-text-secondary shrink-0" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-xl border border-border bg-background/50 px-3.5 py-2.5 text-sm text-white outline-none focus:border-accent/40 cursor-pointer"
                >
                  <option value="Semua">Semua Kategori</option>
                  {existingCategories.map((c) => (
                    <option key={c} value={c}>{c}</option>
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
                      <th className="p-4 pl-6">Produk</th>
                      <th className="p-4">Kategori</th>
                      <th className="p-4">Harga</th>
                      <th className="p-4">Link Platform</th>
                      <th className="p-4 text-right pr-6">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-surface/30 transition-colors group">
                        <td className="p-4 pl-6 min-w-[280px]">
                          <div className="flex items-center gap-3.5">
                            {item.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-11 w-11 rounded-lg object-cover border border-border/80"
                              />
                            ) : (
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-surface/60 text-text-secondary border border-border/60">
                                <ShoppingBag size={18} />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-bold text-text-primary group-hover:text-accent transition-colors truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-text-secondary truncate mt-0.5 max-w-[240px]">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-block rounded-md border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-300">
                            {item.category || "Umum"}
                          </span>
                        </td>
                        <td className="p-4 text-xs font-bold text-accent whitespace-nowrap">
                          {formatRupiah(item.price)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {item.tokopedia_url && (
                              <a
                                href={item.tokopedia_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer"
                              >
                                Tokopedia
                                <ExternalLink size={8} />
                              </a>
                            )}
                            {item.shopee_url && (
                              <a
                                href={item.shopee_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 rounded bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 text-[9px] font-bold text-orange-400 hover:bg-orange-500/20 transition-all cursor-pointer"
                              >
                                Shopee
                                <ExternalLink size={8} />
                              </a>
                            )}
                          </div>
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
                                router.replace(`/admin/toko?edit=${item.id}`);
                              }}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface/50 text-text-secondary transition-all hover:border-accent/40 hover:text-white cursor-pointer"
                              title="Edit"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface/50 text-red-400 transition-all hover:border-red-500/40 hover:bg-red-500/10 cursor-pointer"
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
                          Tidak ada produk yang cocok dengan pencarian Anda.
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
            key="toko-form-tab"
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
                  router.replace("/admin/toko");
                }}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface/50 text-text-secondary hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
              </button>
              <div>
                <h3 className="font-bold text-white text-sm">
                  {editingId ? "Edit Detail Produk" : "Tambah Produk Baru"}
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Isi data produk dengan lengkap termasuk tautan e-commerce resmi gereja.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left Column - Main Content (2/3 width) */}
              <div className="lg:col-span-2 space-y-5 rounded-3xl border border-border bg-surface/20 p-6 shadow-md">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Nama Produk</label>
                  <input
                    type="text"
                    placeholder="Masukkan nama merchandise atau buku..."
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-white outline-none focus:border-accent/40 focus:bg-background transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary font-sans flex items-center gap-1"><DollarSign size={10} />Harga (Rp)</label>
                    <input
                      type="number"
                      min={0}
                      placeholder="Contoh: 150000"
                      value={form.price || ""}
                      onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm text-white outline-none focus:border-accent/40 focus:bg-background transition-all"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1"><Tag size={10} />Kategori Produk</label>
                    <input
                      list="product-categories"
                      placeholder="Contoh: Buku, Merchandise, Pakaian"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm text-white outline-none focus:border-accent/40 focus:bg-background transition-all"
                      required
                    />
                    <datalist id="product-categories">
                      {existingCategories.map((c) => (
                        <option key={c} value={c} />
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Deskripsi Lengkap Produk</label>
                  <textarea
                    placeholder="Masukkan spesifikasi produk, detail bahan, atau informasi penting lainnya..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-white outline-none focus:border-accent/40 focus:bg-background transition-all"
                    rows={8}
                    required
                  />
                </div>
              </div>

              {/* Right Column - Integrations & Media (1/3 width) */}
              <div className="space-y-5 rounded-3xl border border-border bg-surface/20 p-6 shadow-md">
                <h4 className="font-bold text-white text-sm border-b border-border pb-3 flex items-center gap-1.5">
                  <Tag size={16} className="text-accent" />
                  Media & Integrasi E-Commerce
                </h4>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Tautan Tokopedia</label>
                  <input
                    type="url"
                    placeholder="https://tokopedia.link/..."
                    value={form.tokopedia_url}
                    onChange={(e) => setForm({ ...form, tokopedia_url: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-xs text-white outline-none focus:border-accent/40 focus:bg-background transition-all"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Tautan Shopee</label>
                  <input
                    type="url"
                    placeholder="https://shopee.co.id/..."
                    value={form.shopee_url}
                    onChange={(e) => setForm({ ...form, shopee_url: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background/50 px-4 py-2.5 text-xs text-white outline-none focus:border-accent/40 focus:bg-background transition-all"
                    required
                  />
                </div>

                {/* Media Upload */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">Foto Produk</label>
                  <div className="relative flex flex-col items-center justify-center rounded-xl border border-dashed border-border hover:border-accent/40 bg-background/20 p-4 transition-all group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload size={22} className="text-text-secondary group-hover:text-accent transition-colors" />
                    <span className="text-xs font-semibold text-text-primary mt-2">Pilih Foto Produk</span>
                    <span className="text-[10px] text-text-secondary/70 mt-1">Format PNG, JPG maks. 2MB</span>
                  </div>
                  
                  {uploading && (
                    <div className="flex items-center gap-2 justify-center py-2 text-xs text-accent">
                      <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Mengunggah gambar...
                    </div>
                  )}
                  {uploadError && <p className="text-[10px] text-red-400 mt-1 text-center">{uploadError}</p>}
                  
                  {form.image && !uploading && (
                    <div className="relative group mt-3 aspect-square w-full overflow-hidden rounded-xl border border-border bg-background/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.image} alt="Pratinjau Produk" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, image: "" }))}
                        className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/80 hover:bg-red-600 text-white shadow-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="Hapus Foto"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center justify-between rounded-xl border border-border/80 bg-background/35 p-3.5">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-amber-400" />
                    <div>
                      <p className="text-xs font-bold text-white">Produk Unggulan</p>
                      <p className="text-[10px] text-text-secondary mt-0.5">Sematkan di sorotan toko utama</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                    className="h-4.5 w-4.5 rounded border-border bg-background/50 text-primary focus:ring-accent/40 cursor-pointer"
                  />
                </div>

                {/* Form Buttons */}
                <div className="pt-2 flex flex-col gap-2.5">
                  <button
                    type="submit"
                    disabled={saving || uploading}
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
                      "Simpan Produk Baru"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      setActiveTab("list");
                      router.replace("/admin/toko");
                    }}
                    className="w-full py-3 border border-border text-text-secondary text-xs font-bold rounded-xl hover:text-white hover:bg-background/40 transition-all cursor-pointer"
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

export default function AdminTokoPage() {
  return (
    <Suspense fallback={<div className="flex h-[400px] items-center justify-center text-text-secondary text-sm font-semibold">Memuat data toko...</div>}>
      <TokoAdminContent />
    </Suspense>
  );
}
