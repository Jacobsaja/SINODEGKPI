// src/app/toko/page.tsx
"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { products, getCategories } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function TokoPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  const categories = useMemo(() => getCategories(products), []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        activeCategory === "Semua" || p.category === activeCategory;
      const matchesQuery =
        query.trim() === "" ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
          <h1 className="font-serif text-2xl font-bold sm:text-3xl">
            Katalog Produk
          </h1>
          <p className="text-sm text-text-secondary">
            Lihat produk kami, lalu beli langsung lewat Tokopedia atau Shopee.
          </p>

          {/* Search bar */}
          <div className="mt-5">
            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari nama atau deskripsi produk..."
                className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-secondary focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          {/* Category filter */}
          <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-border text-text-secondary hover:border-accent/50 hover:text-text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Product grid */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-20 text-center">
            <p className="font-serif text-lg font-bold text-text-primary">
              Produk tidak ditemukan
            </p>
            <p className="max-w-sm text-sm text-text-secondary">
              Coba kata kunci lain atau pilih kategori berbeda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
