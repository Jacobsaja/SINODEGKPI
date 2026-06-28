"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import ScrollReveal from "@/components/ScrollReveal";
import Image from "next/image";
import Link from "next/link";
import { assets } from "@/lib/assets";
import { ArrowRight, Globe, HandHeart, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { mitraDetails } from "@/data/mitraDetails";

// ─── Data ────────────────────────────────────────────────────────────────────

const mitraInternasional = [
  {
    name: "LNM – Norwegia",
    logo: "/mitra/lnm-norwegian.png",
    region: "Norwegia",
    description:
      "Lembaga misi Norwegia yang menjadi salah satu mitra pelayanan terkemuka GKPI dalam bidang penginjilan dan pengembangan jemaat.",
    url: "https://gkpisinode.org/mitra/lnm-norwegia/",
  },
  {
    name: "Presbyterian Church of Korea (PCK) Klasis Seoul Seobuk",
    logo: "/mitra/presbyterian-church-korea.png",
    region: "Korea Selatan",
    description:
      "Gereja Presbiterian Korea, Klasis Seoul Seobuk, yang menjalin persekutuan dan kerjasama pelayanan lintas budaya bersama GKPI.",
    url: "https://gkpisinode.org/mitra/presbyterian-church-of-korea-pck-klasis-seoul-seobuk/",
  },
  {
    name: "HBM – Jerman",
    logo: "/mitra/Logo_GKPI.png",
    region: "Jerman",
    description:
      "Mitra GKPI dengan Hildesheimer Blindenmission (HBM) Jerman dalam bidang Pendidikan Tuna Netra. Kunjungi: www.h-bm.de",
    url: "https://gkpisinode.org/mitra/hbm-jerman/",
  },
  {
    name: "Gereja Wilayah Kleve – German",
    logo: "/mitra/gereja-wilayah-kleve.png",
    region: "Jerman",
    description:
      "Gereja Wilayah Kleve di Jerman, salah satu mitra luar negeri GKPI yang menjalin hubungan persaudaraan gerejawi.",
    url: "https://gkpisinode.org/mitra/gereja-wilayah-kleve-german/",
  },
  {
    name: "The Lutheran Church (LCA) – Australia",
    logo: "/mitra/lutheran-church-australia.png",
    region: "Australia",
    description:
      "The Lutheran Church of Australia menyatukan umat Lutheran di Australia dan Selandia Baru, mengikut Yesus Kristus — di mana kasih menjadi nyata.",
    url: "https://gkpisinode.org/mitra/the-lutheran-church-lca-australia/",
  },
  {
    name: "The Evangelical Lutheran Church in America (ELCA)",
    logo: "/mitra/elca.png",
    region: "Amerika Serikat",
    description:
      "Salah satu denominasi Kristen terbesar di Amerika Serikat dengan hampir 3,3 juta anggota di lebih dari 8.900 komunitas ibadah.",
    url: "https://gkpisinode.org/mitra/the-evangelical-lutheran-church-in-america-elca/",
  },
  {
    name: "Jemaat Bonn-Beuel – Jerman",
    logo: "/mitra/evangelish.png",
    region: "Jerman",
    description:
      "Gereja di kota Bonn-Beuel, Jerman, yang menjalin persekutuan sebagai salah satu mitra luar negeri GKPI.",
    url: "https://gkpisinode.org/mitra/jemaat-bonn-beuel-jerman/",
  },
  {
    name: "The Christian Conference of Asia (CCA) – Hongkong",
    logo: "/mitra/christian-conference-asia.png",
    region: "Hongkong",
    description:
      "CCA dimulai sebagai East Asia Christian Conference (EACC) yang dibentuk dalam pertemuan di Prapat, Indonesia, tahun 1957 dan diresmikan di Kuala Lumpur, 1959.",
    url: "https://gkpisinode.org/mitra/the-christian-conference-of-asia-cca-hongkong/",
  },
  {
    name: "LWF – Lutheran World Federation",
    logo: "/mitra/lutheran-world-federation.png",
    region: "Swiss (Global)",
    description:
      "Persekutuan global gereja-gereja Lutheran yang berkomitmen membarui iman dan mewujudkan kasih dalam tindakan nyata di seluruh dunia.",
    url: "https://gkpisinode.org/mitra/lwf-lutheran-word-federation/",
  },
  {
    name: "World Council of Churches (WCC)",
    logo: "/mitra/world-council-churches.png",
    region: "Swiss (Global)",
    description:
      "Persekutuan gereja-gereja yang mengaku Tuhan Yesus Kristus sebagai Allah dan Juruselamat, bersama memuliakan Allah Bapa, Putra, dan Roh Kudus.",
    url: "https://gkpisinode.org/mitra/world-council-of-churches-wcc/",
  },
  {
    name: "UEM – United Evangelical Mission",
    logo: "/mitra/uem.png",
    region: "Jerman (Global)",
    description:
      "Misi Injili Bersatu yang bekerja di dunia yang terpecah, mendorong semua anggota Tubuh Kristus untuk bertumbuh bersama.",
    url: "https://gkpisinode.org/mitra/uem/",
  },
  {
    name: "Komite Nasional LWF (KN-LWF)",
    logo: "/mitra/komite-nasional-lwf.png",
    region: "Indonesia (Internasional)",
    description:
      "Wadah koordinasi gereja-gereja Lutheran di Indonesia dalam kerangka Lutheran World Federation, mewakili ~140 gereja anggota di 78 negara.",
    url: "https://gkpisinode.org/mitra/komite-nasional-lutheran-word-federation-kn-lwf/",
  },
];

const mitraNasional = [
  {
    name: "Persekutuan Gereja Indonesia (PGI)",
    logo: "/mitra/persekutuan-gereja-indonesia.png",
    region: "Jakarta, Indonesia",
    description:
      "Lembaga ekumenis nasional yang mewadahi gereja-gereja di Indonesia, didirikan sejak Konferensi Persiapan Dewan Gereja-Gereja Indonesia, November 1949.",
    url: "https://gkpisinode.org/mitra/persekutuan-gereja-indonesia-pgi/",
  },
  {
    name: "PGI Wilayah Sumatera Utara",
    logo: "/mitra/persekutuan-gereja-indonesia.png",
    region: "Sumatera Utara",
    description:
      "Persekutuan Gereja Indonesia wilayah Sumatera Utara yang berperan sebagai wadah kerjasama gereja-gereja di tingkat daerah.",
    url: "https://gkpisinode.org/mitra/pgi-wilayah-sumatera-utara/",
  },
  {
    name: "STT Abdi Sabda Medan",
    logo: "/mitra/abdi-sabda.png",
    region: "Medan, Sumatera Utara",
    description:
      "Sekolah Tinggi Teologi yang berdiri sejak 1967, mendidik calon pelayan Gereja — Guru Injil dan Guru Agama Kristen — bagi gereja dan sekolah.",
    url: "https://gkpisinode.org/mitra/stt-abdi-sabda-medan/",
  },
  {
    name: "YASUMA – Yayasan Sumber Sejahtera",
    logo: "/mitra/yasuma.png",
    region: "Indonesia",
    description:
      "Pelayanan Kristen sejak 1996 yang menempatkan Alkitab ke tangan yang membutuhkan — gereja, lembaga, sekolah, universitas, penjara, dan panti asuhan.",
    url: "https://gkpisinode.org/mitra/yasuma-yayasan-sumber-sumatera/",
  },
  {
    name: "Pusat Pelatihan Misi Terpadu (PPMT) – GKY Jakarta",
    logo: "/mitra/Logo_GKPI.png",
    region: "Jakarta, Indonesia",
    description:
      'Misi GKY terdiri dari lima unsur Missio Ecclesiae: Ibadah, Persekutuan, Kesaksian, Pelayanan, dan Pembaruan — dengan visi "Gereja yang Mulia dan Misioner".',
    url: "https://gkpisinode.org/mitra/pusat-pelatihan-misi-terpadu-ppmt-gky-jakarta/",
  },
  {
    name: "Evangelism Explosion (EE Indonesia)",
    logo: "/mitra/Logo_GKPI.png",
    region: "Indonesia",
    description:
      "Gerakan penginjilan yang dimulai tahun 1962 oleh Dr. D. James Kennedy, hadir di Indonesia untuk memperlengkapi jemaat dalam memberitakan Injil.",
    url: "https://gkpisinode.org/mitra/evangelism-explosion-ee-indonesia/",
  },
  {
    name: "Badan Penerbit Kristen (BPK)",
    logo: "/mitra/Logo_GKPI.png",
    region: "Jakarta, Indonesia",
    description:
      "Penerbit buku rohani Kristen, buku umum, dan humaniora dengan kantor pusat di Jakarta. Menerbitkan buku teologi akademis untuk menunjang pendidikan Teologi di Indonesia.",
    url: "https://gkpisinode.org/mitra/badan-penerbit-kristen-bpk/",
  },
  {
    name: "Lembaga Alkitab Indonesia (LAI)",
    logo: "/mitra/Logo_GKPI.png",
    region: "Jakarta, Indonesia",
    description:
      "Meneruskan warisan Lembaga Alkitab yang pertama kali berdiri di Batavia sejak 4 Juni 1814. LAI berkomitmen menyebarkan firman Tuhan ke seluruh pelosok Indonesia.",
    url: "https://gkpisinode.org/mitra/lembaga-alkitab-indonesia-lai/",
  },
];

// ─── Official Websites ────────────────────────────────────────────────────────

const officialWebsites: Record<string, string> = {
  "LNM – Norwegia": "https://www.normisjon.no/",
  "Presbyterian Church of Korea (PCK) Klasis Seoul Seobuk": "https://www.pck.or.kr/",
  "HBM – Jerman": "https://www.h-bm.de/",
  "Gereja Wilayah Kleve – German": "https://www.kleve.ekir.de/",
  "The Lutheran Church (LCA) – Australia": "https://www.lca.org.au/",
  "The Evangelical Lutheran Church in America (ELCA)": "https://www.elca.org/",
  "Jemaat Bonn-Beuel – Jerman": "https://www.evangelisch-beuel.de/",
  "The Christian Conference of Asia (CCA) – Hongkong": "https://www.cca.org.hk/",
  "LWF – Lutheran World Federation": "https://www.lutheranworld.org/",
  "World Council of Churches (WCC)": "https://www.oikoumene.org/",
  "UEM – United Evangelical Mission": "https://www.vemission.org/",
  "Komite Nasional LWF (KN-LWF)": "https://knl-wf.org/",
  "Persekutuan Gereja Indonesia (PGI)": "https://pgi.or.id/",
  "PGI Wilayah Sumatera Utara": "http://www.pgi-sumut.or.id/",
  "STT Abdi Sabda Medan": "https://sttabdisabda.ac.id/",
  "YASUMA – Yayasan Sumber Sejahtera": "https://www.bibleleagueindonesia.org/",
  "Pusat Pelatihan Misi Terpadu (PPMT) – GKY Jakarta": "http://gky.or.id/",
  "Evangelism Explosion (EE Indonesia)": "https://eeindonesia.org/",
  "Badan Penerbit Kristen (BPK)": "https://bpkgunungmulia.com/",
  "Lembaga Alkitab Indonesia (LAI)": "https://www.alkitab.or.id/",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MitraPage() {
  const [selectedMitra, setSelectedMitra] = useState<typeof mitraInternasional[number] | null>(null);

  // Manage body overflow when modal is active
  useEffect(() => {
    if (selectedMitra) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedMitra]);

  // Handle escape key closure
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedMitra(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-5 pb-16 pt-32 sm:px-8 md:pb-24 md:pt-40">
        <div className="absolute inset-0">
          <Image
            src={assets.heroBg}
            alt="Mitra GKPI"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/35" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="max-w-3xl space-y-7">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
                Mitra Pelayanan
              </p>
              <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
                Bersama Mewujudkan{" "}
                <span className="text-accent">Pelayanan Kristus.</span>
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
                GKPI menjalin kemitraan dengan gereja-gereja, lembaga ekumenis,
                dan organisasi Kristen dari seluruh dunia — bersatu dalam visi
                pelayanan yang memuliakan nama Tuhan.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 pt-2">
                {[
                  { value: "12+", label: "Mitra Internasional" },
                  { value: "8+", label: "Mitra Nasional" },
                  { value: "4", label: "Benua" },
                ].map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <span className="text-3xl font-bold text-accent">
                      {stat.value}
                    </span>
                    <span className="text-sm text-text-secondary">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Mitra Internasional ───────────────────────────────────────── */}
      <Section id="internasional" className="!py-14 md:!py-20">
        <ScrollReveal>
          <div className="mb-12 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                  <Globe size={20} className="text-accent" />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
                  Ekumenis Internasional
                </p>
              </div>
              <h2 className="text-3xl font-bold text-white md:text-4xl">
                Mitra Internasional
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-text-secondary">
              Gereja dan lembaga dari berbagai negara yang bersama GKPI dalam
              pelayanan lintas budaya.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mitraInternasional.map((mitra, i) => (
            <ScrollReveal key={mitra.name}>
              <MitraCard
                mitra={mitra}
                index={i}
                onOpenDetails={() => setSelectedMitra(mitra)}
              />
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* ── Mitra Nasional ────────────────────────────────────────────── */}
      <section className="border-y border-border/60 bg-surface/20 px-5 py-14 sm:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="mb-12 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                    <HandHeart size={20} className="text-accent" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
                    Nasional
                  </p>
                </div>
                <h2 className="text-3xl font-bold text-white md:text-4xl">
                  Mitra Nasional
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-text-secondary">
                Lembaga dan organisasi Kristen di dalam negeri yang bermitra
                dengan GKPI dalam pelayanan pendidikan, penerbitan, dan sosial.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {mitraNasional.map((mitra, i) => (
              <ScrollReveal key={mitra.name}>
                <MitraCard
                  mitra={mitra}
                  index={i}
                  onOpenDetails={() => setSelectedMitra(mitra)}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="px-5 py-16 sm:px-8 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <ScrollReveal>
            <div className="rounded-[2rem] border border-border/70 bg-surface/55 p-10 shadow-2xl shadow-black/15 md:p-14">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
                Bergabung Bersama Kami
              </p>
              <h2 className="mt-4 text-3xl font-bold text-white md:text-4xl">
                Ingin bermitra dengan GKPI?
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-text-secondary leading-relaxed">
                Kami terbuka untuk menjalin kerjasama pelayanan bersama
                lembaga, gereja, atau organisasi yang memiliki visi serupa
                dalam memuliakan Tuhan dan melayani sesama.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/kontak"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-colors hover:bg-primary-dark"
                >
                  Hubungi Kami
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-8 py-3.5 text-sm font-medium text-text-secondary transition-all hover:border-accent/30 hover:text-white"
                >
                  Kembali ke Beranda
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />

      {/* ── Detail Modal ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedMitra && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMitra(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 25 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
              className="relative z-10 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-surface/95 shadow-2xl backdrop-blur-xl"
            >
              {/* Header */}
              <div className="relative flex items-center justify-between border-b border-border/40 px-6 py-5 md:px-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                    <Globe size={20} className="text-accent" />
                  </div>
                  <div>
                    <span className="inline-block rounded-full border border-accent/20 bg-accent/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent">
                      {selectedMitra.region}
                    </span>
                    <h2 className="mt-0.5 text-lg font-bold text-white md:text-xl">
                      Detail Mitra
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMitra(null)}
                  className="rounded-full p-2 text-text-secondary hover:bg-white/5 hover:text-white transition-colors duration-200"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                {/* Logo & Card Info */}
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-border/40">
                  <div className="flex h-24 w-40 shrink-0 items-center justify-center rounded-2xl border border-border/50 bg-background/60 p-4">
                    <div className="relative h-16 w-full">
                      <Image
                        src={selectedMitra.logo}
                        alt={selectedMitra.name}
                        fill
                        sizes="160px"
                        className="object-contain object-center"
                      />
                    </div>
                  </div>
                  <div className="text-center sm:text-left space-y-2">
                    <h3 className="text-xl font-bold text-white leading-tight">
                      {selectedMitra.name}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {selectedMitra.description}
                    </p>
                  </div>
                </div>

                {/* Scraped Content / Details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-accent">
                    Tentang Kemitraan
                  </h4>
                  {mitraDetails[selectedMitra.name] ? (
                    <div
                      className="space-y-4 text-text-secondary text-sm leading-relaxed
                        [&>p]:leading-relaxed [&>p]:text-text-secondary/90
                        [&>h1]:text-white [&>h1]:text-xl [&>h1]:font-bold [&>h1]:mt-6 [&>h1]:mb-2
                        [&>h2]:text-white [&>h2]:text-lg [&>h2]:font-bold [&>h2]:mt-6 [&>h2]:mb-2
                        [&>h3]:text-white [&>h3]:text-md [&>h3]:font-semibold [&>h3]:mt-4 [&>h3]:mb-2
                        [&_a]:text-accent [&_a]:underline [&_a]:font-medium [&_a]:hover:text-accent/80 [&_a]:transition-colors
                        [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1
                        [&_li]:text-text-secondary
                        [&_strong]:text-white [&_strong]:font-semibold
                        [&_span]:inline"
                      dangerouslySetInnerHTML={{
                        __html: mitraDetails[selectedMitra.name] || "",
                      }}
                    />
                  ) : (
                    <div className="rounded-2xl bg-white/5 border border-white/5 p-5 text-sm text-text-secondary/80 leading-relaxed italic">
                      GKPI menjalin kerja sama erat dengan {selectedMitra.name} dalam pelayanan penginjilan, pembinaan jemaat, dan berbagai misi pelayanan gerejawi di wilayah {selectedMitra.region} untuk mewujudkan persekutuan Tubuh Kristus yang oikumenis.
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/40 px-6 py-5 md:px-8 bg-surface-light/30">
                {officialWebsites[selectedMitra.name] ? (
                  <a
                    href={officialWebsites[selectedMitra.name]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-accent px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-accent/15 hover:bg-accent/90 transition-all duration-200"
                  >
                    <Globe size={14} />
                    Kunjungi Website Resmi
                  </a>
                ) : (
                  <span className="text-xs text-text-secondary/60 italic">
                    Situs web resmi tidak tersedia
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedMitra(null)}
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-full border border-border px-6 py-2.5 text-xs font-semibold text-text-secondary hover:border-white/20 hover:text-white transition-all duration-200"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

// ─── MitraCard Component ───────────────────────────────────────────────────────

function MitraCard({
  mitra,
  index,
  onOpenDetails,
}: {
  mitra: {
    name: string;
    logo: string;
    region: string;
    description: string;
    url: string;
  };
  index: number;
  onOpenDetails: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpenDetails}
      id={`mitra-card-${index}`}
      className="group flex h-full w-full flex-col text-left rounded-3xl border border-border/70 bg-surface/55 p-6 shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-accent/5 focus:outline-none focus:ring-2 focus:ring-accent/50"
    >
      {/* Logo */}
      <div className="mb-5 flex h-20 w-full items-center justify-center rounded-2xl border border-border/50 bg-background/60 p-4">
        <div className="relative h-12 w-full">
          <Image
            src={mitra.logo}
            alt={mitra.name}
            fill
            sizes="160px"
            className="object-contain object-center"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3">
        {/* Region badge */}
        <span className="inline-block w-fit rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent">
          {mitra.region}
        </span>

        {/* Name */}
        <h3 className="text-base font-bold leading-snug text-white group-hover:text-accent transition-colors duration-200">
          {mitra.name}
        </h3>

        {/* Description */}
        <p className="flex-1 text-sm leading-relaxed text-text-secondary line-clamp-3">
          {mitra.description}
        </p>

        {/* Link indicator */}
        <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          Selengkapnya
          <ArrowRight size={12} />
        </div>
      </div>
    </button>
  );
}
