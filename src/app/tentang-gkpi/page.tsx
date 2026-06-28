import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Section from "@/components/Section";
import ScrollReveal from "@/components/ScrollReveal";
import Image from "next/image";
import Link from "next/link";
import { assets } from "@/lib/assets";
import {
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  Church,
  HandHeart,
  Landmark,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";

const quickFacts = [
  {
    label: "Berdiri",
    value: "30 Agustus 1964",
    icon: CalendarDays,
  },
  {
    label: "Pusat",
    value: "Pematangsiantar",
    icon: MapPin,
  },
  {
    label: "Wilayah",
    value: "12 Wilayah Pelayanan",
    icon: Landmark,
  },
];

const history = [
  {
    year: "1962",
    title: "Gerakan Pembaruan",
    text: "Muncul dorongan pembaruan dalam tubuh HKBP melalui Dewan Patotahon.",
  },
  {
    year: "1964",
    title: "Sinode Khusus Parapat",
    text: "Perbedaan pandangan memuncak dalam Sinode Khusus pada 19-25 Juli 1964.",
  },
  {
    year: "30 Agustus 1964",
    title: "GKPI Berdiri",
    text: "GKPI resmi berdiri di Pematangsiantar sebagai wadah persekutuan baru.",
  },
];

const faithPoints = [
  "Bersumber dan berdasar pada Alkitab.",
  "Mengacu pada tradisi iman gereja reformatoris.",
  "Berpegang pada pengakuan iman gereja yang ekumenis.",
  "Hadir di tengah pergumulan bangsa dengan landasan moral, etik, dan spiritual.",
];

const institutions = [
  "Panti Asuhan Mamre GKPI",
  "Yapentra GKPI",
  "Yayasan Dana Agape GKPI",
  "LPPM GKPI",
  "Badan Pendidik GKPI",
  "Media Suara GKPI",
  "Kolportase GKPI",
  "Rumah Lansia Sejahtera LENTERA GKPI",
];

const regions = [
  "Medan I - Langkat",
  "Medan II - Deli Serdang",
  "Siantar - Simalungun - Tebing - Sergai",
  "Dairi - Tanah Karo - Alas - Pakpak",
  "Asahan - Labuhan Batu",
  "Silindung - Pahae - Tapteng - Tapsel",
  "Humbang - Samosir - Toba",
  "Sumatera Bagian Selatan",
  "Riau",
  "Kepulauan Riau",
  "Jabodetabek - Jawa - Kalimantan",
  "Kalimantan",
];

export const metadata = {
  title: "Tentang GKPI",
  description:
    "Mengenal ringkas sejarah, pokok iman, lembaga, dan wilayah pelayanan Gereja Kristen Protestan Indonesia.",
};

export default function TentangPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden px-5 pb-16 pt-32 sm:px-8 md:pb-24 md:pt-40">
        <div className="absolute inset-0">
          <Image
            src={assets.heroBg}
            alt="GKPI"
            fill
            className="object-cover opacity-25"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/35" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <ScrollReveal>
            <div className="max-w-3xl space-y-7">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
                Tentang GKPI
              </p>
              <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
                Gereja yang bertumbuh dalam iman dan pelayanan.
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
                Gereja Kristen Protestan Indonesia adalah gereja Kristen Protestan
                yang berpusat di Pematangsiantar, Sumatera Utara. GKPI berdiri
                pada 30 Agustus 1964 dan terus melayani melalui persekutuan,
                kesaksian, pendidikan, dan pelayanan sosial.
              </p>
              <Link
                href="#sejarah"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-white shadow-lg shadow-black/20 transition-colors hover:bg-primary-dark"
              >
                Lihat Ringkasan
                <ArrowRight size={17} />
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {quickFacts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex items-center gap-4 rounded-2xl border border-border/70 bg-surface/70 p-5 shadow-xl shadow-black/10 backdrop-blur"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15">
                    <fact.icon size={22} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-text-secondary">
                      {fact.label}
                    </p>
                    <p className="mt-1 font-bold text-white">{fact.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Section id="sejarah" className="!py-16 md:!py-24">
        <div className="grid grid-cols-1 gap-12 lg:gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="space-y-5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
              Sejarah Singkat
            </p>
            <h2 className="text-3xl font-bold text-white md:text-4xl leading-tight">
              Lahir dari semangat pembaruan.
            </h2>
            <p className="text-text-secondary leading-relaxed">
              GKPI berdiri sebagai bagian dari dinamika pembaruan gereja pada
              awal 1960-an. Ringkasan ini menjaga halaman tetap ringan, tanpa
              menghilangkan tonggak utamanya.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {history.map((item) => (
              <article
                key={item.title}
                className="flex flex-col h-full justify-between rounded-3xl border border-border/70 bg-surface/55 p-7 shadow-xl shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-accent/5"
              >
                <div>
                  <p className="text-sm font-bold text-accent">{item.year}</p>
                  <h3 className="mt-3 text-lg font-bold text-white leading-snug">
                    {item.title}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <section className="border-y border-border/60 bg-surface/30 px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
          <ScrollReveal>
            <div className="rounded-3xl border border-border/70 bg-background/75 p-8 shadow-2xl shadow-black/15 md:p-10">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
                <ShieldCheck size={28} className="text-accent" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
                Pokok Iman
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
                Berakar pada Alkitab dan tradisi reformatoris.
              </h2>
              <p className="mt-5 leading-relaxed text-text-secondary">
                Pokok-pokok Pemahaman Iman GKPI menjadi pedoman bagi warga dan
                pelayan gereja dalam menyatakan iman, menyusun pelayanan, dan
                memberi jawab atas pergumulan zaman.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="grid grid-cols-1 gap-4">
              {faithPoints.map((point) => (
                <div
                  key={point}
                  className="flex items-start gap-4 rounded-2xl border border-border/60 bg-background/50 p-5"
                >
                  <BookOpen size={21} className="mt-0.5 shrink-0 text-accent" />
                  <p className="text-text-secondary">{point}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Section className="!py-14 md:!py-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <article className="rounded-3xl border border-border/70 bg-surface/55 p-8 shadow-xl shadow-black/10">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15">
              <Church size={24} className="text-accent" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Pimpinan 2025-2030
            </p>
            <h2 className="mt-3 text-2xl font-bold text-white">
              Kepemimpinan Sinode
            </h2>
            <div className="mt-6 space-y-4 text-sm text-text-secondary">
              <p>
                <span className="font-bold text-white">Bishop:</span> Pdt. Dr.
                Humala Lumbantobing, M.Th
              </p>
              <p>
                <span className="font-bold text-white">Sekjen:</span> Pdt.
                Parsaoran Sinaga, M.Min, M.Th
              </p>
            </div>
          </article>

          <article className="rounded-3xl border border-border/70 bg-surface/55 p-8 shadow-xl shadow-black/10 lg:col-span-2">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15">
              <HandHeart size={24} className="text-accent" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Lembaga Pelayanan
            </p>
            <h2 className="mt-3 text-2xl font-bold text-white">
              Pelayanan yang hadir bagi gereja dan masyarakat.
            </h2>
            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {institutions.map((institution) => (
                <div
                  key={institution}
                  className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/45 px-4 py-3"
                >
                  <Building2 size={17} className="shrink-0 text-accent" />
                  <span className="text-sm text-text-secondary">
                    {institution}
                  </span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </Section>

      <section className="px-5 pb-20 sm:px-8 md:pb-28">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-border/70 bg-surface/55 p-7 shadow-2xl shadow-black/15 md:p-10">
          <ScrollReveal>
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-accent">
                  Wilayah Pelayanan
                </p>
                <h2 className="mt-3 text-3xl font-bold text-white">
                  Melayani dalam 12 wilayah.
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-relaxed text-text-secondary">
                Dari Sumatera Utara hingga berbagai daerah di Indonesia, GKPI
                bertumbuh melalui jaringan wilayah pelayanan yang terorganisir.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {regions.map((region, index) => (
                <div
                  key={region}
                  className="flex items-center gap-3 rounded-xl border border-border/50 bg-background/45 px-4 py-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-xs font-bold text-accent">
                    {index + 1}
                  </div>
                  <span className="text-sm text-text-secondary">{region}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl border border-border/60 bg-background/55 p-6 md:flex-row md:items-center">
              <div className="flex items-start gap-4">
                <Users size={24} className="mt-1 shrink-0 text-accent" />
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Ingin mengenal pelayanan GKPI lebih lanjut?
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    Hubungi Sinode atau lihat informasi pelayanan terbaru.
                  </p>
                </div>
              </div>
              <Link
                href="/kontak"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
              >
                Hubungi Kami
                <ArrowRight size={16} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
