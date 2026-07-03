"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import {
  Search,
  Calendar,
  User,
  Clock,
  ArrowRight,
  ChevronRight,
  X,
  Download,
  Share2,
  FileText,
  Megaphone,
  Eye,
  BookOpen,
  Sparkles,
  Bookmark,
  CalendarDays,
} from "lucide-react";

// ─── Data Publikasi (Placeholder) ─────────────────────────────────────────────

interface PublikasiItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: "Berita" | "Pengumuman" | "Kegiatan" | "Dokumen" | "Renungan Harian";
  date: string;
  author: string;
  image: string;
  readTime: string;
  views: string;
  isFeatured?: boolean;
}

const publicationsData: PublikasiItem[] = [
  {
    id: 1,
    title: "Renungan Harian: Bertumbuh dalam Pengharapan",
    excerpt: "Bacaan rohani singkat untuk menolong jemaat memulai hari dengan firman, doa, dan pengharapan.",
    content: "Renungan harian ini disiapkan sebagai ruang teduh bagi jemaat untuk membaca firman Tuhan, merenungkan panggilan iman, dan membawa semangat pelayanan ke dalam kehidupan sehari-hari.",
    category: "Renungan Harian",
    date: "03 Juli 2026",
    author: "Tim Renungan GKPI",
    image: "/hero_slide_1.png",
    readTime: "4 menit",
    views: "1.248",
    isFeatured: true,
  },
  {
    id: 2,
    title: "Jadwal Ibadah Minggu dan Pelayanan Resort",
    excerpt: "Informasi jadwal ibadah, pelayanan kategorial, dan kegiatan resort yang dapat diikuti jemaat minggu ini.",
    content: "Pengumuman ini memuat jadwal ibadah minggu, pelayanan kategorial, serta agenda resort yang dapat menjadi panduan jemaat dalam mengikuti persekutuan dan pelayanan gereja.",
    category: "Pengumuman",
    date: "01 Juli 2026",
    author: "Sekretariat Sinode",
    image: "/hero_slide_2.png",
    readTime: "3 menit",
    views: "986",
  },
  {
    id: 3,
    title: "Kegiatan Pembinaan Pelayan Jemaat",
    excerpt: "Rangkuman kegiatan pembinaan pelayan jemaat untuk memperkuat pelayanan pastoral dan administrasi gereja.",
    content: "Kegiatan pembinaan pelayan jemaat dilaksanakan untuk memperkuat kapasitas pelayanan, memperjelas tata kelola, dan membangun koordinasi antar pelayan di tingkat jemaat, resort, dan sinode.",
    category: "Kegiatan",
    date: "28 Juni 2026",
    author: "Bidang Pelayanan",
    image: "/hero_slide_3.png",
    readTime: "5 menit",
    views: "742",
  },
  {
    id: 4,
    title: "Dokumen Tata Gereja dan Panduan Pelayanan",
    excerpt: "Kumpulan dokumen dasar yang membantu jemaat memahami tata gereja, pelayanan, dan administrasi GKPI.",
    content: "Dokumen ini berisi rujukan dasar mengenai tata gereja, pedoman pelayanan, dan ketentuan administratif yang digunakan dalam kehidupan bergereja di lingkungan GKPI.",
    category: "Dokumen",
    date: "24 Juni 2026",
    author: "Biro Administrasi",
    image: "/hero_slide_4.png",
    readTime: "7 menit",
    views: "1.104",
  },
  {
    id: 5,
    title: "Berita Pelayanan Diakonia Wilayah",
    excerpt: "Kabar pelayanan diakonia di beberapa wilayah sebagai wujud kepedulian gereja bagi jemaat dan masyarakat.",
    content: "Pelayanan diakonia wilayah menjadi ruang bagi gereja untuk hadir secara nyata melalui kunjungan, dukungan sosial, dan kerja bersama dengan jemaat setempat.",
    category: "Berita",
    date: "20 Juni 2026",
    author: "Tim Publikasi",
    image: "/resort-hero-bg.png",
    readTime: "4 menit",
    views: "653",
  },
  {
    id: 6,
    title: "Pengumuman Rapat Koordinasi Pelayanan",
    excerpt: "Undangan rapat koordinasi pelayanan bagi pengurus resort, komisi, dan bidang pelayanan terkait.",
    content: "Rapat koordinasi pelayanan akan membahas evaluasi program berjalan, agenda pelayanan mendatang, serta pembagian tugas untuk memperkuat kesinambungan pelayanan.",
    category: "Pengumuman",
    date: "18 Juni 2026",
    author: "Sekretariat Sinode",
    image: "/hero_slide_1.png",
    readTime: "2 menit",
    views: "521",
  },
  {
    id: 7,
    title: "Pelatihan Musik Gerejawi dan Liturgi",
    excerpt: "Kegiatan pelatihan musik gerejawi untuk mendukung pelayanan ibadah yang tertib, hangat, dan partisipatif.",
    content: "Pelatihan musik gerejawi dan liturgi berfokus pada penguatan pemahaman ibadah, pengaturan musik, dan kerja sama antar pelayan ibadah.",
    category: "Kegiatan",
    date: "15 Juni 2026",
    author: "Komisi Liturgi",
    image: "/hero_slide_2.png",
    readTime: "4 menit",
    views: "612",
  },
  {
    id: 8,
    title: "Panduan Administrasi Jemaat",
    excerpt: "Panduan ringkas untuk membantu pengurus jemaat mengelola surat, data pelayanan, dan arsip gereja.",
    content: "Panduan administrasi jemaat disusun untuk membantu pengurus menjaga kerapian data, mempercepat layanan administratif, dan memastikan arsip pelayanan terdokumentasi dengan baik.",
    category: "Dokumen",
    date: "12 Juni 2026",
    author: "Biro Administrasi",
    image: "/hero_slide_3.png",
    readTime: "6 menit",
    views: "899",
  },
  {
    id: 9,
    title: "Kabar Kemitraan Pelayanan GKPI",
    excerpt: "Catatan perkembangan kerja sama pelayanan bersama mitra gereja dan lembaga Kristen di dalam dan luar negeri.",
    content: "Kemitraan pelayanan GKPI terus diarahkan untuk memperluas dukungan pendidikan, penginjilan, sosial, dan penguatan kapasitas pelayan gereja.",
    category: "Berita",
    date: "08 Juni 2026",
    author: "Tim Kemitraan",
    image: "/hero_slide_4.png",
    readTime: "5 menit",
    views: "734",
  },
];

const categories: ("Semua" | "Berita" | "Pengumuman" | "Kegiatan" | "Dokumen" | "Renungan Harian")[] = [
  "Semua",
  "Renungan Harian",
  "Berita",
  "Pengumuman",
  "Kegiatan",
  "Dokumen",
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Berita":
      return <BookOpen size={14} />;
    case "Pengumuman":
      return <Megaphone size={14} />;
    case "Kegiatan":
      return <CalendarDays size={14} />;
    case "Dokumen":
      return <FileText size={14} />;
    case "Renungan Harian":
      return <Bookmark size={14} />;
    default:
      return <Sparkles size={14} />;
  }
};

export default function PublikasiPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [selectedPost, setSelectedPost] = useState<PublikasiItem | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isCopied, setIsCopied] = useState(false);

  // Filtered publications
  const filteredPublications = publicationsData.filter((post) => {
    const matchesCategory =
      activeCategory === "Semua" || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Featured daily devotion post (first featured post in the selected category, or first post)
  const featuredPost =
    activeCategory === "Semua" && searchQuery === ""
      ? publicationsData.find((p) => p.isFeatured) || publicationsData[0]
      : null;

  // Grid posts (excluding the featured daily devotion post if it is shown)
  const gridPublications = featuredPost
    ? filteredPublications.filter((p) => p.id !== featuredPost.id)
    : filteredPublications;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-text-primary">
      <Navbar />

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[50vh] items-end overflow-hidden bg-background pb-12 pt-32 md:min-h-[55vh] md:pb-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.png"
            alt="Publikasi Latar Belakang"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            quality={90}
          />
          <div className="absolute inset-0 bg-primary/75 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-primary/35 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-background/80" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-text-primary/75 transition-colors hover:text-accent"
            >
              Beranda
            </Link>
            <ChevronRight size={14} className="text-text-primary/30" />
            <span className="text-sm font-medium text-accent">Publikasi</span>
          </nav>

          <ScrollReveal>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-accent">
              Portal Informasi
            </p>
            <h1
              className="mb-5 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Publikasi
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-text-secondary md:text-lg">
              Kumpulan renungan, berita, pengumuman, kegiatan, dan dokumen
              pelayanan GKPI dalam satu ruang arsip yang mudah ditelusuri.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Main Layout (Content Area) ───────────────────────────────────── */}
      <section className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16">
        {/* Search & Filter Panel */}
        <ScrollReveal>
          <div className="mb-12 flex flex-col gap-6 rounded-3xl border border-border/60 bg-surface/40 p-6 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari..."
                className="w-full rounded-2xl border border-border bg-background/50 py-3 pl-11 pr-4 text-sm text-white placeholder-text-secondary outline-none transition-all focus:border-accent/40 focus:bg-background/80"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Categories scrollable tabs */}
            <div className="flex flex-wrap gap-2.5">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setVisibleCount(6);
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all cursor-pointer
                      ${
                        isActive
                          ? "bg-accent text-background shadow-lg shadow-accent/25"
                          : "border border-border bg-surface/60 text-text-secondary hover:border-accent/20 hover:text-white"
                      }`}
                  >
                    {getCategoryIcon(cat)}
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* ── Featured Daily Devotion ── */}
        {featuredPost && (
          <ScrollReveal>
            <div className="mb-14">
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                <Bookmark size={14} className="animate-pulse" /> Renungan Harian
              </p>
              <div
                onClick={() => setSelectedPost(featuredPost)}
                className="group relative grid grid-cols-1 overflow-hidden rounded-[2rem] border border-border bg-surface/30 transition-all duration-500 hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/5 md:grid-cols-12 cursor-pointer"
                style={{ backdropFilter: "blur(12px)" }}
              >
                {/* Image side */}
                <div className="relative min-h-[300px] md:col-span-7 md:min-h-[420px] overflow-hidden">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    sizes="(min-width: 768px) 60vw, 100vw"
                    className="object-cover transition-transform duration-[6000ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-background/30 md:to-background/95" />
                  <div className="absolute left-6 top-6 rounded-xl border border-white/10 bg-background/55 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                    {featuredPost.category}
                  </div>
                </div>

                {/* Content side */}
                <div className="flex flex-col justify-between p-8 md:col-span-5 md:p-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-xs text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} className="text-accent" />
                        {featuredPost.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} className="text-accent" />
                        {featuredPost.readTime}
                      </span>
                    </div>
                    <h2
                      className="font-serif text-2xl font-bold text-white transition-colors group-hover:text-accent md:text-3xl lg:text-4xl"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {featuredPost.title}
                    </h2>
                    <p className="text-base leading-relaxed text-text-secondary">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-6">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/15 text-accent">
                        <User size={14} />
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {featuredPost.author}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1 text-sm font-bold text-accent group-hover:underline">
                      <span>Baca Lengkap</span>
                      <ArrowRight
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* ── Grid List ── */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {gridPublications.slice(0, visibleCount).map((post) => (
            <ScrollReveal key={post.id}>
              <article
                onClick={() => setSelectedPost(post)}
                className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-border bg-surface/40 shadow-lg shadow-black/5 hover:-translate-y-1.5 hover:border-accent/30 hover:bg-surface/60 hover:shadow-2xl hover:shadow-accent/5 transition-all duration-300 cursor-pointer"
                style={{ backdropFilter: "blur(12px)" }}
              >
                {/* Card Thumbnail */}
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1024px) 30vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                  <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-background/55 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                    {getCategoryIcon(post.category)}
                    {post.category}
                  </span>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-6">
                  {/* Meta */}
                  <div className="mb-3.5 flex items-center gap-4 text-xs text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} className="text-accent" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} className="text-accent" />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3
                    className="font-serif text-lg font-bold text-white mb-2 leading-snug group-hover:text-accent transition-colors"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {post.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Author / Footer */}
                  <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-accent/10 text-accent">
                        <User size={13} />
                      </div>
                      <span className="text-xs font-semibold text-text-primary">
                        {post.author}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-accent flex items-center gap-1 group-hover:underline">
                      <span>Buka</span>
                      <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>

        {/* Empty State */}
        {filteredPublications.length === 0 && (
          <ScrollReveal>
            <div className="my-20 flex flex-col items-center justify-center text-center p-8 rounded-3xl border border-border/40 bg-surface/20">
              <FileText size={48} className="text-text-secondary mb-4 opacity-50" />
              <h3 className="text-lg font-bold text-white">Tidak ada publikasi ditemukan</h3>
              <p className="text-sm text-text-secondary mt-1">Coba gunakan kata kunci pencarian atau kategori lain.</p>
            </div>
          </ScrollReveal>
        )}

        {/* Load More Button */}
        {filteredPublications.length > visibleCount && (
          <ScrollReveal>
            <div className="mt-16 text-center">
              <button
                onClick={handleLoadMore}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-surface/50 px-8 text-sm font-bold text-text-primary transition-all duration-300 hover:border-accent/40 hover:bg-surface hover:-translate-y-0.5 cursor-pointer"
              >
                Muat Lebih Banyak
              </button>
            </div>
          </ScrollReveal>
        )}
      </section>

      {/* ── Detail Modal ─────────────────────────────────────────────────── */}
      {selectedPost && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 md:p-6 animate-fade-in">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/85 backdrop-blur-lg cursor-pointer"
            onClick={() => setSelectedPost(null)}
          />

          {/* Modal Box */}
          <div
            className="relative flex h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-accent/20 shadow-2xl animate-slide-up md:h-[80vh]"
            style={{
              background: "linear-gradient(160deg, rgba(22,42,64,0.98) 0%, rgba(8,17,30,0.98) 100%)",
              boxShadow: "0 28px 90px rgba(0,0,0,0.45), 0 0 50px rgba(111,168,220,0.12)",
            }}
          >
            {/* Header / Top controls */}
            <div className="flex items-center justify-between p-6 border-b border-border/40 shrink-0">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent border border-accent/25">
                {getCategoryIcon(selectedPost.category)}
                {selectedPost.category}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-text-secondary hover:text-white transition-colors bg-surface/30 cursor-pointer"
                  title="Salin Tautan"
                >
                  <Share2 size={16} />
                </button>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-text-secondary hover:text-white transition-colors bg-surface/30 cursor-pointer"
                  aria-label="Tutup"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Scroll Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 no-scrollbar space-y-6">
              {/* Copy success alert */}
              {isCopied && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold text-center animate-fade-in">
                  Tautan disalin ke papan klip!
                </div>
              )}

              {/* Title & Meta */}
              <div className="space-y-4">
                <h2
                  className="text-2xl md:text-3xl font-bold text-white leading-tight"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {selectedPost.title}
                </h2>
                <div className="flex flex-wrap gap-4 text-xs text-text-secondary border-b border-border/30 pb-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} className="text-accent" />
                    {selectedPost.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User size={13} className="text-accent" />
                    {selectedPost.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} className="text-accent" />
                    {selectedPost.readTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={13} className="text-accent" />
                    {selectedPost.views}
                  </span>
                </div>
              </div>

              {/* Large Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border/40">
                <Image
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  fill
                  sizes="600px"
                  className="object-cover"
                />
              </div>

              {/* Content Body */}
              <div className="text-text-secondary leading-relaxed space-y-4 text-base md:text-lg">
                <p>{selectedPost.content}</p>
                <p>
                  Informasi ini akan diperbarui mengikuti materi resmi dari
                  pengurus dan bidang pelayanan terkait.
                </p>
              </div>

              {/* Document Download Link */}
              {selectedPost.category === "Dokumen" && (
                <div className="pt-4">
                  <div
                    className="p-5 rounded-2xl border border-accent/20 flex flex-col sm:flex-row items-center justify-between gap-4"
                    style={{ background: "linear-gradient(135deg, rgba(111,168,220,0.08) 0%, rgba(22,42,64,0.4) 100%)" }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-accent/15 rounded-xl flex items-center justify-center text-accent">
                        <FileText size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-white">Unduh Lampiran Dokumen</p>
                        <p className="text-xs text-text-secondary">Format: PDF</p>
                      </div>
                    </div>
                    <Link
                      href="#"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-accent text-background text-xs font-bold rounded-xl hover:bg-accent/90 shadow transition-all cursor-pointer"
                    >
                      <Download size={14} />
                      Unduh PDF
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
