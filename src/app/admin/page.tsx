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
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-primary p-8 md:p-10 shadow-lg shadow-primary/20">
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/80 mb-2">
            Selamat Datang di
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            GKPI Sinode Workspace
          </h1>
          <p className="mt-2 text-sm md:text-base text-white/90 max-w-xl">
            Pusat kendali untuk mengelola seluruh publikasi gereja, data jemaat, dan operasional toko digital dengan mudah.
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
              className="group relative overflow-hidden rounded-3xl border border-border bg-surface p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/40 shadow-sm hover:shadow-xl hover:shadow-primary/10"
            >
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-transparent to-primary/[0.03] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              
              <div className="flex items-start justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${stat.colorClass} transition-transform duration-500 group-hover:scale-110`}>
                  <Icon size={22} />
                </div>
                <span className="text-[10px] font-bold text-text-secondary/70 uppercase tracking-widest bg-background/80 px-2.5 py-1 rounded-lg border border-border/60 transition-colors group-hover:border-primary/40 group-hover:text-primary group-hover:bg-primary/5">
                  Kelola
                </span>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-primary tracking-tight">{stat.value}</p>
                <p className="mt-1 text-sm font-semibold text-text-primary">{stat.label}</p>
                <p className="mt-2.5 text-xs text-text-secondary/80 flex items-center gap-1 font-medium">
                  <TrendingUp size={12} className="text-primary" />
                  {stat.trend}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions Deck */}
      <div className="rounded-3xl border border-border/80 bg-surface/40 p-6 backdrop-blur-sm">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-primary mb-4 flex items-center gap-2">
          <Sparkles size={14} /> Aksi Cepat Admin
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/publikasi?tab=form"
            className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-primary">Tulis Publikasi</p>
              <p className="text-xs text-text-secondary mt-0.5">Tambah warta, berita & renungan</p>
            </div>
          </Link>
          <Link
            href="/admin/toko?tab=form"
            className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition-all duration-300 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-500/5 hover:-translate-y-1"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-purple-400 transition-transform duration-300 group-hover:scale-110 group-hover:bg-purple-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-primary">Tambah Produk</p>
              <p className="text-xs text-text-secondary mt-0.5">Tambah merchandise & buku baru</p>
            </div>
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition-all duration-300 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-1"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 transition-transform duration-300 group-hover:scale-110 group-hover:bg-emerald-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><path d="m21 3-9 9" /><path d="M15 3h6v6" /></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-primary">Lihat Website</p>
              <p className="text-xs text-text-secondary mt-0.5">Buka halaman publik utama</p>
            </div>
          </a>
        </div>
      </div>

      Analytics Chart Block


      {/* Recent activity grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Publikasi terbaru */}
        <div className="rounded-2xl border border-border bg-surface p-6 flex flex-col h-full">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-primary text-base">Publikasi Terkini</h2>
            <Link
              href="/admin/publikasi"
              className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-red-700 transition-colors"
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
              <Link
                key={item.id}
                href={`/admin/publikasi?edit=${item.id}`}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-border/45 bg-background/40 hover:bg-surface p-4 transition-all duration-300 hover:shadow-md hover:shadow-primary/5 hover:-translate-y-0.5 hover:border-primary/20"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image || undefined}
                      alt={item.title}
                      className="h-12 w-12 shrink-0 rounded-xl object-cover border border-border/60 transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface text-text-secondary border border-border/50 transition-transform duration-300 group-hover:scale-105 group-hover:text-primary">
                      <Newspaper size={18} />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`rounded-md border px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ${getPubCategoryStyle(item.category)}`}>
                        {item.category}
                      </span>
                      <span className="text-[10px] text-text-secondary font-medium">
                        {formatDateID(item.date)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {item.is_featured && (
                    <span className="rounded-full border border-amber-500/35 bg-amber-500/10 px-2 py-0.5 text-[9px] font-extrabold text-amber-500 uppercase tracking-wider">
                      Pin
                    </span>
                  )}
                  <div className="text-text-secondary opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:text-primary">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Produk terbaru */}
        <div className="rounded-2xl border border-border bg-surface p-6 flex flex-col h-full">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-primary text-base">Produk Terkini</h2>
            <Link
              href="/admin/toko"
              className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-red-700 transition-colors"
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
              <Link
                key={item.id}
                href={`/admin/toko?edit=${item.id}`}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-border/45 bg-background/40 hover:bg-surface p-4 transition-all duration-300 hover:shadow-md hover:shadow-purple-500/5 hover:-translate-y-0.5 hover:border-purple-500/20"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image || undefined}
                      alt={item.name}
                      className="h-12 w-12 shrink-0 rounded-xl object-cover border border-border/60 transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface text-text-secondary border border-border/50 transition-transform duration-300 group-hover:scale-105 group-hover:text-purple-400">
                      <ShoppingBag size={18} />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-text-primary group-hover:text-purple-500 transition-colors">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="rounded-md border border-purple-500/20 bg-purple-500/10 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-purple-400">
                        {item.category || "Umum"}
                      </span>
                      <span className="text-[10px] font-extrabold text-primary">
                        {formatRupiah(item.price)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {item.is_featured && (
                    <span className="rounded-full border border-amber-500/35 bg-amber-500/10 px-2 py-0.5 text-[9px] font-extrabold text-amber-500 uppercase tracking-wider">
                      Star
                    </span>
                  )}
                  <div className="text-text-secondary opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:text-purple-500">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
