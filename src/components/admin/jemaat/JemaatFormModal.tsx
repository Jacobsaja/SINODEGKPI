"use client";

import { useEffect, useState } from "react";
import { X, Upload, Plus, Loader2, MapPin } from "lucide-react";
import Image from "next/image";
import {
  Jemaat,
  JemaatInput,
  createJemaat,
  updateJemaat,
  uploadJemaatPhoto,
  slugify,
} from "@/data/jemaat";

interface JemaatFormModalProps {
  /** Pass an existing jemaat to edit it, or null to create a new one. */
  jemaat: Jemaat | null;
  onClose: () => void;
  onSaved: (jemaat: Jemaat) => void;
}

const emptyForm = {
  nama: "",
  pendeta: "",
  alamat: "",
  telepon: "",
  kota: "",
  provinsi: "",
  lat: "",
  lng: "",
  resort_id: "",
  wilayah_id: "",
};

export default function JemaatFormModal({ jemaat, onClose, onSaved }: JemaatFormModalProps) {
  const isEditing = jemaat !== null;

  const [form, setForm] = useState(emptyForm);
  const [jadwal, setJadwal] = useState<string[]>([]);
  const [jadwalInput, setJadwalInput] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (jemaat) {
      setForm({
        nama: jemaat.nama,
        pendeta: jemaat.pendeta,
        alamat: jemaat.alamat,
        telepon: jemaat.telepon ?? "",
        kota: jemaat.kota,
        provinsi: jemaat.provinsi,
        lat: String(jemaat.lat),
        lng: String(jemaat.lng),
        resort_id: jemaat.resort_id ?? "",
        wilayah_id: jemaat.wilayah_id ?? "",
      });
      setJadwal(jemaat.jadwal_ibadah ?? []);
      setPhotoPreview(jemaat.foto || null);
    } else {
      setForm(emptyForm);
      setJadwal([]);
      setPhotoPreview(null);
    }
    setPhotoFile(null);
    setError(null);
  }, [jemaat]);

  function updateField<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function addJadwal() {
    const trimmed = jadwalInput.trim();
    if (!trimmed) return;
    setJadwal((j) => [...j, trimmed]);
    setJadwalInput("");
  }

  function removeJadwal(idx: number) {
    setJadwal((j) => j.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!form.nama.trim() || !form.pendeta.trim() || !form.alamat.trim() || !form.kota.trim() || !form.provinsi.trim()) {
      setError("Nama, pendeta, alamat, kota, dan provinsi wajib diisi.");
      return;
    }
    const lat = parseFloat(form.lat);
    const lng = parseFloat(form.lng);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setError("Latitude dan longitude harus berupa angka yang valid.");
      return;
    }

    setSaving(true);
    try {
      const id = jemaat?.id ?? slugify(form.nama);

      let foto = jemaat?.foto ?? "/churches/default.jpg";
      if (photoFile) {
        foto = await uploadJemaatPhoto(photoFile, id);
      }

      const payload: JemaatInput = {
        id,
        nama: form.nama.trim(),
        pendeta: form.pendeta.trim(),
        alamat: form.alamat.trim(),
        telepon: form.telepon.trim(),
        kota: form.kota.trim(),
        provinsi: form.provinsi.trim(),
        lat,
        lng,
        foto,
        resort_id: form.resort_id.trim() || undefined,
        wilayah_id: form.wilayah_id.trim() || undefined,
        jadwal_ibadah: jadwal.length > 0 ? jadwal : undefined,
      };

      const saved = isEditing
        ? await updateJemaat(jemaat!.id, payload)
        : await createJemaat(payload);

      onSaved(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan data jemaat.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar bg-surface border border-border rounded-2xl shadow-md">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-surface border-b border-border rounded-t-3xl">
          <h2 className="text-lg font-bold text-text-primary">
            {isEditing ? "Edit Data Jemaat" : "Tambah Jemaat Baru"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:bg-border/50 hover:text-text-primary transition-colors"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Photo upload */}
          <div>
            <Label>Foto Gereja</Label>
            <div className="flex items-center gap-4">
              <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-background border border-border shrink-0">
                {photoPreview ? (
                  <Image src={photoPreview} alt="Preview" fill className="object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <MapPin size={20} className="text-text-secondary/30" />
                  </div>
                )}
              </div>
              <label className="flex items-center gap-2 px-4 py-2.5 bg-background border border-border rounded-xl text-sm font-semibold text-text-secondary hover:border-primary/40 hover:text-text-primary cursor-pointer transition-all">
                <Upload size={14} />
                Pilih Foto
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </label>
            </div>
          </div>

          {/* Nama & Pendeta */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Nama Gereja *">
              <Input
                value={form.nama}
                onChange={(v) => updateField("nama", v)}
                placeholder="GKPI Jemaat Sion Medan"
              />
            </Field>
            <Field label="Pendeta *">
              <Input
                value={form.pendeta}
                onChange={(v) => updateField("pendeta", v)}
                placeholder="Pdt. Nama Pendeta, S.Th"
              />
            </Field>
          </div>

          {/* Alamat */}
          <Field label="Alamat Lengkap *">
            <textarea
              value={form.alamat}
              onChange={(e) => updateField("alamat", e.target.value)}
              rows={2}
              placeholder="Jl. Contoh No. 1, Kecamatan, Kota"
              className={inputClass}
            />
          </Field>

          {/* Kota, Provinsi, Telepon */}
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Kota *">
              <Input value={form.kota} onChange={(v) => updateField("kota", v)} placeholder="Medan" />
            </Field>
            <Field label="Provinsi *">
              <Input value={form.provinsi} onChange={(v) => updateField("provinsi", v)} placeholder="Sumatera Utara" />
            </Field>
            <Field label="Telepon">
              <Input value={form.telepon} onChange={(v) => updateField("telepon", v)} placeholder="+62 61 xxx xxxx" />
            </Field>
          </div>

          {/* Lat / Lng */}
          <div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Latitude *">
                <Input value={form.lat} onChange={(v) => updateField("lat", v)} placeholder="3.5916" />
              </Field>
              <Field label="Longitude *">
                <Input value={form.lng} onChange={(v) => updateField("lng", v)} placeholder="98.6658" />
              </Field>
            </div>
            <p className="text-[11px] text-text-secondary/60 mt-1.5">
              Tips: klik kanan lokasi gereja di Google Maps, lalu salin koordinat yang muncul (lat, lng).
            </p>
          </div>

          {/* Jadwal Ibadah */}
          <Field label="Jadwal Ibadah (opsional)">
            <div className="flex gap-2">
              <input
                type="text"
                value={jadwalInput}
                onChange={(e) => setJadwalInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addJadwal();
                  }
                }}
                placeholder="cth: Minggu, 08:00 WIB"
                className={inputClass}
              />
              <button
                type="button"
                onClick={addJadwal}
                className="shrink-0 px-3.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                aria-label="Tambah jadwal"
              >
                <Plus size={16} />
              </button>
            </div>
            {jadwal.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {jadwal.map((j, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-primary/10 text-primary"
                  >
                    {j}
                    <button type="button" onClick={() => removeJadwal(idx)} aria-label="Hapus jadwal">
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </Field>

          {/* Resort / Wilayah — Phase 2, optional */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Resort (opsional)">
              <Input value={form.resort_id} onChange={(v) => updateField("resort_id", v)} placeholder="Belum digunakan" />
            </Field>
            <Field label="Wilayah (opsional)">
              <Input value={form.wilayah_id} onChange={(v) => updateField("wilayah_id", v)} placeholder="Belum digunakan" />
            </Field>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 text-sm text-primary">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl border border-border text-text-secondary hover:text-text-primary hover:border-border/80 font-semibold text-sm transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-bold text-sm shadow-sm transition-colors"
            >
              {saving ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Menyimpan…
                </>
              ) : isEditing ? (
                "Simpan Perubahan"
              ) : (
                "Tambah Jemaat"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Small form primitives (kept local, matching existing input styling) ──────

const inputClass =
  "w-full bg-background border border-border text-text-primary placeholder:text-text-placeholder text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all";

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-bold uppercase tracking-widest text-text-secondary/60 mb-2">{children}</p>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={inputClass}
    />
  );
}
