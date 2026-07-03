// src/lib/products.ts
// Data produk untuk halaman toko.
// Sekarang masih statis di file ini. Nanti kalau dashboard admin sudah
// dibuat, ganti bagian ini jadi fetch dari database/API — bentuk data
// (tipe Product) dibuat supaya gampang disambungkan ke situ.

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  tokopediaUrl: string;
  shopeeUrl: string;
  featured?: boolean;
};

export const products: Product[] = [
  {
    id: "p1",
    name: "Nama Produk 1",
    description:
      "Deskripsi singkat produk. Jelaskan bahan, ukuran, atau keunggulan utamanya di sini.",
    price: 150000,
    category: "Kategori A",
    image:
      "https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=800&auto=format&fit=crop",
    tokopediaUrl: "https://www.tokopedia.com/",
    shopeeUrl: "https://shopee.co.id/",
    featured: true,
  },
  {
    id: "p2",
    name: "Nama Produk 2",
    description:
      "Deskripsi singkat produk kedua. Cocok untuk sehari-hari, tersedia beberapa varian.",
    price: 89000,
    category: "Kategori B",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
    tokopediaUrl: "https://www.tokopedia.com/",
    shopeeUrl: "https://shopee.co.id/",
  },
  {
    id: "p3",
    name: "Nama Produk 3",
    description: "Produk unggulan dengan kualitas premium dan bahan pilihan.",
    price: 320000,
    category: "Kategori A",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    tokopediaUrl: "https://www.tokopedia.com/",
    shopeeUrl: "https://shopee.co.id/",
    featured: true,
  },
];

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value || 0);
}

export function getCategories(items: Product[]): string[] {
  const set = new Set(items.map((p) => p.category).filter(Boolean));
  return ["Semua", ...Array.from(set)];
}
