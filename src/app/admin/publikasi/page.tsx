"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Publication, PublicationCategory } from "@/lib/types";

const CATEGORIES: PublicationCategory[] = [
  "Renungan Harian",
  "Berita",
  "Pengumuman",
  "Kegiatan",
  "Dokumen",
];

const emptyForm = {
  title: "",
  excerpt: "",
  content: "",
  category: "Berita" as PublicationCategory,
  date: new Date().toISOString().slice(0, 10),
  author: "",
  image: "",
  read_time: "3 menit",
  views: 0,
  is_featured: false,
};

export default function AdminPublikasiPage() {
  const [session, setSession] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [items, setItems] = useState<Publication[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Cek status login saat halaman dibuka
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(!!data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, sess) =>
      setSession(!!sess)
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) loadItems();
  }, [session]);

  async function loadItems() {
    const { data, error } = await supabase
      .from("publications")
      .select("*")
      .order("date", { ascending: false });
    if (!error) setItems(data ?? []);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  // Upload file gambar yang dipilih admin ke Supabase Storage (bucket "publications"),
  // lalu simpan URL publiknya ke form.image.
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error } = await supabase.storage
      .from("publications")
      .upload(fileName, file, { upsert: false });

    if (error) {
      setUploadError("Gagal upload gambar: " + error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("publications").getPublicUrl(fileName);
    setForm((prev) => ({ ...prev, image: data.publicUrl }));
    setUploading(false);
  }

  function startEdit(item: Publication) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      category: item.category,
      date: item.date,
      author: item.author,
      image: item.image,
      read_time: item.read_time,
      views: item.views,
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
      await supabase.from("publications").update(form).eq("id", editingId);
    } else {
      await supabase.from("publications").insert(form);
    }
    setSaving(false);
    resetForm();
    loadItems();
  }

  async function handleDelete(id: number) {
    if (!confirm("Hapus publikasi ini?")) return;
    await supabase.from("publications").delete().eq("id", id);
    loadItems();
  }

  if (session === null) return null; // masih cek status login

  if (!session) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background text-text-primary px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm space-y-4 p-8 rounded-3xl border border-border bg-surface/50"
        >
          <h1 className="text-xl font-bold">Login Admin Publikasi</h1>
          {authError && <p className="text-sm text-red-400">{authError}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm"
            required
          />
          <button
            type="submit"
            className="w-full py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-all"
          >
            Masuk
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-text-primary px-4 py-10 md:px-10">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Kelola Publikasi</h1>
          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-accent hover:underline"
          >
            Keluar
          </button>
        </div>

        {/* Form tambah/edit */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-6 rounded-3xl border border-border bg-surface/40"
        >
          <h2 className="font-bold">
            {editingId ? "Edit Publikasi" : "Tambah Publikasi Baru"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Judul"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="rounded-xl border border-border bg-background/50 px-4 py-3 text-sm"
              required
            />
            <input
              placeholder="Penulis"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="rounded-xl border border-border bg-background/50 px-4 py-3 text-sm"
              required
            />
            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value as PublicationCategory })
              }
              className="rounded-xl border border-border bg-background/50 px-4 py-3 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="rounded-xl border border-border bg-background/50 px-4 py-3 text-sm"
              required
            />

            {/* Upload gambar ke Supabase Storage */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-semibold text-text-secondary">
                Gambar Publikasi
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
              placeholder="Estimasi baca (mis. 4 menit)"
              value={form.read_time}
              onChange={(e) => setForm({ ...form, read_time: e.target.value })}
              className="rounded-xl border border-border bg-background/50 px-4 py-3 text-sm"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
              />
              Jadikan renungan unggulan
            </label>
          </div>
          <textarea
            placeholder="Ringkasan singkat"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm"
            rows={2}
            required
          />
          <textarea
            placeholder="Isi lengkap"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm"
            rows={5}
            required
          />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving || uploading}
              className="px-6 py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : editingId ? "Simpan Perubahan" : "Tambah Publikasi"}
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

        {/* Daftar publikasi */}
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
                    alt={item.title}
                    className="h-12 w-12 rounded-lg object-cover border border-border"
                  />
                )}
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-xs text-text-secondary">
                    {item.category} · {item.date}
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
        </div>
      </div>
    </main>
  );
}
