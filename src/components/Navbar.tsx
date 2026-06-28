"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { assets } from "@/lib/assets";

const navLinks = [
  { name: "Beranda", href: "/" },
  { name: "Tentang", href: "/tentang-gkpi" },
  { name: "Pengurus", href: "/pengurus" },
  { name: "Resort dan Wilayah", href: "/wilayah-resort" },
  { name: "Info", href: "/info" },
  { name: "Publikasi", href: "/publikasi" },
  { name: "Mitra", href: "/mitra" },
  { name: "Kontak", href: "/kontak" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <nav
        role="navigation"
        aria-label="Navigasi utama"
        className={`fixed top-0 w-full z-[1000] transition-all duration-300 ${isScrolled
          ? "bg-surface/80 backdrop-blur-md border-b border-border shadow-lg py-3"
          : "bg-transparent py-5"
          }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex justify-between items-center">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative w-9 h-9 transition-transform duration-200 group-hover:scale-105">
              <Image
                src={assets.logo}
                alt="Logo GKPI"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-sans font-bold tracking-tight text-white">
              GKPI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group ${isActive
                    ? "text-white"
                    : "text-text-secondary hover:text-white hover:bg-white/5"
                    }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-accent rounded-full" />
                  )}
                </Link>
              );
            })}

            <div className="ml-4">
              <Link
                href="/login"
                className="px-6 py-2.5 rounded-full text-sm font-semibold bg-primary text-white hover:bg-primary-dark shadow-md transition-all duration-200"
              >
                Masuk
              </Link>
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden p-2.5 rounded-xl text-white hover:bg-white/10 transition-colors duration-200"
            onClick={() => setIsOpen(true)}
            aria-label="Buka menu"
            aria-expanded={isOpen}
          >
            <Menu size={24} strokeWidth={2} />
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 z-[1100] lg:hidden transition-all duration-300 ${isOpen ? "visible" : "invisible"
          }`}
        aria-hidden={!isOpen}
      >
        <div
          className={`absolute inset-0 bg-background/95 backdrop-blur-lg transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => setIsOpen(false)}
        />

        <div
          className={`absolute inset-0 flex flex-col transition-all duration-300 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            }`}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <Link
              href="/"
              className="flex items-center gap-2.5"
              onClick={() => setIsOpen(false)}
            >
              <div className="relative w-9 h-9">
                <Image
                  src={assets.logo}
                  alt="Logo GKPI"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-sans font-bold text-white">GKPI</span>
            </Link>
            <button
              className="p-2.5 rounded-xl text-text-secondary hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
              aria-label="Tutup menu"
            >
              <X size={24} strokeWidth={2} />
            </button>
          </div>

          <nav className="flex-1 flex flex-col justify-center px-8 gap-1">
            {navLinks.map((link, i) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`py-4 text-xl font-sans border-b border-border/30 transition-colors duration-200 ${isActive ? "text-accent font-bold" : "text-text-secondary hover:text-white"
                    }`}
                  style={{ transitionDelay: isOpen ? `${i * 30}ms` : "0ms" }}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="px-8 pb-12">
            <Link
              href="/login"
              className="block w-full text-center py-4 bg-primary text-white font-bold rounded-2xl text-lg hover:bg-primary-dark transition-all shadow-lg"
              onClick={() => setIsOpen(false)}
            >
              Masuk
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
