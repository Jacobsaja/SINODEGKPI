"use client";

import { useState } from "react";
import Image from "next/image";
import { Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: string[];
  title: string;
};

/**
 * Galeri gambar untuk halaman detail publikasi.
 * - 1 gambar: tampil sebagai gambar utama saja, bisa di-zoom.
 * - >1 gambar: tambahan strip thumbnail + navigasi prev/next di lightbox.
 */
export default function GalleryLightbox({ images, title }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const hasMultiple = images.length > 1;

  const goNext = () => setActiveIndex((i) => (i + 1) % images.length);
  const goPrev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <>
      <div
        onClick={() => setIsZoomed(true)}
        className="group/image relative aspect-[16/9] w-full cursor-zoom-in overflow-hidden rounded-2xl border border-border/40 bg-surface shadow-sm"
      >
        <Image
          src={images[activeIndex]}
          alt={`${title} - gambar ${activeIndex + 1}`}
          fill
          sizes="(min-width: 768px) 700px, 100vw"
          className="object-contain transition-transform duration-700 group-hover/image:scale-105"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center bg-background/0 opacity-0 transition-opacity duration-300 group-hover/image:bg-background/10 group-hover/image:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-text-primary shadow-sm backdrop-blur">
            <Maximize2 size={18} />
          </div>
        </div>
      </div>

      {/* Thumbnail strip - hanya tampil kalau gambar lebih dari 1 */}
      {hasMultiple && (
        <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative h-16 w-24 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 transition-all ${
                activeIndex === i
                  ? "border-primary"
                  : "border-border/50 opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={img} alt={`Thumbnail ${i + 1}`} fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Fullscreen */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-[1400] flex items-center justify-center p-4 animate-fade-in md:p-8"
          onClick={() => setIsZoomed(false)}
        >
          <div className="absolute inset-0 bg-background/95 backdrop-blur-lg" />

          <button
            onClick={() => setIsZoomed(false)}
            className="absolute right-5 top-5 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-border bg-surface text-text-primary transition-all duration-300 hover:border-red-500/40 hover:text-red-500"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>

          {hasMultiple && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className="absolute left-5 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-xl border border-border bg-surface text-text-primary transition-all hover:text-primary"
                aria-label="Gambar sebelumnya"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className="absolute right-5 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-xl border border-border bg-surface text-text-primary transition-all hover:text-primary"
                aria-label="Gambar berikutnya"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          <div className="relative h-full w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[activeIndex]}
              alt={`${title} - gambar ${activeIndex + 1}`}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
