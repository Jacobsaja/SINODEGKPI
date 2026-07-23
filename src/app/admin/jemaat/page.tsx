"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, MapPin, Phone, User, Pencil, Trash2, Loader2, AlertCircle } from "lucide-react";
import { Jemaat, getAllJemaat, deleteJemaat } from "@/data/jemaat";
import JemaatFormModal from "@/components/admin/jemaat/JemaatFormModal";

export default function AdminJemaatPage() {
  const [churches, setChurches] = useState<Jemaat[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingJemaat, setEditingJemaat] = useState<Jemaat | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  async function loadChurches() {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getAllJemaat();
      setChurches(data);
    } catch {
      setLoadError("Gagal memuat data jemaat. Coba muat ulang halaman.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadChurches();
  }, []);

  const filtered = useMemo(() => {
    if (!searchQuery) return churches;
    const q = searchQuery.toLowerCase();
    return churches.filter(
      (j) =>
        j.nama.toLowerCase().includes(q) ||
        j.kota.toLowerCase().includes(q) ||
        j.pendeta.toLowerCase().includes(q)
    );
  }, [churches, searchQuery]);

  function openAddModal() {
    setEditingJemaat(null);
    setModalOpen(true);
  }

  function openEditModal(jemaat: Jemaat) {
    setEditingJemaat(jemaat);
    setModalOpen(true);
  }

  function handleSaved(saved: Jemaat) {
    setChurches((prev) => {
      const exists = prev.some((j) => j.id === saved.id);
      const next = exists ? prev.map((j) => (j.id === saved.id ? saved : j)) : [...prev, saved];
      return next.sort((a, b) => a.nama.localeCompare(b.nama));
    });
    setModalOpen(false);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteJemaat(id);
      setChurches((prev) => prev.filter((j) => j.id !== id));
    } catch {
      setLoadError("Gagal menghapus data jemaat.");
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Kelola Data Jemaat</h1>
          <p className="text-sm text-text-secondary mt-1">
            {churches.length} gereja terdaftar di peta Resort &amp; Wilayah.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary hover:bg-primary-dark text-white font-bold text-sm rounded-full shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shrink-0"
        >
          <Plus size={16} />
          Tambah Jemaat
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary/50 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari gereja, kota, atau pendeta…"
          className="w-full bg-surface border border-border text-text-primary placeholder:text-text-placeholder text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-sm"
        />
      </div>

      {loadError && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 text-sm text-primary">
          <AlertCircle size={15} className="shrink-0" />
          {loadError}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-2xl">
          <MapPin size={32} className="text-text-secondary/30 mb-3" />
          <p className="text-sm text-text-secondary">
            {searchQuery ? "Tidak ada gereja yang cocok." : "Belum ada data jemaat."}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((jemaat) => (
            <div
              key={jemaat.id}
              className="bg-surface border border-border rounded-2xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-sm hover:shadow-primary/5 transition-shadow"
            >
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  {jemaat.kota} · {jemaat.provinsi}
                </p>
                <p className="font-bold text-sm text-text-primary mt-1 leading-snug">{jemaat.nama}</p>
              </div>

              <div className="space-y-1.5 text-xs text-text-secondary">
                <p className="flex items-center gap-1.5 truncate">
                  <User size={11} className="shrink-0" />
                  {jemaat.pendeta}
                </p>
                <p className="flex items-center gap-1.5 truncate">
                  <MapPin size={11} className="shrink-0" />
                  {jemaat.alamat}
                </p>
                {jemaat.telepon && (
                  <p className="flex items-center gap-1.5 truncate">
                    <Phone size={11} className="shrink-0" />
                    {jemaat.telepon}
                  </p>
                )}
              </div>

              <div className="flex gap-2 mt-auto pt-2 border-t border-border/60">
                <button
                  onClick={() => openEditModal(jemaat)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl border border-border text-xs font-semibold text-text-secondary hover:text-text-primary hover:border-primary/40 transition-colors"
                >
                  <Pencil size={12} />
                  Edit
                </button>

                {confirmDeleteId === jemaat.id ? (
                  <button
                    onClick={() => handleDelete(jemaat.id)}
                    disabled={deletingId === jemaat.id}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-60 text-white text-xs font-bold transition-colors"
                  >
                    {deletingId === jemaat.id ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      "Yakin Hapus?"
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(jemaat.id)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl border border-border text-xs font-semibold text-text-secondary hover:text-primary hover:border-primary/40 transition-colors"
                  >
                    <Trash2 size={12} />
                    Hapus
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit modal */}
      {modalOpen && (
        <JemaatFormModal
          jemaat={editingJemaat}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
