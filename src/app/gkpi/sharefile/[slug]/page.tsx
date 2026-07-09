"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  ShieldCheck,
  Download,
  FileText,
  FileSpreadsheet,
  FileType as FileIcon,
  Image as ImageIcon,
  File,
} from "lucide-react";

interface FileItem {
  id: string;
  title: string;
  description: string | null;
  original_filename: string | null;
  file_type: string | null;
}

function iconForType(type: string | null) {
  switch (type) {
    case "pdf":
      return FileText;
    case "xlsx":
      return FileSpreadsheet;
    case "docx":
    case "pptx":
      return FileIcon;
    case "image":
      return ImageIcon;
    default:
      return File;
  }
}

export default function ShareFilePublicPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [step, setStep] = useState<"gate" | "content">("gate");
  const [identifier, setIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [folderTitle, setFolderTitle] = useState("");
  const [folderDesc, setFolderDesc] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/sharefile/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, identifier }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal memverifikasi akses");
        return;
      }
      setFolderTitle(data.folder.title);
      setFolderDesc(data.folder.description);
      setName(data.name);
      setFiles(data.files);
      setStep("content");
    } catch {
      setError("Terjadi kesalahan jaringan, coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload(fileId: string) {
    setError("");
    setDownloadingId(fileId);
    try {
      const res = await fetch("/api/sharefile/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, identifier, fileId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal mengunduh file");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Terjadi kesalahan jaringan, coba lagi.");
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl">
        <AnimatePresence mode="wait">
          {step === "gate" && (
            <motion.form
              key="gate"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              onSubmit={handleVerify}
              className="rounded-3xl border border-border/80 bg-surface/40 backdrop-blur-2xl p-8 md:p-10 shadow-2xl space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-accent shadow-lg shadow-primary/20">
                  <Lock size={20} className="text-white" />
                </div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-accent">
                  GKPI Sinode
                </p>
                <h1 className="text-xl font-bold text-text-primary">Dokumen Terbatas</h1>
                <p className="text-xs text-text-secondary">
                  Masukkan email atau kode registrasi yang sudah didaftarkan admin untuk membuka folder ini.
                </p>
              </div>

              <input
                type="text"
                required
                autoFocus
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Email atau kode registrasi"
                className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-text-primary placeholder-text-secondary/50 outline-none focus:border-accent/40 focus:ring-4 focus:ring-accent/10 transition-all"
              />

              {error && <p className="text-xs font-semibold text-red-400 text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-all shadow-md shadow-primary/20 disabled:opacity-50 cursor-pointer"
              >
                {loading ? "Memeriksa..." : "Buka Folder"}
              </button>
            </motion.form>
          )}

          {step === "content" && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="rounded-3xl border border-border/80 bg-surface/40 backdrop-blur-2xl p-8 md:p-10 shadow-2xl space-y-8"
            >
              {/* Success banner */}
              <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-success/10 to-success/5 border border-success/20 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success/20">
                  <ShieldCheck size={20} className="text-success" />
                </div>
                <div>
                  <p className="text-sm font-bold text-success">Akses terverifikasi</p>
                  <p className="text-xs text-text-secondary mt-0.5">Anda memiliki akses untuk mengunduh dokumen</p>
                </div>
              </div>

              {/* Header */}
              <div className="text-center space-y-3">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30">
                  <ShieldCheck size={28} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-text-primary">
                    {folderTitle}
                  </h1>
                  {folderDesc && <p className="text-sm text-text-secondary mt-2">{folderDesc}</p>}
                </div>
                {name && (
                  <div className="inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/20 px-4 py-1.5">
                    <span className="text-xs font-semibold text-accent">{name}</span>
                  </div>
                )}
              </div>

              {/* File count */}
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-text-secondary">
                <span className="inline-flex h-2 w-2 rounded-full bg-accent"></span>
                {files.length} dokumen tersedia
              </div>

              {/* Files grid */}
              <div className="grid gap-3">
                {files.map((f, idx) => {
                  const Icon = iconForType(f.file_type);
                  const isDownloading = downloadingId === f.id;
                  return (
                    <motion.button
                      key={f.id}
                      onClick={() => handleDownload(f.id)}
                      disabled={isDownloading}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full flex items-center gap-4 rounded-2xl border border-border/60 bg-gradient-to-br from-background/50 to-background/30 p-5 text-left hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all disabled:opacity-50 cursor-pointer group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/0 to-accent/0 group-hover:from-accent/5 group-hover:via-accent/0 group-hover:to-accent/0 transition-all" />
                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 text-primary shadow-sm">
                        <Icon size={22} />
                      </div>
                      <div className="relative min-w-0 flex-1">
                        <p className="text-sm font-bold text-text-primary truncate group-hover:text-accent transition-colors">
                          {f.title || `Dokumen ${idx + 1}`}
                        </p>
                        {f.description && (
                          <p className="text-xs text-text-secondary truncate mt-1">{f.description}</p>
                        )}
                      </div>
                      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background/60 border border-border/60 group-hover:bg-accent/10 group-hover:border-accent/30 transition-all">
                        {isDownloading ? (
                          <svg className="animate-spin h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : (
                          <Download size={18} className="text-text-secondary group-hover:text-accent transition-colors" />
                        )}
                      </div>
                    </motion.button>
                  );
                })}

                {files.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-border/60 bg-background/30 p-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-border/20 mb-3">
                      <File size={24} className="text-text-secondary/50" />
                    </div>
                    <p className="text-sm text-text-secondary">
                      Belum ada dokumen di folder ini.
                    </p>
                  </div>
                )}
              </div>

              {error && (
                <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-center">
                  <p className="text-xs font-semibold text-red-400">{error}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
