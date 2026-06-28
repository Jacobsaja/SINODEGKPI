"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ChevronLeft, ChevronRight, FileText } from "lucide-react";

// Dummy data for slideshow
const slides = [
  {
    id: 1,
    title: "Profil dan Identitas GKPI",
    description: "Kenali sejarah, visi misi, Panca Pelayanan, dan dokumen dasar yang membentuk arah pelayanan GKPI.",
    image: "/hero_slide_3.png",
    meta: "Dokumen Profil",
    date: "Diperbarui 2026",
    href: "/info",
  },
  {
    id: 2,
    title: "Visi Pelayanan 2015-2030",
    description: "Arah pelayanan GKPI menuju persekutuan penyembahan dan persembahan yang bertumbuh dalam iman.",
    image: "/hero_slide_1.png",
    meta: "Visi & Misi",
    date: "Renstra GKPI",
    href: "/info#visi-misi",
  },
  {
    id: 3,
    title: "Tata Gereja dan Pengakuan Iman",
    description: "Akses rangkuman dokumen resmi yang menjadi dasar iman, tata kelola, dan kehidupan pelayanan GKPI.",
    image: "/resort-hero-bg.png",
    meta: "Tata Gereja",
    date: "Referensi Resmi",
    href: "/info#dokumen",
  },
];

export default function InfoSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-background/40 shadow-[0_28px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/20" />
      <div className="relative min-h-[520px] md:min-h-[460px]">
        {/* All slides rendered but visually toggled via opacity */}
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          
          return (
            <div 
              key={slide.id}
              className={`absolute inset-0 grid transition-opacity duration-700 ease-in-out md:grid-cols-[1.08fr_0.92fr] ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <div className="relative min-h-[240px] md:min-h-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  sizes="(min-width: 768px) 55vw, 100vw"
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-primary/55 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-transparent md:bg-gradient-to-r md:from-transparent md:via-background/5 md:to-background/90" />
                <div className="absolute bottom-5 left-5 rounded-2xl border border-white/15 bg-background/45 px-4 py-3 text-white shadow-lg backdrop-blur-md">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
                    Info GKPI
                  </p>
                  <p className="mt-1 text-sm font-semibold">{slide.meta}</p>
                </div>
              </div>

              <div className="flex flex-col justify-center p-7 sm:p-9 md:p-12 lg:p-14">
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-text-secondary">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/10 px-3 py-1 text-accent">
                      <FileText size={13} />
                      {slide.meta}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={13} />
                      {slide.date}
                    </span>
                  </div>

                  <h3 className="font-serif text-3xl font-bold leading-tight text-white md:text-4xl">
                    {slide.title}
                  </h3>
                  <p className="max-w-xl text-base leading-8 text-text-secondary md:text-lg">
                    {slide.description}
                  </p>

                  <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                    <Link
                      href={slide.href}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-dark"
                    >
                      Buka Info
                      <ChevronRight size={16} />
                    </Link>
                    <Link
                      href="/info"
                      className="inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-surface/50 px-7 text-sm font-bold text-text-primary transition-all duration-300 hover:border-accent/40 hover:bg-surface"
                    >
                      Lihat Semua
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigation Controls (Arrows) */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-background/35 text-white backdrop-blur transition-all hover:bg-background/80 md:flex"
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-background/35 text-white backdrop-blur transition-all hover:bg-background/80 md:flex"
          aria-label="Next slide"
        >
          <ChevronRight size={20} />
        </button>

        {/* Navigation Controls (Dots) */}
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex 
                  ? "w-8 h-2 bg-accent"
                  : "w-2 h-2 bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
