"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { getAllPublications, formatDateID } from "@/lib/publications";
import type { Publication, PublicationDepartment } from "@/lib/types";
import { SkeletonList } from "@/components/SkeletonLoader";
import { getBookmarkedIds } from "@/components/publikasi/BookmarkButton";
import {
  Search,
  Calendar,
  User,
  Clock,
  ArrowRight,
  ChevronRight,
  FileText,
  Megaphone,
  BookOpen,
  Sparkles,
  Bookmark,
  CalendarDays,
  HeartHandshake,
  Compass,
  Users,
} from "lucide-react";

const categories: ("Semua" | "Tersimpan" | "Berita" | "Pengumuman" | "Kegiatan" | "Dokumen" | "Renungan Harian")[] = [
  "Semua",
  "Tersimpan",
  "Renungan Harian",
  "Berita",
  "Pengumuman",
  "Kegiatan",
  "Dokumen",
];

const departmentsFilter: ("Semua" | PublicationDepartment)[] = [
  "Semua",
  "Sinode",
  "Diakonat",
  "Apostolat",
  "Pastorat",
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
  const [publicationsData, setPublicationsData] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [activeDepartment, setActiveDepartment] = useState<string>("Semua");
  const [visibleCount, setVisibleCount] = useState(6);

  // Ambil data publikasi saat halaman dimuat.
  // Data diperbarui saat admin mengubah konten pada kunjungan berikutnya.
  useEffect(() => {
    let isMounted = true;
    getAllPublications().then((data) => {
      if (isMounted) {
        setPublicationsData(data);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Daftar publikasi hasil filter
  const bookmarkedIds = typeof window !== "undefined" ? getBookmarkedIds() : [];

  const filteredPublications = publicationsData.filter((post) => {
    const matchesCategory =
      activeCategory === "Semua"
        ? true
        : activeCategory === "Tersimpan"
        ? bookmarkedIds.includes(post.id)
        : post.category === activeCategory;

    const matchesDepartment =
      activeDepartment === "Semua" || (post.department ?? "Sinode") === activeDepartment;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDepartment && matchesSearch;
  });

  // Postingan renungan unggulan dari kategori aktif atau data pertama
  const featuredPost =
    activeCategory === "Semua" && activeDepartment === "Semua" && searchQuery === "" && publicationsData.length > 0
      ? publicationsData.find((p) => p.is_featured) || publicationsData[0]
      : null;

  // Grid postingan, tanpa item unggulan yang sudah tampil
  const gridPublications = featuredPost
    ? filteredPublications.filter((p) => p.id !== featuredPost.id)
    : filteredPublications;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-text-primary">
      <Navbar />

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[50vh] items-end overflow-hidden bg-background pb-12 pt-32 md:min-h-[55vh] md:pb-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.webp"
            alt="Publikasi Latar Belakang"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            quality={90}
          />
          <div className="absolute inset-0 bg-primary-dark/20 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-primary-dark/10 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/90" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-text-primary/75 transition-colors hover:text-primary"
            >
              Beranda
            </Link>
            <ChevronRight size={14} className="text-text-primary/30" />
            <span className="text-sm font-medium text-primary">Publikasi</span>
          </nav>

          <ScrollReveal>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-primary">
              Portal Informasi
            </p>
            <h1
              className="mb-5 max-w-3xl text-4xl font-bold leading-tight text-text-primary sm:text-5xl lg:text-6xl"
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
        {/* Quick Links Sub-Laman Departemen */}
        <ScrollReveal>
          <div className="mb-10">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Sub-Laman Publikasi Departemen
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Link
                href="/publikasi/departemen/diakonat"
                className="group flex items-center justify-between rounded-2xl border border-border/80 bg-surface/40 p-4 transition-all hover:border-emerald-400/40 hover:bg-surface/80 hover:shadow-md cursor-pointer backdrop-blur"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                    <HeartHandshake size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text-primary group-hover:text-emerald-400 transition-colors">
                      Diakonat
                    </h4>
                    <p className="text-[11px] text-text-secondary">Pelayanan Kasih & Sosial</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-text-secondary transition-transform group-hover:translate-x-1 group-hover:text-emerald-400" />
              </Link>

              <Link
                href="/publikasi/departemen/apostolat"
                className="group flex items-center justify-between rounded-2xl border border-border/80 bg-surface/40 p-4 transition-all hover:border-sky-400/40 hover:bg-surface/80 hover:shadow-md cursor-pointer backdrop-blur"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/10 text-sky-400">
                    <Compass size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text-primary group-hover:text-sky-400 transition-colors">
                      Apostolat
                    </h4>
                    <p className="text-[11px] text-text-secondary">Pekabaran Injil & Misi</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-text-secondary transition-transform group-hover:translate-x-1 group-hover:text-sky-400" />
              </Link>

              <Link
                href="/publikasi/departemen/pastorat"
                className="group flex items-center justify-between rounded-2xl border border-border/80 bg-surface/40 p-4 transition-all hover:border-purple-400/40 hover:bg-surface/80 hover:shadow-md cursor-pointer backdrop-blur"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-400/10 text-purple-400">
                    <Users size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text-primary group-hover:text-purple-400 transition-colors">
                      Pastorat
                    </h4>
                    <p className="text-[11px] text-text-secondary">Penggembalaan & Pembinaan</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-text-secondary transition-transform group-hover:translate-x-1 group-hover:text-purple-400" />
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* Search & Filter Panel */}
        <ScrollReveal>
          <div className="mb-12 flex flex-col gap-6 rounded-2xl border border-border/60 bg-surface p-6 backdrop-blur-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
                  placeholder="Cari publikasi..."
                  className="w-full rounded-2xl border border-border bg-background/50 py-3 pl-11 pr-4 text-sm text-white placeholder-text-secondary outline-none transition-all focus:border-primary/40 focus:bg-background/80"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Filter Group: Kategori & Departemen */}
            <div className="space-y-4 border-t border-border/40 pt-4">
              {/* Filter Departemen */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-text-secondary mr-2 min-w-[70px]">
                  Departemen:
                </span>
                {departmentsFilter.map((dept) => {
                  const isActive = activeDepartment === dept;
                  return (
                    <button
                      key={dept}
                      onClick={() => {
                        setActiveDepartment(dept);
                        setVisibleCount(6);
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                        isActive
                          ? "bg-primary text-background shadow-sm shadow-primary/25"
                          : "border border-border bg-surface text-text-secondary hover:border-primary/20 hover:text-primary"
                      }`}
                    >
                      <span>{dept === "Semua" ? "Semua Departemen" : dept}</span>
                    </button>
                  );
                })}
              </div>

              {/* Filter Kategori */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-text-secondary mr-2 min-w-[70px]">
                  Kategori:
                </span>
                {categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        setVisibleCount(6);
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                        isActive
                          ? "bg-primary text-background shadow-sm shadow-primary/25"
                          : "border border-border bg-surface text-text-secondary hover:border-primary/20 hover:text-primary"
                      }`}
                    >
                      {getCategoryIcon(cat)}
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Featured Daily Devotion ── */}
        {featuredPost && (
          <ScrollReveal>
            <div className="mb-14">
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <Bookmark size={14} className="animate-pulse" /> Renungan Harian
              </p>
              <Link
                href={`/publikasi/${featuredPost.id}`}
                className="group relative grid grid-cols-1 overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-500 hover:border-primary/30 hover:shadow-sm hover:shadow-primary/5 md:grid-cols-12 cursor-pointer"
                style={{ backdropFilter: "blur(12px)" }}
              >
                {/* Image side */}
                <div className="relative min-h-[300px] md:col-span-7 md:min-h-[420px] overflow-hidden">
                  <Image
                    src={featuredPost.image || "/hero-bg.webp"}
                    alt={featuredPost.title}
                    fill
                    sizes="(min-width: 768px) 60vw, 100vw"
                    className="object-cover transition-transform duration-[6000ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-background/30 md:to-background/95" />
                  <div className="absolute left-6 top-6 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-bold text-text-primary backdrop-blur">
                    {featuredPost.category}
                  </div>
                </div>

                {/* Content side */}
                <div className="flex flex-col justify-between p-8 md:col-span-5 md:p-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 text-xs text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} className="text-primary" />
                        {formatDateID(featuredPost.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} className="text-primary" />
                        {featuredPost.read_time}
                      </span>
                    </div>
                    <h2
                      className="font-serif text-2xl font-bold text-text-primary transition-colors group-hover:text-primary md:text-3xl lg:text-4xl"
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
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary">
                        <User size={14} />
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {featuredPost.author}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1 text-sm font-bold text-primary group-hover:underline">
                      <span>Baca Lengkap</span>
                      <ArrowRight
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </ScrollReveal>
        )}

        {/* ── Grid List ── */}
        <div className={`grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 ${isLoading ? "hidden" : ""}`}>
          {gridPublications.slice(0, visibleCount).map((post) => (
            <ScrollReveal key={post.id}>
              <Link
                href={`/publikasi/${post.id}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm shadow-black/5 hover:-translate-y-1 hover:border-primary/30 hover:bg-surface hover:shadow-sm hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
                style={{ backdropFilter: "blur(12px)" }}
              >
                {/* Card Thumbnail */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
                  <Image
                    src={post.image || "/hero-bg.webp"}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1024px) 30vw, 50vw"
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                  <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-primary backdrop-blur">
                    {getCategoryIcon(post.category)}
                    {post.category}
                  </span>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-6">
                  {/* Meta */}
                  <div className="mb-3.5 flex items-center gap-4 text-xs text-text-secondary">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} className="text-primary" />
                      {formatDateID(post.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} className="text-primary" />
                      {post.read_time}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3
                    className="font-serif text-lg font-bold text-text-primary mb-2 leading-snug group-hover:text-primary transition-colors"
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
                      <div className="flex h-7.5 w-7.5 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <User size={13} />
                      </div>
                      <span className="text-xs font-semibold text-text-primary">
                        {post.author}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:underline">
                      <span>Buka</span>
                      <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* Loading State with Skeleton */}
        {isLoading && <SkeletonList count={6} />}

        {/* Empty State */}
        {!isLoading && filteredPublications.length === 0 && (
          <ScrollReveal>
            <div className="my-20 flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-border/40 bg-surface/20">
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
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border bg-surface px-8 text-sm font-bold text-text-primary transition-all duration-300 hover:border-primary/40 hover:bg-surface hover:-translate-y-0.5 cursor-pointer"
              >
                Muat Lebih Banyak
              </button>
            </div>
          </ScrollReveal>
        )}
      </section>

      <Footer />
    </main>
  );
}
