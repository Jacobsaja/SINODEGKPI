import Link from "next/link";
import { Newspaper, ShoppingBag, Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import { getAllPublications, formatDateID } from "@/lib/publications";
import { getAllProducts, formatRupiah } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [publications, products] = await Promise.all([
    getAllPublications(),
    getAllProducts(),
  ]);

  const featuredPublications = publications.filter((p) => p.is_featured).length;
  const featuredProducts = products.filter((p) => p.is_featured).length;

  const recentPublications = publications.slice(0, 5);
  const recentProducts = products.slice(0, 5);

  const stats = [
    {
      label: "Total Publikasi",
      value: publications.length,
      icon: Newspaper,
      href: "/admin/publikasi",
      colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      trend: "+4 konten baru bulan ini",
    },
    {
      label: "Renungan & Berita Unggulan",
      value: featuredPublications,
      icon: Sparkles,
      href: "/admin/publikasi",
      colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      trend: "Pin di halaman utama",
    },
    {
      label: "Total Produk Toko",
      value: products.length,
      icon: ShoppingBag,
      href: "/admin/toko",
      colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      trend: "Buku, kaos & aksesoris",
    },
    {
      label: "Produk Unggulan Toko",
      value: featuredProducts,
      icon: Sparkles,
      href: "/admin/toko",
      colorClass: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      trend: "Highlight toko utama",
    },
  ];

  // Helper untuk category badge styling
  const getPubCategoryStyle = (category: string) => {
    switch (category) {
      case "Renungan Harian":
        return "text-sky-300 bg-sky-400/10 border-sky-400/20";
      case "Berita":
        return "text-emerald-300 bg-emerald-400/10 border-emerald-400/20";
      case "Pengumuman":
        return "text-amber-300 bg-amber-400/10 border-amber-400/20";
      case "Kegiatan":
        return "text-purple-300 bg-purple-500/10 border-purple-500/20";
      default:
        return "text-slate-300 bg-slate-500/10 border-slate-500/20";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-accent">
            Ringkasan Sistem
          </p>
          <h1
            className="text-3xl font-extrabold text-white mt-1"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Dashboard Admin
          </h1>
          <p className="mt-1.5 text-sm text-text-secondary">
            Kelola konten renungan, pengumuman, berita, dan katalog toko GKPI Sinode dari satu tempat.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface/30 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:bg-surface/50 shadow-lg hover:shadow-accent/5"
            >
              <div className="flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${stat.colorClass}`}>
                  <Icon size={22} />
                </div>
                <span className="text-[10px] font-bold text-text-secondary/70 uppercase tracking-widest bg-background/50 px-2.5 py-1 rounded-lg border border-border/40 transition-colors group-hover:border-accent/30 group-hover:text-white">
                  Kelola
                </span>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-extrabold text-white tracking-tight">{stat.value}</p>
                <p className="mt-1 text-sm font-semibold text-text-primary">{stat.label}</p>
                <p className="mt-2.5 text-xs text-text-secondary/80 flex items-center gap-1 font-medium">
                  <TrendingUp size={12} className="text-accent" />
                  {stat.trend}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions Deck */}
      <div className="rounded-2xl border border-border/80 bg-surface/20 p-6">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-accent mb-4">Aksi Cepat Admin</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/publikasi?tab=form"
            className="flex items-center gap-4 rounded-2xl border border-border bg-surface/40 p-4 transition-all hover:border-accent/40 hover:bg-surface/60 hover:-translate-y-0.5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Tulis Publikasi</p>
              <p className="text-xs text-text-secondary mt-0.5">Tambah warta, berita & renungan</p>
            </div>
          </Link>
          <Link
            href="/admin/toko?tab=form"
            className="flex items-center gap-4 rounded-2xl border border-border bg-surface/40 p-4 transition-all hover:border-accent/40 hover:bg-surface/60 hover:-translate-y-0.5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-purple-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Tambah Produk</p>
              <p className="text-xs text-text-secondary mt-0.5">Tambah merchandise & buku baru</p>
            </div>
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-border bg-surface/40 p-4 transition-all hover:border-accent/40 hover:bg-surface/60 hover:-translate-y-0.5"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><path d="m21 3-9 9" /><path d="M15 3h6v6" /></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Lihat Website</p>
              <p className="text-xs text-text-secondary mt-0.5">Buka halaman publik utama</p>
            </div>
          </a>
        </div>
      </div>

      Analytics Chart Block


      {/* Recent activity grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Publikasi terbaru */}
        <div className="rounded-2xl border border-border bg-surface/30 p-6 flex flex-col h-full">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-white text-base">Publikasi Terkini</h2>
            <Link
              href="/admin/publikasi"
              className="flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent-light transition-colors"
            >
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3.5 flex-1">
            {recentPublications.length === 0 && (
              <p className="text-sm text-text-secondary py-6 text-center bg-background/25 rounded-xl border border-border/40">
                Belum ada publikasi terdaftar.
              </p>
            )}
            {recentPublications.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-border/45 bg-background/20 hover:bg-background/40 p-3.5 transition-all duration-200"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-10 w-10 shrink-0 rounded-lg object-cover border border-border/60"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface/50 text-text-secondary border border-border/50">
                      <Newspaper size={16} />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-text-primary group-hover:text-accent transition-colors">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`rounded-md border px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ${getPubCategoryStyle(item.category)}`}>
                        {item.category}
                      </span>
                      <span className="text-[10px] text-text-secondary">
                        {formatDateID(item.date)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {item.is_featured && (
                    <span className="rounded-full border border-amber-500/35 bg-amber-500/10 px-2 py-0.5 text-[9px] font-extrabold text-amber-400 uppercase tracking-wider">
                      Pin
                    </span>
                  )}
                  <Link
                    href={`/admin/publikasi?edit=${item.id}`}
                    className="text-xs font-bold text-accent hover:text-accent-light px-2.5 py-1 rounded-lg hover:bg-accent/10 border border-transparent hover:border-accent/20 transition-all"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Produk terbaru */}
        <div className="rounded-2xl border border-border bg-surface/30 p-6 flex flex-col h-full">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-white text-base">Produk Terkini</h2>
            <Link
              href="/admin/toko"
              className="flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent-light transition-colors"
            >
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3.5 flex-1">
            {recentProducts.length === 0 && (
              <p className="text-sm text-text-secondary py-6 text-center bg-background/25 rounded-xl border border-border/40">
                Belum ada produk toko terdaftar.
              </p>
            )}
            {recentProducts.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-border/45 bg-background/20 hover:bg-background/40 p-3.5 transition-all duration-200"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-10 w-10 shrink-0 rounded-lg object-cover border border-border/60"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface/50 text-text-secondary border border-border/50">
                      <ShoppingBag size={16} />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-text-primary group-hover:text-accent transition-colors">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="rounded-md border border-purple-500/20 bg-purple-500/10 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-purple-300">
                        {item.category || "Umum"}
                      </span>
                      <span className="text-[10px] font-bold text-accent">
                        {formatRupiah(item.price)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {item.is_featured && (
                    <span className="rounded-full border border-amber-500/35 bg-amber-500/10 px-2 py-0.5 text-[9px] font-extrabold text-amber-400 uppercase tracking-wider">
                      Star
                    </span>
                  )}
                  <Link
                    href={`/admin/toko?edit=${item.id}`}
                    className="text-xs font-bold text-accent hover:text-accent-light px-2.5 py-1 rounded-lg hover:bg-accent/10 border border-transparent hover:border-accent/20 transition-all"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
