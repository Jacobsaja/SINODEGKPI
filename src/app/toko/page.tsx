"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { getAllProducts, formatRupiah } from "@/lib/products";
import type { Product } from "@/lib/types";
import {
  Search,
  ChevronRight,
  X,
  Share2,
  ShoppingBag,
  Tag,
  Package,
  Gift,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

const categoryIcons = [ShoppingBag, Package, Gift, Tag, Sparkles];

export default function TokoPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isCopied, setIsCopied] = useState(false);

  // Ambil data produk dari Supabase saat halaman dibuka.
  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .finally(() => setIsLoading(false));
  }, []);

  const categories = useMemo(
    () => ["Semua", ...Array.from(new Set(products.map((p) => p.category)))],
    [products]
  );

  const getCategoryIcon = (category: string) => {
    if (category === "Semua") return <Sparkles size={14} />;
    const index = categories.indexOf(category) % categoryIcons.length;
    const Icon = categoryIcons[index] ?? Tag;
    return <Icon size={14} />;
  };

  // Filtered products
  const filteredProducts = products.filter((item) => {
    const matchesCategory =
      activeCategory === "Semua" || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Featured product (only shown when no filter/search active)
  const featuredProduct =
    activeCategory === "Semua" && searchQuery === ""
      ? products.find((p) => p.is_featured) || products[0] || null
      : null;

  const gridProducts = featuredProduct
    ? filteredProducts.filter((p) => p.id !== featuredProduct.id)
    : filteredProducts;

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
            alt="Toko Latar Belakang"
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
              className="flex items-center gap-1.5 text-sm text-text-primary/75 transition-colors hover:text-accent"
            >
              Beranda
            </Link>
            <ChevronRight size={14} className="text-text-primary/30" />
            <span className="text-sm font-medium text-accent">Toko</span>
          </nav>

          <ScrollReveal>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-accent">
              Toko Resmi
            </p>
            <h1
              className="mb-5 max-w-3xl text-4xl font-bold leading-tight text-text-primary sm:text-5xl lg:text-6xl"
            >
              Toko
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-text-secondary md:text-lg">
              Alkitab, buku rohani, dan merchandise resmi. Pesan langsung
              lewat Tokopedia atau Shopee pilihan kamu.
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
            <div className="relative max-w-md flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari produk..."
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

            {/* Categories */}
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
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all
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

        {/* ── Loading State ── */}
        {isLoading && (
          <div className="my-20 flex flex-col items-center justify-center text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            <p className="text-sm text-text-secondary">Memuat produk...</p>
          </div>
        )}

        {/* ── Featured Product ── */}
        {!isLoading && featuredProduct && (
          <ScrollReveal>
            <div className="mb-14">
              <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
                <Sparkles size={14} className="animate-pulse" /> Produk
                Unggulan
              </p>
              <div
                onClick={() => setSelectedProduct(featuredProduct)}
                className="group relative grid cursor-pointer grid-cols-1 overflow-hidden rounded-[2rem] border border-border bg-surface/30 transition-all duration-500 hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/5 md:grid-cols-12"
                style={{ backdropFilter: "blur(12px)" }}
              >
                {/* Image side */}
                <div className="relative min-h-[300px] overflow-hidden md:col-span-7 md:min-h-[420px]">
                  <img
                    src={featuredProduct.image}
                    alt={featuredProduct.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[6000ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-background/30 md:to-background/95" />
                  <div className="absolute left-6 top-6 rounded-xl border border-border bg-surface/80 px-3 py-1.5 text-xs font-bold text-text-primary backdrop-blur">
                    {featuredProduct.category}
                  </div>
                </div>

                {/* Content side */}
                <div className="flex flex-col justify-between p-8 md:col-span-5 md:p-10">
                  <div className="space-y-4">
                    <h2
                      className="font-serif text-2xl font-bold text-text-primary transition-colors group-hover:text-accent md:text-3xl lg:text-4xl"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {featuredProduct.name}
                    </h2>
                    <p className="text-base leading-relaxed text-text-secondary">
                      {featuredProduct.description}
                    </p>
                  </div>

                  <div className="mt-8 border-t border-border/40 pt-6">
                    <p className="mb-4 text-2xl font-bold text-white">
                      {formatRupiah(featuredProduct.price)}
                    </p>
                    <div className="inline-flex items-center gap-1 text-sm font-bold text-accent group-hover:underline">
                      <span>Lihat Detail</span>
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
        {!isLoading && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {gridProducts.slice(0, visibleCount).map((product) => (
              <ScrollReveal key={product.id}>
                <article
                  onClick={() => setSelectedProduct(product)}
                  className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[2rem] border border-border bg-surface/40 shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/30 hover:bg-surface/60 hover:shadow-2xl hover:shadow-accent/5"
                  style={{ backdropFilter: "blur(12px)" }}
                >
                  {/* Card Thumbnail */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                    <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-primary backdrop-blur">
                      {getCategoryIcon(product.category)}
                      {product.category}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col p-6">
                    <h3
                      className="mb-2 font-serif text-lg font-bold leading-snug text-text-primary transition-colors group-hover:text-accent"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {product.name}
                    </h3>
                    <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-text-secondary">
                      {product.description}
                    </p>

                    <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-4">
                      <span className="text-base font-bold text-text-primary">
                        {formatRupiah(product.price)}
                      </span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-accent group-hover:underline">
                        <span>Lihat</span>
                        <ChevronRight
                          size={14}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                      </span>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProducts.length === 0 && (
          <ScrollReveal>
            <div className="my-20 flex flex-col items-center justify-center rounded-3xl border border-border/40 bg-surface/20 p-8 text-center">
              <ShoppingBag
                size={48}
                className="mb-4 text-text-secondary opacity-50"
              />
              <h3 className="text-lg font-bold text-white">
                Produk tidak ditemukan
              </h3>
              <p className="mt-1 text-sm text-text-secondary">
                Coba gunakan kata kunci pencarian atau kategori lain.
              </p>
            </div>
          </ScrollReveal>
        )}

        {/* Load More Button */}
        {!isLoading && filteredProducts.length > visibleCount && (
          <ScrollReveal>
            <div className="mt-16 text-center">
              <button
                onClick={handleLoadMore}
                className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-surface/50 px-8 text-sm font-bold text-text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-surface"
              >
                Muat Lebih Banyak
              </button>
            </div>
          </ScrollReveal>
        )}
      </section>

      {/* ── Detail Modal ─────────────────────────────────────────────────── */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 animate-fade-in md:p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 cursor-pointer bg-background/85 backdrop-blur-lg"
            onClick={() => setSelectedProduct(null)}
          />

          {/* Modal Box */}
          <div
            className="relative flex h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] border border-accent/20 shadow-2xl animate-slide-up md:h-[80vh]"
            style={{
              background:
                "linear-gradient(160deg, rgba(22,42,64,0.98) 0%, rgba(8,17,30,0.98) 100%)",
              boxShadow:
                "0 28px 90px rgba(0,0,0,0.45), 0 0 50px rgba(111,168,220,0.12)",
            }}
          >
            {/* Header / Top controls */}
            <div className="flex shrink-0 items-center justify-between border-b border-border/40 p-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
                {getCategoryIcon(selectedProduct.category)}
                {selectedProduct.category}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border/60 bg-surface/30 text-text-secondary transition-colors hover:text-white"
                  title="Salin Tautan"
                >
                  <Share2 size={16} />
                </button>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-border/60 bg-surface/30 text-text-secondary transition-colors hover:text-white"
                  aria-label="Tutup"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Scroll Content */}
            <div className="no-scrollbar flex-1 space-y-6 overflow-y-auto p-6 md:p-8">
              {/* Copy success alert */}
              {isCopied && (
                <div className="animate-fade-in rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-center text-xs font-bold text-emerald-400">
                  Tautan disalin ke papan klip!
                </div>
              )}

              {/* Title */}
              <h2
                className="text-2xl font-bold leading-tight text-text-primary md:text-3xl"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {selectedProduct.name}
              </h2>

              {/* Large Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border/40">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>

              {/* Price */}
              <p className="text-3xl font-bold text-white">
                {formatRupiah(selectedProduct.price)}
              </p>

              {/* Description */}
              <div className="space-y-4 text-base leading-relaxed text-text-secondary md:text-lg">
                <p>{selectedProduct.description}</p>
              </div>

              {/* Buy Buttons */}
              <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
                <Link
                  href={selectedProduct.tokopedia_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#03AC0E]/40 bg-[#03AC0E]/10 px-5 py-3.5 text-sm font-bold text-[#4ADE80] transition-all hover:bg-[#03AC0E]/20"
                >
                  Beli di Tokopedia
                  <ExternalLink size={14} />
                </Link>
                <Link
                  href={selectedProduct.shopee_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#EE4D2D]/40 bg-[#EE4D2D]/10 px-5 py-3.5 text-sm font-bold text-[#FB923C] transition-all hover:bg-[#EE4D2D]/20"
                >
                  Beli di Shopee
                  <ExternalLink size={14} />
                </Link>
              </div>
              <p className="text-center text-xs text-text-secondary">
                Pembelian diproses sepenuhnya di marketplace pilihan kamu.
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
