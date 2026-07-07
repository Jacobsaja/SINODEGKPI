"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import ScrollReveal from "@/components/ScrollReveal";
import PengurusModal from "@/components/PengurusModal";
import { User } from "lucide-react";
import { assets } from "@/lib/assets";
import type { PengurusAnggota, PengurusGrup, PengurusSeksi } from "@/lib/pengurus";

// ─── ProfileCard ─────────────────────────────────────────────────────────────

function ProfileCard({
  anggota,
  onClick,
}: {
  anggota: PengurusAnggota;
  onClick: () => void;
}) {
  const isLeader = anggota.variant === "leader";
  const isCompact = anggota.variant === "compact";

  const sizeClass = isLeader
    ? "max-w-[280px] md:max-w-[320px]"
    : isCompact
    ? "max-w-[140px]"
    : "max-w-[200px]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center text-center group transition-all duration-300 hover:scale-105 cursor-pointer bg-transparent border-0 p-0 ${
        isCompact ? "opacity-85 hover:opacity-100" : ""
      }`}
    >
      <div
        className={`relative w-full aspect-square bg-surface/50 border border-border rounded-3xl overflow-hidden shadow-lg transition-colors duration-300 group-hover:border-accent/40 flex items-center justify-center ${sizeClass}`}
      >
        {anggota.photo_url ? (
          <Image
            src={anggota.photo_url}
            alt={anggota.name}
            fill
            sizes="(max-width: 768px) 40vw, 320px"
            className="object-cover"
          />
        ) : (
          <User
            size={isLeader ? 80 : isCompact ? 32 : 48}
            className="text-text-secondary/20"
            strokeWidth={1.5}
          />
        )}
      </div>

      <div className={`mt-5 space-y-1 ${sizeClass}`}>
        {anggota.role && (
          <p
            className={`font-bold text-accent uppercase tracking-wider ${
              isLeader ? "text-sm" : "text-[10px]"
            }`}
          >
            {anggota.role}
          </p>
        )}
        <h3
          className={`font-bold text-white leading-tight ${
            isLeader ? "text-2xl md:text-3xl" : isCompact ? "text-sm" : "text-lg"
          }`}
        >
          {anggota.name}
        </h3>
        {anggota.description && (
          <p className="text-xs text-text-secondary mt-2 leading-relaxed">{anggota.description}</p>
        )}
      </div>
    </button>
  );
}

// ─── Small layout helpers ────────────────────────────────────────────────────

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="text-center mb-16 md:mb-20">
      <h2 className="text-3xl md:text-4xl font-sans font-bold text-white">{title}</h2>
      <div className="w-16 h-1 mx-auto mt-6 rounded-full bg-primary/40" />
    </div>
  );
}

function SectionWrapper({
  id,
  alt,
  isLast,
  children,
}: {
  id: string;
  alt: boolean;
  isLast: boolean;
  children: React.ReactNode;
}) {
  if (!alt) {
    return (
      <Section id={id} className="!py-16 md:!py-24">
        {children}
      </Section>
    );
  }
  return (
    <section
      id={id}
      className={`py-16 md:py-24 bg-surface/30 ${isLast ? "border-t" : "border-y"} border-border/50`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">{children}</div>
    </section>
  );
}

function GroupCard({
  grup,
  onSelect,
}: {
  grup: PengurusGrup;
  onSelect: (a: PengurusAnggota) => void;
}) {
  const top = grup.anggota.filter((a) => a.variant !== "compact");
  const compact = grup.anggota.filter((a) => a.variant === "compact");

  return (
    <div className="bg-background/50 border border-border/60 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
      {grup.name && (
        <h3 className="text-2xl font-bold text-center text-white mb-12">{grup.name}</h3>
      )}

      {top.length > 0 && (
        <div
          className={`flex flex-wrap justify-center gap-8 sm:gap-16 ${
            compact.length > 0 ? "mb-12" : ""
          }`}
        >
          {top.map((a) => (
            <ProfileCard key={a.id} anggota={a} onClick={() => onSelect(a)} />
          ))}
        </div>
      )}

      {compact.length > 0 && (
        <div className={top.length > 0 ? "pt-10 border-t border-border/50" : ""}>
          <p className="text-center text-xs font-bold uppercase tracking-widest text-text-secondary mb-8">
            Anggota
          </p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
            {compact.map((a) => (
              <ProfileCard key={a.id} anggota={a} onClick={() => onSelect(a)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PengurusClient({ seksiList }: { seksiList: PengurusSeksi[] }) {
  const tabs = seksiList.map((s) => ({ id: s.slug, label: s.tab_label }));
  const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "");
  const navRef = useRef<HTMLUListElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [selectedPerson, setSelectedPerson] = useState<PengurusAnggota | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const tab of [...tabs].reverse()) {
        const element = document.getElementById(tab.id);
        if (element) {
          const elementTop = element.getBoundingClientRect().top + window.scrollY;
          if (elementTop <= scrollPosition) {
            setActiveTab(tab.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seksiList.length]);

  useEffect(() => {
    const updateIndicator = () => {
      const activeButton = buttonRefs.current[activeTab];
      const nav = navRef.current;
      if (!activeButton || !nav) return;
      setIndicatorStyle({ left: activeButton.offsetLeft, width: activeButton.offsetWidth });
    };
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeTab]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <main className="bg-background min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="relative pt-32 pb-12 md:pt-40 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image src={assets.heroBg} alt="GKPI Background" fill className="object-cover opacity-10" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-5 text-center space-y-4">
          <ScrollReveal>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">Struktur Organisasi</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-bold text-white tracking-tight mt-3">
              Kepengurusan GKPI
            </h1>
            <p className="text-base md:text-lg text-text-secondary mt-5 max-w-2xl mx-auto leading-relaxed">
              Daftar susunan pimpinan, majelis, komisi, dan badan pengurus yang melayani di Gereja Kristen Protestan Indonesia.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Sticky Section Navigation */}
      {tabs.length > 0 && (
        <div className="sticky top-[60px] z-40 bg-background/90 backdrop-blur-md border-y border-border/50 shadow-lg py-1">
          <div className="max-w-7xl mx-auto px-2 sm:px-8 overflow-x-auto no-scrollbar">
            <ul ref={navRef} className="relative flex items-center w-max mx-auto sm:w-full sm:justify-center px-4">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <li key={tab.id}>
                    <button
                      ref={(element) => {
                        buttonRefs.current[tab.id] = element;
                      }}
                      onClick={() => scrollToSection(tab.id)}
                      className={`relative px-5 py-4 text-sm font-bold whitespace-nowrap transition-colors duration-300 ${
                        isActive ? "text-accent" : "text-text-secondary hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  </li>
                );
              })}
              <span
                className="absolute bottom-0 h-0.5 rounded-t-full bg-accent transition-all duration-500 ease-out"
                style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
              />
            </ul>
          </div>
        </div>
      )}

      <div className="pb-24">
        {seksiList.length === 0 && (
          <p className="text-center text-text-secondary py-24">Belum ada data pengurus.</p>
        )}

        {seksiList.map((seksi, idx) => {
          const alt = idx % 2 === 1 || idx === seksiList.length - 1;
          const isLast = idx === seksiList.length - 1;

          // ── leaders_grid: (Pimpinan Sinode) ──
          if (seksi.layout_type === "leaders_grid") {
            const leaders = seksi.members.filter((m) => m.variant === "leader");
            const others = seksi.members.filter((m) => m.variant !== "leader");
            return (
              <SectionWrapper key={seksi.id} id={seksi.slug} alt={alt} isLast={isLast}>
                <SectionHeading title={seksi.title} />
                <ScrollReveal>
                  <div className="flex flex-col md:flex-row justify-center gap-12 md:gap-20 mb-20 md:mb-28">
                    {leaders.map((l) => (
                      <ProfileCard key={l.id} anggota={l} onClick={() => setSelectedPerson(l)} />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12 max-w-5xl mx-auto">
                    {others.map((d) => (
                      <ProfileCard key={d.id} anggota={d} onClick={() => setSelectedPerson(d)} />
                    ))}
                  </div>
                </ScrollReveal>
              </SectionWrapper>
            );
          }

          // ── komisi_groups & single_group: (Majelis Sinode, BPRP, PHBK, dst) ──
          if (seksi.layout_type === "komisi_groups" || seksi.layout_type === "single_group") {
            return (
              <SectionWrapper key={seksi.id} id={seksi.slug} alt={alt} isLast={isLast}>
                <SectionHeading title={seksi.title} />
                <div className="space-y-20 md:space-y-28">
                  {seksi.groups.map((grup) => (
                    <ScrollReveal key={grup.id}>
                      <GroupCard grup={grup} onSelect={setSelectedPerson} />
                    </ScrollReveal>
                  ))}
                </div>
              </SectionWrapper>
            );
          }

          // ── flat_grid: (Koordinator Wilayah, dst) ──
          return (
            <SectionWrapper key={seksi.id} id={seksi.slug} alt={alt} isLast={isLast}>
              <SectionHeading title={seksi.title} />
              <ScrollReveal>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                  {seksi.members.map((m) => (
                    <ProfileCard key={m.id} anggota={m} onClick={() => setSelectedPerson(m)} />
                  ))}
                </div>
              </ScrollReveal>
            </SectionWrapper>
          );
        })}
      </div>

      <Footer />

      <PengurusModal person={selectedPerson} onClose={() => setSelectedPerson(null)} />
    </main>
  );
}
