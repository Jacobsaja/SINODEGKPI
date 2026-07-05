import Link from "next/link";
import { Newspaper, ShoppingBag, Sparkles, ArrowRight } from "lucide-react";
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
    },
    {
      label: "Renungan/Berita Unggulan",
      value: featuredPublications,
      icon: Sparkles,
      href: "/admin/publikasi",
    },
    {
      label: "Total Produk",
      value: products.length,
      icon: ShoppingBag,
      href: "/admin/toko",
    },
    {
      label: "Produk Unggulan",
      value: featuredProducts,
      icon: Sparkles,
      href: "/admin/toko",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-accent">
          Ringkasan
        </p>
        <h1
          className="text-3xl font-bold text-white"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Dashboard Admin
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Kelola konten publikasi dan produk toko GKPI Sinode dari satu tempat.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group rounded-2xl border border-border bg-surface/40 p-5 transition-all hover:-translate-y-0.5 hover:border-accent/30 hover:bg-surface/60"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-accent">
                <Icon size={18} />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 text-xs font-semibold text-text-secondary">
                {stat.label}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/publikasi"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition-all hover:bg-primary-dark"
        >
          <Newspaper size={16} />
          Kelola Publikasi
        </Link>
        <Link
          href="/admin/toko"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface/50 px-5 py-3 text-sm font-bold text-text-primary transition-all hover:border-accent/40"
        >
          <ShoppingBag size={16} />
          Kelola Toko
        </Link>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Publikasi terbaru */}
        <div className="rounded-2xl border border-border bg-surface/30 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-white">Publikasi Terbaru</h2>
            <Link
              href="/admin/publikasi"
              className="flex items-center gap-1 text-xs font-bold text-accent hover:underline"
            >
              Lihat semua <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentPublications.length === 0 && (
              <p className="text-sm text-text-secondary">
                Belum ada publikasi.
              </p>
            )}
            {recentPublications.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-background/30 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {item.title}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {item.category} · {formatDateID(item.date)}
                  </p>
                </div>
                {item.is_featured && (
                  <span className="shrink-0 rounded-full border border-accent/30 bg-accent/10 px-2 py-1 text-[10px] font-bold text-accent">
                    Unggulan
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Produk terbaru */}
        <div className="rounded-2xl border border-border bg-surface/30 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-white">Produk Terbaru</h2>
            <Link
              href="/admin/toko"
              className="flex items-center gap-1 text-xs font-bold text-accent hover:underline"
            >
              Lihat semua <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentProducts.length === 0 && (
              <p className="text-sm text-text-secondary">Belum ada produk.</p>
            )}
            {recentProducts.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-background/30 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {item.name}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {item.category} · {formatRupiah(item.price)}
                  </p>
                </div>
                {item.is_featured && (
                  <span className="shrink-0 rounded-full border border-accent/30 bg-accent/10 px-2 py-1 text-[10px] font-bold text-accent">
                    Unggulan
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
