"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "Persiapan Perayaan Pentakosta 2026",
    excerpt:
      "Rangkaian kegiatan jemaat menyambut Pentakosta akan dimulai pada minggu pertama bulan Mei.",
    image: "/hero_slide_1.png",
  },
  {
    title: "Pelatihan Kepemimpinan Pemuda GKPI",
    excerpt:
      "Pendaftaran pelatihan wilayah untuk pemuda GKPI kini dibuka secara daring.",
    image: "/hero_slide_2.png",
  },
  {
    title: "Update Renovasi Kantor Sinode",
    excerpt:
      "Renovasi tahap kedua kantor Sinode terus berjalan dengan fokus pada ruang pelayanan.",
    image: "/hero_slide_3.png",
  },
  {
    title: "Panduan Ibadah Keluarga",
    excerpt:
      "Materi ibadah keluarga triwulan ini tersedia untuk mendukung persekutuan di rumah.",
    image: "/hero_slide_4.png",
  },
];

export default function InfoCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % slides.length);
  };

  return (
    <div className="relative left-1/2 w-[min(96vw,1720px)] -translate-x-1/2 overflow-hidden rounded-[2rem] border border-border/80 bg-surface/70 shadow-2xl shadow-black/25">
      <div className="relative min-h-[720px] sm:min-h-[760px] md:min-h-[min(88vh,920px)]">
        {slides.map((slide, index) => (
          <article
            key={slide.title}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              index === activeIndex
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            }`}
            aria-hidden={index !== activeIndex}
          >
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                sizes="100vw"
                className="object-cover"
                priority={index === 0}
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/45 to-background/10 md:bg-gradient-to-r md:from-background/95 md:via-background/55 md:to-background/10" />

            <div className="relative z-10 flex h-full max-w-4xl flex-col justify-end px-6 pb-24 pt-16 sm:px-10 md:px-16 lg:px-20 xl:px-24">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-accent sm:text-sm">
                Info GKPI
              </p>
              <h3 className="text-3xl font-bold leading-tight text-white drop-shadow-lg sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                {slide.title}
              </h3>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-200 drop-shadow sm:text-base md:text-lg">
                {slide.excerpt}
              </p>
              <Link
                href="#"
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-lg shadow-black/30 transition-colors duration-200 hover:bg-primary-dark sm:px-7 sm:py-3.5"
              >
                Baca Selengkapnya
                <ChevronRight size={17} />
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "w-8 bg-accent"
                : "w-2.5 bg-text-secondary/35 hover:bg-text-secondary/60"
            }`}
            aria-label={`Tampilkan info ${index + 1}`}
            aria-current={index === activeIndex}
          />
        ))}
      </div>

      <div className="absolute right-6 top-6 z-20 hidden gap-2 sm:flex">
        <button
          type="button"
          onClick={goToPrevious}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/70 text-text-primary backdrop-blur transition-colors hover:border-accent/60 hover:text-accent"
          aria-label="Info sebelumnya"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={goToNext}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/70 text-text-primary backdrop-blur transition-colors hover:border-accent/60 hover:text-accent"
          aria-label="Info berikutnya"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
