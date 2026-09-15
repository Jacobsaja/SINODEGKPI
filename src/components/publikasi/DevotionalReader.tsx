"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Publication } from "@/lib/types";
import AudioPlayer from "@/components/AudioPlayer";
import BookmarkButton from "@/components/publikasi/BookmarkButton";
import ShareMenu from "@/components/publikasi/ShareMenu";
import GalleryLightbox from "@/components/publikasi/GalleryLightbox";
import {
  Calendar,
  User,
  Clock,
  Eye,
  ArrowLeft,
  BookOpen,
  Quote,
  Share2,
  Volume2,
  ChevronRight,
  Heart,
  Check,
  Headphones,
} from "lucide-react";

interface DevotionalReaderProps {
  post: Publication;
  audioUrl?: string | null;
  fullDate: string;
  formattedViews: string;
  relatedDevotions: Publication[];
  gallery: string[];
}

type FontSize = "normal" | "large" | "xlarge";

export default function DevotionalReader({
  post,
  audioUrl,
  fullDate,
  formattedViews,
  relatedDevotions,
  gallery,
}: DevotionalReaderProps) {
  const [fontSize, setFontSize] = useState<FontSize>("normal");
  const [copiedWa, setCopiedWa] = useState(false);
  const [showMobileStickyBar, setShowMobileStickyBar] = useState(false);

  // Pantau scroll untuk memunculkan Smart Sticky Header di Mobile
  useEffect(() => {
    const handleScroll = () => {
      // Munculkan sticky bar setelah scroll melewati 280px
      if (window.scrollY > 280) {
        setShowMobileStickyBar(true);
      } else {
        setShowMobileStickyBar(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Styling dinamis ukuran font untuk kenyamanan membaca
  const getTextSizeClass = () => {
    switch (fontSize) {
      case "xlarge":
        return "text-xl md:text-2xl leading-[2.1] md:leading-[2.2]";
      case "large":
        return "text-lg md:text-xl leading-[2.0] md:leading-[2.1]";
      case "normal":
      default:
        return "text-base md:text-lg leading-[1.9] md:leading-[2.0]";
    }
  };

  // Handler berbagi renungan langsung ke WhatsApp
  const handleWhatsAppShare = () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    const natsText = post.excerpt ? `\n\n_"${post.excerpt}"_\n` : "\n";
    const text = `🕊️ *Renungan Harian GKPI*\n📅 *${fullDate}*\n📖 *${post.title}*${natsText}\nPelayan Firman: ${post.author}\n\nBaca selengkapnya & dengarkan audio renungan di:\n${url}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");

    setCopiedWa(true);
    setTimeout(() => setCopiedWa(false), 3000);
  };

  // Pecah konten menjadi paragraf-paragraf yang rapi
  const paragraphs = post.content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      {/* 1. Mobile Smart Sticky Bar (Hanya muncul di layar HP saat di-scroll) */}
      <AnimatePresence>
        {showMobileStickyBar && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 lg:hidden border-b border-border/80 bg-surface/95 backdrop-blur-md px-4 py-2.5 shadow-lg"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-text-primary truncate">
                  {post.title}
                </p>
                <p className="text-[10px] text-text-secondary truncate mt-0.5">
                  <span className="text-primary font-semibold">{post.author}</span>
                  {post.excerpt && <span> · &ldquo;{post.excerpt}&rdquo;</span>}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {/* Kontrol Cepat Font */}
                <button
                  type="button"
                  onClick={() => setFontSize(fontSize === "normal" ? "large" : fontSize === "large" ? "xlarge" : "normal")}
                  className="rounded-lg border border-border bg-background/80 px-2 py-1 text-[11px] font-bold text-text-primary"
                  title="Ubah Ukuran Teks"
                >
                  {fontSize === "normal" ? "A" : fontSize === "large" ? "A+" : "A++"}
                </button>

                {/* Tombol Share WA Ringkas */}
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="inline-flex items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/30 p-1.5 text-emerald-400"
                  title="Bagikan ke WhatsApp"
                >
                  <Share2 size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Breadcrumbs & Tombol Kembali */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <Link href="/" className="text-text-secondary hover:text-primary transition-colors">
            Beranda
          </Link>
          <ChevronRight size={13} className="text-text-secondary/40" />
          <Link href="/publikasi" className="text-text-secondary hover:text-primary transition-colors">
            Publikasi
          </Link>
          <ChevronRight size={13} className="text-text-secondary/40" />
          <Link
            href="/publikasi?kategori=Renungan+Harian"
            className="text-text-secondary hover:text-primary transition-colors font-medium"
          >
            Renungan Harian
          </Link>
          <ChevronRight size={13} className="text-text-secondary/40" />
          <span className="max-w-[160px] sm:max-w-xs truncate text-primary font-semibold">
            {post.title}
          </span>
        </nav>

        <Link
          href="/publikasi?kategori=Renungan+Harian"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Kembali</span>
        </Link>
      </div>

      {/* 3. LAYOUT UTAMA: 2 Kolom di Desktop (Sticky Sidebar Kiri + Isi Scroll Kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* KOLOM KIRI (FIXED / STICKY DI DESKTOP): JUDUL/TEMA, AYAT NATS, PENULIS, AUDIO */}
        <aside className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-5">
          
          {/* Card 1: Identitas Renungan (Tema, Penulis, Tanggal) */}
          <div className="relative rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/[0.08] via-surface to-background p-6 sm:p-7 shadow-xl overflow-hidden">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              {/* Badge & Tanggal */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/15 px-3 py-0.5 text-[11px] font-bold text-primary tracking-wide uppercase">
                  <BookOpen size={12} />
                  Renungan Harian
                </span>
                <span className="text-xs text-text-secondary flex items-center gap-1.5 font-medium">
                  <Calendar size={13} className="text-primary" />
                  {fullDate}
                </span>
              </div>

              {/* Judul / Tema Pokok Renungan */}
              <h1
                className="text-2xl sm:text-3xl font-bold leading-snug text-text-primary tracking-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {post.title}
              </h1>

              {/* Pelayan Firman / Penulis */}
              <div className="border-t border-border/50 pt-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <User size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold text-text-secondary/70">Pelayan Firman</p>
                    <p className="font-bold text-sm text-text-primary truncate">{post.author}</p>
                  </div>
                </div>

                <div className="text-right text-xs text-text-secondary shrink-0">
                  <span className="flex items-center justify-end gap-1">
                    <Clock size={12} className="text-primary" />
                    {post.read_time || "4 mnt"}
                  </span>
                  <span className="flex items-center justify-end gap-1 text-[11px] mt-0.5">
                    <Eye size={12} className="text-primary" />
                    {formattedViews}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Nats Firman Tuhan (Kutipan Ayat Pokok) */}
          {post.excerpt && (
            <div className="rounded-2xl border border-primary/30 bg-primary/[0.04] p-5 shadow-sm space-y-2.5">
              <div className="flex items-center gap-2 text-primary">
                <Quote size={16} />
                <span className="text-[11px] font-extrabold uppercase tracking-wider">
                  Nats / Ayat Hari Ini
                </span>
              </div>
              <blockquote
                className="text-sm sm:text-base font-serif italic leading-relaxed text-text-primary/95 pl-2 border-l-2 border-primary/40"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                &ldquo;{post.excerpt}&rdquo;
              </blockquote>
            </div>
          )}

          {/* Card 3: Pemutar Audio Renungan (Tetap Fixed & Mudah Dikontrol) */}
          {audioUrl && (
            <div className="rounded-2xl border border-border bg-surface p-4 shadow-md space-y-2">
              <div className="flex items-center justify-between gap-2 text-xs font-bold text-text-primary">
                <span className="flex items-center gap-1.5 text-primary">
                  <Headphones size={15} />
                  Audio Renungan
                </span>
                <span className="text-[10px] font-semibold text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded-full border border-sky-400/20">
                  Putar Kapan Saja
                </span>
              </div>
              <AudioPlayer
                src={audioUrl}
                title="Dengarkan Audio"
                subtitle={`Oleh ${post.author}`}
              />
            </div>
          )}
        </aside>

        {/* KOLOM KANAN (SCROLLABLE): TOOLBAR UKURAN FONT, TEKS RENUNGAN, DOA, GALERI */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          
          {/* Toolbar Pengatur Font & Tombol Berbagi */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/80 bg-surface/90 backdrop-blur-md px-4 py-3 shadow-md">
            {/* Pengatur Ukuran Font */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-text-secondary">Ukuran Teks:</span>
              <button
                type="button"
                onClick={() => setFontSize("normal")}
                title="Ukuran teks standar"
                className={`h-8 w-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  fontSize === "normal"
                    ? "bg-primary text-white shadow-sm"
                    : "border border-border text-text-secondary hover:text-text-primary hover:bg-background"
                }`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize("large")}
                title="Ukuran teks sedang"
                className={`h-8 w-8 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                  fontSize === "large"
                    ? "bg-primary text-white shadow-sm"
                    : "border border-border text-text-secondary hover:text-text-primary hover:bg-background"
                }`}
              >
                A+
              </button>
              <button
                type="button"
                onClick={() => setFontSize("xlarge")}
                title="Ukuran teks besar (ramah lansia)"
                className={`h-8 px-2 rounded-lg text-base font-extrabold transition-all cursor-pointer ${
                  fontSize === "xlarge"
                    ? "bg-primary text-white shadow-sm"
                    : "border border-border text-text-secondary hover:text-text-primary hover:bg-background"
                }`}
              >
                A++
              </button>
            </div>

            {/* Aksi Cepat: WhatsApp & Bookmark */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-400 transition-all cursor-pointer"
                title="Bagikan Renungan ke WhatsApp"
              >
                {copiedWa ? <Check size={13} /> : <Share2 size={13} />}
                <span>{copiedWa ? "Tautan Siap" : "Kirim WA"}</span>
              </button>

              <BookmarkButton id={post.id} />
              <ShareMenu title={post.title} />
            </div>
          </div>

          {/* Galeri Foto jika diunggah */}
          {gallery.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-border">
              <GalleryLightbox images={gallery} title={post.title} />
            </div>
          )}

          {/* Isi Bacaan Renungan Harian */}
          <article className={`space-y-6 text-text-primary transition-all duration-200 ${getTextSizeClass()}`}>
            {paragraphs.length > 0 ? (
              paragraphs.map((para, idx) => (
                <p
                  key={idx}
                  className={
                    idx === 0
                      ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-5xl first-letter:font-bold first-letter:text-primary font-serif sm:font-sans"
                      : ""
                  }
                >
                  {para}
                </p>
              ))
            ) : (
              <p className="first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-5xl first-letter:font-bold first-letter:text-primary">
                {post.content}
              </p>
            )}
          </article>

          {/* Kartu Doa & Refleksi Hari Ini */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/[0.07] via-surface to-background p-6 sm:p-8 text-center space-y-3 shadow-md mt-10"
          >
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary">
              <Heart size={18} />
            </div>
            <h3
              className="text-lg sm:text-xl font-bold text-text-primary"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Doa & Refleksi Hari Ini
            </h3>
            <p className="mx-auto max-w-xl text-sm sm:text-base italic text-text-secondary leading-relaxed">
              &ldquo;Ya Tuhan Yesus Kristus, mampukanlah kami menghidupi kebenaran firman-Mu hari ini. Jadikanlah hidup kami saluran damai dan kasih bagi sesama. Amin.&rdquo;
            </p>
            <p className="text-xs font-semibold text-primary/80 pt-1">
              🕊️ Tuhan memberkati hari dan aktivitas Anda
            </p>
          </motion.div>

        </div>
      </div>

      {/* 4. Rekomendasi Renungan Lainnya (Maksimal 30 Hari Terakhir) */}
      {relatedDevotions.length > 0 && (
        <section className="mt-16 border-t border-border/50 pt-10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2
                className="text-xl sm:text-2xl font-bold text-text-primary"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Renungan Lainnya
              </h2>
              <p className="text-xs text-text-secondary mt-1">
                Kumpulan firman Tuhan dalam 30 hari terakhir
              </p>
            </div>
            <Link
              href="/publikasi?kategori=Renungan+Harian"
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              <span>Lihat Semua</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {relatedDevotions.map((devotion) => (
              <Link
                key={devotion.id}
                href={`/publikasi/${devotion.id}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-[11px] text-text-secondary mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-primary" />
                      {new Date(devotion.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    {devotion.audio_url && (
                      <span className="flex items-center gap-1 font-bold text-sky-400">
                        <Volume2 size={12} />
                        Audio
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-text-primary group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {devotion.title}
                  </h4>
                  {devotion.excerpt && (
                    <p className="text-xs text-text-secondary line-clamp-2 mt-2 italic">
                      &ldquo;{devotion.excerpt}&rdquo;
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3 text-[11px] text-text-secondary">
                  <span className="truncate max-w-[120px]">{devotion.author}</span>
                  <span className="flex items-center gap-1 font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
                    Baca <ChevronRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
