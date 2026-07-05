import { supabase } from "@/lib/supabase";
import type { Product } from "@/lib/types";

/**
 * Semua produk untuk halaman /toko (client component, filter & search
 * dilakukan di sisi client setelah data ini dimuat) dan untuk dashboard admin.
 */
export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal mengambil semua produk:", error.message);
    return [];
  }
  return data ?? [];
}

/** Produk unggulan untuk highlight di halaman /toko. */
export async function getFeaturedProduct(): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Gagal mengambil produk unggulan:", error.message);
    return null;
  }
  return data;
}

/** Format angka menjadi format Rupiah Indonesia (185000 -> "Rp185.000"). */
export function formatRupiah(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value || 0);
}
