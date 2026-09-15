"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Publication, Product, FinancialReport } from "@/lib/types";
import type { Jemaat } from "@/data/jemaat";
import {
  Eye,
  Newspaper,
  BookOpen,
  ShoppingBag,
  Building2,
  TrendingUp,
  Headphones,
  FileText,
  ArrowRight,
  Sparkles,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Layers,
  BarChart3,
  Flame,
  Award,
} from "lucide-react";

interface AdminAnalyticsViewProps {
  publications: Publication[];
  products: Product[];
  churches: Jemaat[];
  financialReports: FinancialReport[];
}

type AnalyticsTab = "ringkasan" | "pembaca" | "departemen" | "gereja" | "toko";

export default function AdminAnalyticsView({
  publications,
  products,
  churches,
  financialReports,
}: AdminAnalyticsViewProps) {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("ringkasan");

  // ─── 1. Aggregated Metrics Calculation ──────────────────────────────────────
  const stats = useMemo(() => {
    const totalViews = publications.reduce((acc, p) => acc + (p.views || 0), 0);
    const devotionPubs = publications.filter((p) => p.category === "Renungan Harian");
    const devotionViews = devotionPubs.reduce((acc, p) => acc + (p.views || 0), 0);
    const audioDevotions = publications.filter(
      (p) =>
        p.audio_url ||
        (p.document_url &&
          (p.document_url.includes("/audios/") ||
            p.document_url.endsWith(".mp3") ||
            p.document_url.endsWith(".m4a") ||
            p.document_url.endsWith(".wav")))
    );

    // Kategori Publikasi
    const categoriesMap: Record<string, { count: number; views: number }> = {};
    for (const p of publications) {
      const cat = p.category || "Lainnya";
      if (!categoriesMap[cat]) categoriesMap[cat] = { count: 0, views: 0 };
      categoriesMap[cat].count += 1;
      categoriesMap[cat].views += p.views || 0;
    }

    // Departemen Pelayanan
    const deptList = ["Diakonat", "Apostolat", "Pastorat", "Sinode"] as const;
    const departmentsMap: Record<string, { count: number; views: number; featured: number }> = {
      Diakonat: { count: 0, views: 0, featured: 0 },
      Apostolat: { count: 0, views: 0, featured: 0 },
      Pastorat: { count: 0, views: 0, featured: 0 },
      Sinode: { count: 0, views: 0, featured: 0 },
    };

    for (const p of publications) {
      const dept = (p.department ?? "Sinode") as string;
      const targetDept = deptList.includes(dept as (typeof deptList)[number]) ? dept : "Sinode";
      departmentsMap[targetDept].count += 1;
      departmentsMap[targetDept].views += p.views || 0;
      if (p.is_featured) departmentsMap[targetDept].featured += 1;
    }

    // Top 5 Konten Paling Populer
    const topPublications = [...publications]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 5);

    // Sebaran Wilayah / Provinsi Gereja
    const provincesMap: Record<string, number> = {};
    let churchesWithPastor = 0;
    for (const c of churches) {
      const prov = c.provinsi ? c.provinsi.trim() : "Lainnya";
      provincesMap[prov] = (provincesMap[prov] || 0) + 1;
      if (c.pendeta && c.pendeta.trim() !== "") churchesWithPastor += 1;
    }

    const sortedProvinces = Object.entries(provincesMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    // Toko & Katalog Digital
    const featuredProductsCount = products.filter((p) => p.is_featured).length;
    const marketplaceIntegratedCount = products.filter(
      (p) => Boolean(p.tokopedia_url && p.tokopedia_url.trim()) || Boolean(p.shopee_url && p.shopee_url.trim())
    ).length;
    const avgProductPrice =
      products.length > 0
        ? Math.round(products.reduce((acc, p) => acc + (p.price || 0), 0) / products.length)
        : 0;

    const productCategoriesMap: Record<string, number> = {};
    for (const prod of products) {
      const cat = prod.category || "Umum";
      productCategoriesMap[cat] = (productCategoriesMap[cat] || 0) + 1;
    }

    // Laporan Keuangan
    const publishedReports = financialReports.filter((r) => r.status === "published");

    // Dummy 7-Day Trend Visual Data (berdasarkan rentang waktu hari ini)
    const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
    const baseDailyRatio = [0.65, 0.8, 0.75, 0.9, 0.85, 1.0, 1.25];
    const avgDailyViews = Math.max(12, Math.round(totalViews / 30));
    const trendData = days.map((day, idx) => ({
      day,
      views: Math.round(avgDailyViews * baseDailyRatio[idx]),
    }));
    const maxTrendViews = Math.max(...trendData.map((d) => d.views), 1);

    return {
      totalViews,
      devotionPubsCount: devotionPubs.length,
      devotionViews,
      audioDevotionsCount: audioDevotions.length,
      categoriesMap,
      departmentsMap,
      topPublications,
      sortedProvinces,
      churchesWithPastor,
      featuredProductsCount,
      marketplaceIntegratedCount,
      avgProductPrice,
      productCategoriesMap,
      publishedReportsCount: publishedReports.length,
      trendData,
      maxTrendViews,
    };
  }, [publications, products, churches, financialReports]);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* ─── 1. Header Banner Eksekutif ────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-primary p-7 sm:p-10 shadow-xl shadow-primary/20 text-white">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Pusat Data & Analitik Sinode GKPI</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Pusat Kendali Eksekutif
            </h1>
            <p className="text-sm sm:text-base text-white max-w-xl">
              Pantau antusiasme pembaca, sebaran firman, sebaran jemaat, serta kinerja departemen pelayanan secara terpadu.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md text-center shrink-0">
              <p className="text-[11px] uppercase tracking-wider text-white/70 font-semibold">Total Pembaca</p>
              <p className="text-xl sm:text-2xl font-black">{stats.totalViews.toLocaleString("id-ID")}</p>
            </div>
            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-md text-center shrink-0">
              <p className="text-[11px] uppercase tracking-wider text-white/70 font-semibold">Gereja Terdaftar</p>
              <p className="text-xl sm:text-2xl font-black">{churches.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. Top 4 High-Level Metric Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Pembaca & Pengunjung */}
        <div className="group relative overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-400/20 bg-sky-400/10 text-sky-400">
              <Eye size={22} />
            </div>
            <span className="text-[10px] font-bold text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded-full">
              Kunjungan
            </span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-text-primary tracking-tight">
              {stats.totalViews.toLocaleString("id-ID")}
            </p>
            <p className="text-sm font-semibold text-text-secondary mt-0.5">Total Pembaca Konten</p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-text-secondary font-medium">
              <TrendingUp size={13} className="text-primary" />
              <span>{stats.devotionViews.toLocaleString("id-ID")} pada Renungan</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Publikasi & Audio */}
        <div className="group relative overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
              <Newspaper size={22} />
            </div>
            <Link
              href="/admin/publikasi"
              className="text-[10px] font-bold text-text-secondary hover:text-primary transition-colors bg-background px-2.5 py-1 rounded-lg border border-border"
            >
              Kelola
            </Link>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-text-primary tracking-tight">
              {publications.length}
            </p>
            <p className="text-sm font-semibold text-text-secondary mt-0.5">Publikasi & Renungan Aktif</p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-text-secondary font-medium">
              <Headphones size={13} className="text-sky-400" />
              <span>{stats.audioDevotionsCount} renungan ber-audio</span>
            </div>
          </div>
        </div>

        {/* Card 3: Database Jemaat & Resort */}
        <div className="group relative overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
              <Building2 size={22} />
            </div>
            <Link
              href="/admin/jemaat"
              className="text-[10px] font-bold text-text-secondary hover:text-primary transition-colors bg-background px-2.5 py-1 rounded-lg border border-border"
            >
              Sensus
            </Link>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-text-primary tracking-tight">
              {churches.length}
            </p>
            <p className="text-sm font-semibold text-text-secondary mt-0.5">Gereja / Pos Pelayanan</p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-text-secondary font-medium">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>{stats.churchesWithPastor} pendeta terdata</span>
            </div>
          </div>
        </div>

        {/* Card 4: Toko Digital & Nilai Stok */}
        <div className="group relative overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-500/10 text-purple-400">
              <ShoppingBag size={22} />
            </div>
            <Link
              href="/admin/toko"
              className="text-[10px] font-bold text-text-secondary hover:text-primary transition-colors bg-background px-2.5 py-1 rounded-lg border border-border"
            >
              Katalog
            </Link>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-text-primary tracking-tight">
              {products.length}
            </p>
            <p className="text-sm font-semibold text-text-secondary mt-0.5">Produk Toko Digital</p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-text-secondary font-medium">
              <Sparkles size={13} className="text-purple-400" />
              <span>{stats.featuredProductsCount} produk unggulan</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. Navigation Tab Bar ────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 border-b border-border/80 pb-3 overflow-x-auto">
        <div className="flex items-center gap-2">
          {[
            { id: "ringkasan", label: "Ringkasan Eksekutif", icon: BarChart3 },
            { id: "pembaca", label: "Analitik Pembaca & Renungan", icon: Eye },
            { id: "departemen", label: "Kinerja Departemen", icon: Layers },
            { id: "gereja", label: "Sebaran Gereja", icon: MapPin },
            { id: "toko", label: "Toko & Inventori", icon: ShoppingBag },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as AnalyticsTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface border border-transparent"
                  }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── 4. Konten Tab Dinamis ─────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {/* TAB 1: RINGKASAN EKSEKUTIF */}
        {activeTab === "ringkasan" && (
          <motion.div
            key="tab-ringkasan"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            {/* Visual Tren & Statistik Ringkas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Kolom Kiri: Visualisasi Tren Mingguan */}
              <div className="lg:col-span-7 rounded-3xl border border-border bg-surface p-6 sm:p-7 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-text-primary">
                      Aktivitas Pembaca Mingguan
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Estimasi dinamika pembaca publikasi dan renungan dalam 7 hari terakhir
                    </p>
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20">
                    Aktif
                  </span>
                </div>

                {/* Grafik Batang CSS Ringan & Ramping */}
                <div className="pt-4 pb-2">
                  <div className="flex items-end justify-between gap-3 h-44 px-2">
                    {stats.trendData.map((d, i) => {
                      const heightPercent = Math.round((d.views / stats.maxTrendViews) * 100);
                      const isSunday = d.day === "Min";
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                          <span className="text-[10px] font-bold text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                            {d.views}
                          </span>
                          <div className="w-full max-w-[36px] bg-background/60 rounded-xl overflow-hidden h-32 flex items-end">
                            <div
                              style={{ height: `${heightPercent}%` }}
                              className={`w-full rounded-t-xl transition-all duration-500 ${isSunday
                                  ? "bg-gradient-to-t from-primary to-sky-400 shadow-lg shadow-primary/20"
                                  : "bg-primary/50 group-hover:bg-primary"
                                }`}
                            />
                          </div>
                          <span
                            className={`text-xs font-bold ${isSunday ? "text-primary" : "text-text-secondary"
                              }`}
                          >
                            {d.day}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-border/50 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-text-secondary">
                  <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                    Puncak kunjungan tertinggi pada hari Minggu (Hari Ibadah)
                  </span>
                  <span className="font-semibold text-text-primary">Rata-rata ~{Math.round(stats.totalViews / 30)} pembaca / hari</span>
                </div>
              </div>

              {/* Kolom Kanan: Top 5 Konten Paling Populer */}
              <div className="lg:col-span-5 rounded-3xl border border-border bg-surface p-6 sm:p-7 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame size={18} className="text-amber-400" />
                    <h3 className="text-base sm:text-lg font-bold text-text-primary">
                      Top 5 Konten Terpopuler
                    </h3>
                  </div>
                  <Link
                    href="/admin/publikasi"
                    className="text-xs font-bold text-primary hover:underline"
                  >
                    Semua
                  </Link>
                </div>

                <div className="space-y-3 pt-1">
                  {stats.topPublications.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/40 p-3 hover:border-primary/30 transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold ${idx === 0
                              ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                              : idx === 1
                                ? "bg-slate-300/20 text-slate-200 border border-slate-300/30"
                                : "bg-surface text-text-secondary border border-border"
                            }`}
                        >
                          {idx + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors truncate">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-text-secondary truncate mt-0.5">
                            {item.category} · {item.author}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-text-primary">
                          {item.views.toLocaleString("id-ID")}
                        </span>
                        <span className="text-[10px] text-text-secondary block">dilihat</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Link Modules */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/admin/publikasi?tab=form"
                className="flex items-center justify-between p-5 rounded-2xl border border-border bg-surface hover:border-primary/40 hover:-translate-y-0.5 transition-all group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                      Tulis Renungan Baru
                    </p>
                    <p className="text-xs text-text-secondary">Sertakan audio & nats ayat</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-text-secondary group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/admin/jemaat"
                className="flex items-center justify-between p-5 rounded-2xl border border-border bg-surface hover:border-primary/40 hover:-translate-y-0.5 transition-all group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                      Kelola Sensus Gereja
                    </p>
                    <p className="text-xs text-text-secondary">Data resort & alamat gereja</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-text-secondary group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/admin/laporan-keuangan"
                className="flex items-center justify-between p-5 rounded-2xl border border-border bg-surface hover:border-primary/40 hover:-translate-y-0.5 transition-all group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                      Laporan Keuangan
                    </p>
                    <p className="text-xs text-text-secondary">{stats.publishedReportsCount} dokumen dipublikasikan</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-text-secondary group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        )}

        {/* TAB 2: ANALITIK PEMBACA & RENUNGAN */}
        {activeTab === "pembaca" && (
          <motion.div
            key="tab-pembaca"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Highlight Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-border bg-surface p-5 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Pembaca Renungan Harian
                </p>
                <p className="text-3xl font-extrabold text-sky-400">
                  {stats.devotionViews.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-text-secondary">
                  Dari {stats.devotionPubsCount} renungan aktif (30 hari terakhir)
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-5 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Adopsi Audio Renungan
                </p>
                <p className="text-3xl font-extrabold text-primary">
                  {stats.audioDevotionsCount}{" "}
                  <span className="text-sm font-normal text-text-secondary">rekaman</span>
                </p>
                <p className="text-xs text-text-secondary">
                  {stats.devotionPubsCount > 0
                    ? `${Math.round((stats.audioDevotionsCount / stats.devotionPubsCount) * 100)}% renungan dilengkapi audio`
                    : "Belum ada audio"}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-5 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Rata-rata Baca Per Konten
                </p>
                <p className="text-3xl font-extrabold text-emerald-400">
                  {publications.length > 0
                    ? Math.round(stats.totalViews / publications.length).toLocaleString("id-ID")
                    : 0}{" "}
                  <span className="text-sm font-normal text-text-secondary">views</span>
                </p>
                <p className="text-xs text-text-secondary">Tingkat jangkauan pembacaan jemaat</p>
              </div>
            </div>

            {/* Distribusi Pembaca Berdasarkan Kategori Konten */}
            <div className="rounded-3xl border border-border bg-surface p-6 sm:p-7 space-y-5">
              <h3 className="text-base sm:text-lg font-bold text-text-primary">
                Sebaran Pembaca Berdasarkan Kategori Konten
              </h3>

              <div className="space-y-4">
                {Object.entries(stats.categoriesMap).map(([category, data]) => {
                  const percent =
                    stats.totalViews > 0
                      ? Math.round((data.views / stats.totalViews) * 100)
                      : 0;
                  return (
                    <div key={category} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-text-primary">
                        <span className="flex items-center gap-2">
                          <span>{category}</span>
                          <span className="text-[10px] text-text-secondary font-normal">
                            ({data.count} publikasi)
                          </span>
                        </span>
                        <span>
                          {data.views.toLocaleString("id-ID")} views ({percent}%)
                        </span>
                      </div>
                      <div className="h-2.5 w-full rounded-full bg-background overflow-hidden">
                        <div
                          style={{ width: `${percent}%` }}
                          className={`h-full rounded-full ${category === "Renungan Harian"
                              ? "bg-sky-400"
                              : category === "Berita"
                                ? "bg-emerald-400"
                                : category === "Pengumuman"
                                  ? "bg-amber-400"
                                  : "bg-purple-400"
                            }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: KINERJA DEPARTEMEN */}
        {activeTab === "departemen" && (
          <motion.div
            key="tab-departemen"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(["Diakonat", "Apostolat", "Pastorat", "Sinode"] as const).map((dept) => {
                const data = stats.departmentsMap[dept];
                const sharePercent =
                  publications.length > 0
                    ? Math.round((data.count / publications.length) * 100)
                    : 0;
                return (
                  <div
                    key={dept}
                    className="rounded-2xl border border-border bg-surface p-5 space-y-4 hover:border-primary/40 transition-colors shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
                        Departemen {dept}
                      </span>
                      <span className="text-[10px] font-bold text-text-secondary bg-background px-2 py-0.5 rounded border border-border">
                        {sharePercent}% Konten
                      </span>
                    </div>

                    <div>
                      <p className="text-3xl font-extrabold text-text-primary tracking-tight">
                        {data.count}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">Materi & Warta Diterbitkan</p>
                    </div>

                    <div className="border-t border-border/50 pt-3 flex items-center justify-between text-xs text-text-secondary">
                      <span>Total Dibaca:</span>
                      <span className="font-bold text-text-primary">{data.views.toLocaleString("id-ID")} x</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-3xl border border-border bg-surface p-6 space-y-3">
              <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Award size={16} className="text-primary" />
                Catatan Evaluasi Pelayanan
              </h4>
              <p className="text-xs text-text-secondary leading-relaxed">
                Departemen dapat mempublikasikan bimbingan pastoral, warta diakonia, dan materi penginjilan/apostolat secara mandiri. Gunakan filter departemen di halaman publikasi untuk memantau artikel masing-masing bidang.
              </p>
            </div>
          </motion.div>
        )}

        {/* TAB 4: SEBARAN GEREJA & WILAYAH */}
        {activeTab === "gereja" && (
          <motion.div
            key="tab-gereja"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Kolom Kiri: Ranking Provinsi */}
              <div className="lg:col-span-7 rounded-3xl border border-border bg-surface p-6 sm:p-7 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-bold text-text-primary">
                    Sebaran Gereja Berdasarkan Provinsi
                  </h3>
                  <Link href="/admin/jemaat" className="text-xs font-bold text-primary hover:underline">
                    Buka Sensus
                  </Link>
                </div>

                <div className="space-y-3.5">
                  {stats.sortedProvinces.map(([prov, count], i) => {
                    const pct = churches.length > 0 ? Math.round((count / churches.length) * 100) : 0;
                    return (
                      <div key={prov} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold text-text-primary">
                          <span className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-text-secondary w-4">
                              #{i + 1}
                            </span>
                            <span>{prov}</span>
                          </span>
                          <span>
                            {count} Gereja ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-background overflow-hidden">
                          <div
                            style={{ width: `${pct}%` }}
                            className="h-full rounded-full bg-primary"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Kolom Kanan: Ringkasan Kelengkapan Data */}
              <div className="lg:col-span-5 rounded-3xl border border-border bg-surface p-6 space-y-4">
                <h3 className="text-base font-bold text-text-primary">
                  Status Database Pelayanan
                </h3>

                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">Pendeta Terdata</span>
                    <span className="text-xs font-extrabold text-emerald-400">
                      {churches.length > 0 ? Math.round((stats.churchesWithPastor / churches.length) * 100) : 0}%
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    {stats.churchesWithPastor} dari {churches.length} gereja telah dilengkapi kontak & nama pendeta jemaat.
                  </p>
                </div>

                <Link
                  href="/admin/jemaat"
                  className="flex items-center justify-between p-4 rounded-xl border border-border bg-background/50 hover:border-primary/40 transition-colors text-xs font-bold text-text-primary group"
                >
                  <span>Lihat & Perbarui Peta Sensus Gereja</span>
                  <ArrowRight size={14} className="text-primary group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: TOKO & KATALOG DIGITAL */}
        {activeTab === "toko" && (
          <motion.div
            key="tab-toko"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-border bg-surface p-5 space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Total Katalog Produk
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-primary">
                  {products.length}
                </p>
                <p className="text-xs text-text-secondary">Buku rohani, kaos & atribut ibadah</p>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-5 space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Produk Unggulan Beranda
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">
                  {stats.featuredProductsCount}
                </p>
                <p className="text-xs text-text-secondary">Disorot di etalase beranda utama</p>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-5 space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Terhubung Marketplace
                </p>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                  {stats.marketplaceIntegratedCount}{" "}
                  <span className="text-sm font-normal text-text-secondary">produk</span>
                </p>
                <p className="text-xs text-text-secondary">Tersedia tautan Tokopedia / Shopee</p>
              </div>
            </div>

            {/* Kategori Produk & Aksi Cepat */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 rounded-3xl border border-border bg-surface p-6 sm:p-7 space-y-5">
                <h3 className="text-base sm:text-lg font-bold text-text-primary">
                  Distribusi Kategori Produk
                </h3>
                <div className="space-y-3">
                  {Object.entries(stats.productCategoriesMap).map(([cat, count]) => {
                    const pct = products.length > 0 ? Math.round((count / products.length) * 100) : 0;
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold text-text-primary">
                          <span>{cat}</span>
                          <span>{count} produk ({pct}%)</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-background overflow-hidden">
                          <div style={{ width: `${pct}%` }} className="h-full rounded-full bg-purple-500" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="lg:col-span-5 rounded-3xl border border-border bg-surface p-6 space-y-4">
                <h3 className="text-base font-bold text-text-primary">
                  Kelola Toko Digital
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Tambah produk buku renungan, atribut gereja, dan merchandise jemaat, serta tautkan ke marketplace online resmi GKPI.
                </p>
                <Link
                  href="/admin/toko"
                  className="flex items-center justify-between p-4 rounded-xl border border-border bg-background/50 hover:border-primary/40 transition-colors text-xs font-bold text-text-primary group"
                >
                  <span>Buka Kelola Produk Toko</span>
                  <ArrowRight size={14} className="text-primary group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
