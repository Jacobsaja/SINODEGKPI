import Image from "next/image";
import { formatRupiah, type Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:border-primary/60 hover:shadow-[0_0_0_1px_rgba(111,168,220,0.15),0_20px_40px_-20px_rgba(15,30,46,0.8)]">
      {product.is_featured && (
        <span className="absolute left-3 top-3 z-10 rounded-md bg-primary/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary-dark">
          Unggulan
        </span>
      )}

      <div className="relative aspect-[4/3] w-full overflow-hidden bg-primary-dark/40">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-primary">
          {product.category}
        </span>

        <h3 className="font-serif text-lg font-bold leading-snug text-text-primary">
          {product.name}
        </h3>

        <p className="line-clamp-2 text-sm text-text-secondary">
          {product.description}
        </p>

        <div className="mt-auto pt-2">
          <p className="mb-3 text-xl font-bold text-text-primary">
            {formatRupiah(product.price)}
          </p>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={product.tokopedia_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-lg border border-[#03AC0E]/40 bg-[#03AC0E]/10 px-3 py-2 text-sm font-semibold text-[#4ADE80] transition-colors hover:bg-[#03AC0E]/20"
            >
              Tokopedia
            </a>
            <a
              href={product.shopee_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-lg border border-[#EE4D2D]/40 bg-[#EE4D2D]/10 px-3 py-2 text-sm font-semibold text-[#FB923C] transition-colors hover:bg-[#EE4D2D]/20"
            >
              Shopee
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
