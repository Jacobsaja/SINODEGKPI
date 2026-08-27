import Image from "next/image";
import { formatRupiah, type Product } from "@/lib/products";
import { Sparkles, ShoppingBag } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
      {/* Background glow on hover */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-transparent via-transparent to-primary/[0.03] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {product.is_featured && (
        <span className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md shadow-amber-500/20 backdrop-blur-sm">
          <Sparkles size={12} />
          Unggulan
        </span>
      )}

      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
        <Image
          src={product.image || "/hero-bg.webp"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          {product.category || "Umum"}
        </span>

        <h3 className="text-lg font-bold leading-snug text-text-primary group-hover:text-primary transition-colors duration-200">
          {product.name}
        </h3>

        <p className="line-clamp-2 text-sm text-text-secondary">
          {product.description}
        </p>

        <div className="mt-auto pt-3">
          <p className="mb-4 text-xl font-extrabold text-primary">
            {formatRupiah(product.price)}
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={product.tokopedia_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2.5 text-xs font-bold text-emerald-600 transition-all hover:bg-emerald-500 hover:text-white hover:shadow-md hover:shadow-emerald-500/20 active:scale-95"
            >
              Tokopedia
            </a>
            <a
              href={product.shopee_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-xl border border-orange-500/30 bg-orange-500/10 px-3 py-2.5 text-xs font-bold text-orange-600 transition-all hover:bg-orange-500 hover:text-white hover:shadow-md hover:shadow-orange-500/20 active:scale-95"
            >
              Shopee
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
