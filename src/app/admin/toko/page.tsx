"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";
import { formatRupiah } from "@/lib/products";

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

export default function AdminTokoPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setItems(data ?? []);
  }

  // Kategori yang sudah pernah dipakai, ditawarkan sebagai saran (datalist)
  // supaya admin tetap konsisten menamai kategori tapi bebas menambah baru.
  const existingCategories = useMemo(
    () => Array.from(new Set(items.map((p) => p.category))).sort(),
    [items]
  );

  // Upload file gambar produk ke Supabase Storage (bucket "products"),
  // lalu simpan URL publiknya ke form.image.
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
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus produk ini?")) return;
    await supabase.from("products").delete().eq("id", id);
    loadItems();
  }

  return (
    <div className="space-y-10">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-accent">
          Kelola Konten
        </p>
        <h1
          className="text-2xl font-bold text-white"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Toko
        </h1>
      </div>

      {/* Form tambah/edit */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 rounded-3xl border border-border bg-surface/40"
      >
        <h2 className="font-bold text-white">
          {editingId ? "Edit Produk" : "Tambah Produk Baru"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Nama Produk"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-xl border border-border bg-background/50 px-4 py-3 text-sm"
            required
          />
          <input
            type="number"
            min={0}
            placeholder="Harga (Rp)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            className="rounded-xl border border-border bg-background/50 px-4 py-3 text-sm"
            required
          />

          {/* Kategori: bebas ketik, dengan saran dari kategori yang sudah ada */}
          <div>
            <input
              list="product-categories"
              placeholder="Kategori (mis. Merchandise)"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm"
              required
            />
            <datalist id="product-categories">
              {existingCategories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_featured}
              onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
            />
            Jadikan produk unggulan
          </label>

          {/* Upload gambar ke Supabase Storage */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-semibold text-text-secondary">
              Gambar Produk
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-white file:text-xs file:font-bold"
            />
            {uploading && <p className="text-xs text-accent">Mengunggah gambar...</p>}
            {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
            {form.image && !uploading && (
              <div className="relative h-32 w-full max-w-xs overflow-hidden rounded-xl border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.image} alt="Pratinjau" className="h-full w-full object-cover" />
              </div>
            )}
          </div>

          <input
            placeholder="Link Tokopedia"
            value={form.tokopedia_url}
            onChange={(e) => setForm({ ...form, tokopedia_url: e.target.value })}
            className="rounded-xl border border-border bg-background/50 px-4 py-3 text-sm"
            required
          />
          <input
            placeholder="Link Shopee"
            value={form.shopee_url}
            onChange={(e) => setForm({ ...form, shopee_url: e.target.value })}
            className="rounded-xl border border-border bg-background/50 px-4 py-3 text-sm"
            required
          />
        </div>
        <textarea
          placeholder="Deskripsi produk"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm"
          rows={3}
          required
        />
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving || uploading}
            className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Produk"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-3 border border-border text-sm font-bold rounded-xl"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      {/* Daftar produk */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-surface/30"
          >
            <div className="flex items-center gap-3">
              {item.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-12 w-12 rounded-lg object-cover border border-border"
                />
              )}
              <div>
                <p className="font-semibold text-white">
                  {item.name}
                  {item.is_featured && (
                    <span className="ml-2 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">
                      Unggulan
                    </span>
                  )}
                </p>
                <p className="text-xs text-text-secondary">
                  {item.category} · {formatRupiah(item.price)}
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => startEdit(item)}
                className="text-xs font-bold text-accent hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-xs font-bold text-red-400 hover:underline"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-text-secondary">Belum ada produk.</p>
        )}
      </div>
    </div>
  );
}
