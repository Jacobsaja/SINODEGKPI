"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { assets } from "@/lib/assets";

const slides = [
  {
    id: 1,
    type: "identity",
    title: "Gereja Kristen Protestan Indonesia",
    subtitle: "Melayani dengan Hati, Bertumbuh dalam Iman",
    image: assets.slide1,
  },
  {
    id: 2,
    type: "verse",
    verse: "Beribadahlah kepada TUHAN dengan sukacita, datanglah ke hadapan-Nya dengan sorak-sorai!",
    reference: "Mazmur 100:2",
    cta: "Lihat Gereja Terdekat",
    href: "wilayah-resort",
    image: assets.slide2,
  },
  {
    id: 3,
    type: "verse",
    verse: "Firman-Mu itu pelita bagi kakiku dan terang bagi jalanku.",
    reference: "Mazmur 119:105",
    cta: "Baca Renungan",
    href: "publikasi",
    image: assets.slide3,
  },
  {
    id: 4,
    type: "verse",
    verse: "Dan marilah kita saling memperhatikan supaya kita saling mendorong dalam kasih dan dalam pekerjaan baik.",
    reference: "Ibrani 10:24",
    cta: "Hubungi Kami",
    href: "kontak",
    image: assets.slide4,
  },
  {
    id: 5,
    type: "verse",
    verse: "Segala tulisan yang diilhamkan Allah memang bermanfaat untuk mengajar, untuk menyatakan kesalahan, untuk memperbaiki kelakuan...",
    reference: "2 Timotius 3:16",
    cta: "Lihat Publikasi",
    href: "publikasi",
    image: assets.slide3,
  },
  {
    id: 6,
    type: "verse",
    verse: "Aku bersukacita, ketika orang berkata kepadaku: Mari kita pergi ke rumah TUHAN",
    reference: "Mazmur 122:1",
    cta: "Lihat Informasi Gereja",
    href: "info",
    image: assets.slide2,
  },
  {
    id: 7,
    type: "verse",
    verse: "Berdua lebih baik dari pada seorang diri, karena mereka menerima upah yang baik dalam jerih payah mereka.",
    reference: "Pengkhotbah 4:9",
    cta: "Lihat Mitra Gereja",
    href: "mitra",
    image: assets.slide3,
  },
  {
    id: 8,
    type: "verse",
    verse: "Sebagaimana tubuh itu satu dan anggota-anggotanya banyak, namun merupakan satu kesatuan, demikian pula Kristus (seluruh umat percaya).",
    reference: "1 Korintus 12:12",
    cta: "Lihat Struktur Gereja",
    href: "pengurus",
    image: assets.slide4,
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden bg-background">
      {/* ── Slides ── */}
      <div className="absolute inset-0 flex items-center justify-center">
        {slides.map((slide, index) => {
          const isActive = index === current;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
            >
              {/* Background Image with slight scale animation when active */}
              <div className="absolute inset-0 w-full h-full">
                <div
                    className={`relative w-full h-full transition-transform duration-[12000ms] ease-out ${isActive ? "scale-105" : "scale-100"
                      }`}
                  >
                    <Image
                      src={slide.image || assets.heroBg}
                      alt="GKPI Background"
                      fill
                      sizes="100vw"
                      className="object-cover opacity-80"
                      priority={index === 0}
                      onError={(e) => {
                        (e.target as HTMLImageElement).srcset = assets.heroBg;
                      }}
                    />
                  </div>

                {/* Soft dark blue overlay for contrast and spiritual calmness */}
                <div className="absolute inset-0 bg-primary-dark/60 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/30 via-transparent to-primary-dark/50" />
              </div>

              {/* Content Container */}
              <div className={`relative max-w-4xl mx-auto flex flex-col items-center px-6 text-center transition-all duration-1000 delay-300 transform ${isActive ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
              >
                {slide.type === "identity" ? (
                  <>
                    <div className="relative w-24 h-24 md:w-32 md:h-32 mb-8 opacity-90">
                      <Image
                        src={assets.logo}
                        alt="Logo GKPI"
                        fill
                        sizes="(max-width: 768px) 96px, 128px"
                        className="object-contain drop-shadow-sm"
                        priority
                      />
                    </div>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-sans font-black text-white tracking-wide mb-6 drop-shadow-sm">
                      {slide.title}
                    </h1>
                    <p className="text-sm md:text-lg text-white/90 font-black tracking-[0.2em] uppercase [text-shadow:0_2px_10px_rgba(0,0,0,0.9)]">
                      {slide.subtitle}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-2xl md:text-4xl lg:text-5xl font-serif italic text-white leading-relaxed mb-8 drop-shadow-sm">
                      &quot;{slide.verse}&quot;
                    </p>
                    <p className="text-sm md:text-base text-white/90 font-black tracking-[0.15em] uppercase mb-12 [text-shadow:0_2px_10px_rgba(0,0,0,0.9)]">
                     — {slide.reference}
                    </p>
                    <Link
                      href={slide.href!}
                      className="px-10 py-4 bg-transparent border border-white/30 text-white text-sm uppercase tracking-widest hover:bg-white hover:text-primary-dark transition-all duration-500 rounded-md"
                    >
                      {slide.cta}
                    </Link>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Minimal Indicators ── */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-4 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className="group relative flex items-center justify-center p-2"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div
              className={`h-0.5 transition-all duration-500 ${current === index
                ? "w-8 bg-white"
                : "w-4 bg-white/20 group-hover:bg-white/50"
                }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
