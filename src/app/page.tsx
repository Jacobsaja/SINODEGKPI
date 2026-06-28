import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import Card from "@/components/Card";
import InfoSlideshow from "@/components/InfoSlideshow";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import Image from "next/image";
import Link from "next/link";
import { assets } from "@/lib/assets";
import {
  ChevronRight,
  ShieldCheck,
  HeartHandshake,
  MapPin,
  Mail,
  Phone,
  Globe,
  CheckCircle2,
  Calendar,
  BookOpen,
  Bell,
  Newspaper,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const publications = [
  {
    title: "Renungan Harian: Suara Gembala — Mei 2026",
    excerpt:
      "Edisi bulan Mei kini tersedia untuk dibaca dan diunduh. Temukan inspirasi firman Tuhan yang membangun setiap pagi.",
    date: "25 April 2026",
    category: "Renungan",
  },
  {
    title: "Majalah GKPI Edisi April 2026",
    excerpt:
      "Liputan perjalanan pelayanan di wilayah pedalaman dan profil tokoh jemaat yang menginspirasi banyak jiwa.",
    date: "15 April 2026",
    category: "Majalah",
  },
  {
    title: "Panduan Ibadah Keluarga — Triwulan II",
    excerpt:
      "Panduan ibadah mingguan bagi keluarga Kristen untuk mempererat hubungan dengan Tuhan di rumah masing-masing.",
    date: "12 April 2026",
    category: "Panduan",
  },
];

const misiPoints = [
  "Koinonia",
  "Marturia",
  "Diakonia",
  "Liturgia",
  "Oikonomia",
];

const partners = [
  { name: "PGI", logo: "/mitra/desain/1.png" },
  { name: "UEM", logo: "/mitra/desain/2.png" },
  { name: "LWF", logo: "/mitra/desain/3.png" },
  { name: "WCC", logo: "/mitra/desain/4.png" },
  { name: "CCA", logo: "/mitra/desain/5.png" },
  { name: "ELCA", logo: "/mitra/desain/6.png" },
  { name: "LCA", logo: "/mitra/desain/7.png" },
  { name: "PCK", logo: "/mitra/desain/8.png" },
  { name: "Abdi Sabda", logo: "/mitra/desain/9.png" },
  { name: "Yasuma", logo: "/mitra/desain/10.png" },
  { name: "KN-LWF", logo: "/mitra/desain/11.png" },
  { name: "LNM", logo: "/mitra/desain/12.png" },
  { name: "Kleve", logo: "/mitra/desain/13.png" },
  { name: "EMW", logo: "/mitra/desain/14.png" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />

      {/* ── Feature Navigation ─────────────────────────────────────────── */}
      <section id="fitur-navigasi" className="relative py-16 px-4 md:px-8 max-w-7xl mx-auto border-b border-border/50">
        <ScrollReveal>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
            {[
              {
                icon: Calendar,
                title: "Jadwal Ibadah",
                desc: "Jadwal pelayanan dan ibadah minggu.",
                href: "#jadwal",
              },
              {
                icon: BookOpen,
                title: "Renungan",
                desc: "Bacaan rohani harian penguat iman.",
                href: "#renungan",
              },
              {
                icon: Bell,
                title: "Info",
                desc: "Berita dan informasi terkini Sinode.",
                href: "#publikasi",
              },
              {
                icon: Newspaper,
                title: "Publikasi",
                desc: "Majalah, renungan, dan literasi GKPI.",
                href: "#literasi",
              },
              {
                icon: Phone,
                title: "Kontak",
                desc: "Hubungi kami untuk layanan pastoral.",
                href: "#kontak",
              },
            ].map((feature, idx) => (
              <Link
                key={idx}
                href={feature.href}
                className="group flex flex-col items-center text-center p-6 md:p-8 bg-surface/90 backdrop-blur-xl border border-border shadow-2xl rounded-[2rem] hover:-translate-y-2 hover:border-accent/30 hover:shadow-accent/10 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <feature.icon size={26} className="text-accent" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {feature.desc}
                </p>
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── About ──────────────────────────────────────────────────────── */}
      <Section id="tentang">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Text side */}
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Tentang Kami</p>
              <h2 className="text-4xl sm:text-5xl font-sans font-bold text-text-primary leading-[1.1]">
                Melayani dengan Hati,<br />Bertumbuh dalam Iman
              </h2>
            </div>
            <div className="space-y-5 text-text-secondary leading-relaxed text-base">
              <p>
                Gereja Kristen Protestan Indonesia (disingkat GKPI) adalah salah satu gereja berdenominasi Kristen Protestan yang berpusat di Pematangsiantar, Sumatera Utara, Indonesia.
              </p>
              <p>
                Gereja ini berdiri di Pematangsiantar pada tanggal 30 Agustus 1964 sebagai dampak dari serangkaian perselisihan internal Huria Kristen Batak Protestan (HKBP) sejak tahun 1962. Sejak saat itu, GKPI terus bertumbuh menjadi wadah persekutuan yang kokoh dalam iman.
              </p>
            </div>

            {/* Moto Pelayanan */}
            <div className="pt-4 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-widest text-accent">Moto Pelayanan</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Yesus Gembala Yang Baik",
                  "Melayani Bukan Untuk dilayani",
                  "Imamat Am Orang Percaya",
                  "Membayar Hutang Penginjilan"
                ].map((moto, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-surface/50 border border-border/50">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-accent text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-sm font-medium text-text-primary">{moto}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link
              href="/tentang-gkpi"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white text-sm font-bold rounded-full hover:bg-primary-dark shadow-lg transition-all duration-300"
            >
              Selengkapnya
              <ChevronRight size={18} />
            </Link>
          </div>

          {/* Image side */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-border shadow-2xl">
              <Image
                src={assets.aboutImg}
                alt="Pelayanan GKPI"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-background/40 to-transparent" />
            </div>
            {/* Floating stat */}
            <div className="absolute -bottom-8 -left-8 bg-surface rounded-[2rem] shadow-2xl border border-border p-8 hidden sm:block">
              <p className="text-4xl font-sans font-bold text-primary">65+</p>
              <p className="text-xs text-text-secondary mt-1 font-medium tracking-wide">Tahun Melayani</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Visi & Misi ────────────────────────────────────────────────── */}
      <Section pattern>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Visi */}
          <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-3xl p-10 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
              <ShieldCheck size={28} className="text-accent" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-sans font-bold text-text-primary">Visi</h3>
              <p className="text-text-secondary leading-relaxed italic text-2xl sm:text-3xl font-medium">
                &quot;Menjadi Persekutuan Penyembahan dan Persembahan Pada Tahun 2030&quot;
              </p>
            </div>
          </div>

          {/* Misi */}
          <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-3xl p-10 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
              <HeartHandshake size={28} className="text-accent" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-sans font-bold text-text-primary">Misi</h3>
              <p className="text-text-secondary text-lg sm:text-xl mb-6 font-medium">
                Dalam rangka mendukung Visi GKPI maka Misi GKPI dijabarkan dalam Panca Pelayanan GKPI:
              </p>
              <ul className="space-y-5">
                {misiPoints.map((point) => (
                  <li key={point} className="flex items-center gap-5">
                    <CheckCircle2 size={24} className="text-accent shrink-0" />
                    <span className="text-text-secondary text-xl sm:text-2xl font-medium leading-tight">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      {/* ── Announcements ──────────────────────────────────────────────── */}
      <Section
        id="publikasi"
        title="Info"
        subtitle="Ringkasan kabar, dokumen, dan arah pelayanan GKPI dalam satu ruang informasi."
        className="!pb-8 md:!pb-10"
        pattern
      >
        <InfoSlideshow />
      </Section>

      {/* ── Publications ───────────────────────────────────────────────── */}
      <Section
        id="literasi"
        title="Publikasi & Literasi"
        subtitle="Renungan, majalah, dan panduan untuk pertumbuhan rohani jemaat."
        className="!pt-6 md:!pt-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publications.map((item, i) => (
            <Card key={i} {...item} />
          ))}
        </div>
        <div className="mt-16 text-center">
          <Link
            href="#"
            className="inline-flex items-center gap-2 text-sm text-accent font-bold hover:underline underline-offset-8 transition-all"
          >
            Lihat semua publikasi
            <ChevronRight size={16} />
          </Link>
        </div>
      </Section>

      {/* ── Partners ───────────────────────────────────────────────────── */}
      <Section
        id="mitra"
        title="Mitra Pelayanan"
        subtitle="Bersama mitra terpercaya, kami memperluas jangkauan pelayanan di seluruh Indonesia."
      >
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4 md:gap-5 items-stretch">
          {partners.map((partner, i) => (
            <Link
              key={i}
              href="/mitra"
              className="group relative w-full max-w-[170px] md:max-w-[180px] justify-self-center aspect-square bg-surface/90 rounded-3xl border border-border flex items-center justify-center p-3 hover:bg-white/5 hover:border-accent/30 transition-all duration-300"
            >
              <div className="relative h-[60%] w-[60%] grayscale-0 opacity-100 transition-all duration-300">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  sizes="(min-width: 1280px) 108px, (min-width: 768px) 120px, 42vw"
                  className="object-contain object-center"
                />
              </div>
              {/* Tooltip on hover */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full opacity-0 group-hover:opacity-100 bg-background border border-border px-3 py-1.5 rounded-lg text-[10px] font-bold text-text-primary whitespace-nowrap z-10 transition-all pointer-events-none">
                {partner.name}
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/mitra"
            className="inline-flex items-center gap-2 text-sm text-accent font-bold hover:underline underline-offset-8 transition-all"
          >
            Lihat semua mitra
            <ChevronRight size={16} />
          </Link>
        </div>
      </Section>

      {/* ── Contact ────────────────────────────────────────────────────── */}
      <Section
        id="kontak"
        title="Hubungi Kami"
        subtitle="Punya pertanyaan atau ingin terlibat dalam pelayanan? Kami terbuka untuk Anda."
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 items-start">

          {/* Contact info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              {[
                { icon: MapPin, title: "Alamat", content: "Jl. Pematang Siantar No. 12, Sumatera Utara, Indonesia" },
                { icon: Phone, title: "Telepon", content: "+62 123 4567 890", isLink: true, href: "tel:+621234567890" },
                { icon: Mail, title: "Email", content: "info@gkpi.or.id", isLink: true, href: "mailto:info@gkpi.or.id" },
                { icon: Globe, title: "Jam Pelayanan", content: "Senin – Jumat, 08.00 – 16.00 WIB" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-5 p-6 rounded-3xl bg-surface border border-border hover:border-accent/20 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon size={20} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary tracking-wide">{item.title}</p>
                    {item.isLink ? (
                      <a href={item.href} className="text-sm text-accent hover:underline underline-offset-4 mt-1 block">
                        {item.content}
                      </a>
                    ) : (
                      <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                        {item.content}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-3 rounded-[2.5rem] p-10 md:p-14 shadow-2xl border border-border" style={{ background: "linear-gradient(135deg, #162A40 0%, #0F1E2E 100%)" }}>
            <h3 className="text-3xl font-sans font-bold text-white mb-8">Kirim Pesan</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-[0.15em]">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nama Anda"
                    className="w-full bg-background/50 border border-border text-text-primary placeholder:text-text-secondary/30 text-sm rounded-2xl px-5 py-4 focus:outline-none focus:border-accent/50 focus:bg-background/80 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-[0.15em]">
                    Alamat Email
                  </label>
                  <input
                    type="email"
                    placeholder="email@contoh.com"
                    className="w-full bg-background/50 border border-border text-text-primary placeholder:text-text-secondary/30 text-sm rounded-2xl px-5 py-4 focus:outline-none focus:border-accent/50 focus:bg-background/80 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-[0.15em]">
                  Subjek
                </label>
                <input
                  type="text"
                  placeholder="Mengenai apa?"
                  className="w-full bg-background/50 border border-border text-text-primary placeholder:text-text-secondary/30 text-sm rounded-2xl px-5 py-4 focus:outline-none focus:border-accent/50 focus:bg-background/80 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-[0.15em]">
                  Pesan
                </label>
                <textarea
                  rows={4}
                  placeholder="Tulis pesan Anda di sini..."
                  className="w-full bg-background/50 border border-border text-text-primary placeholder:text-text-secondary/30 text-sm rounded-2xl px-5 py-4 focus:outline-none focus:border-accent/50 focus:bg-background/80 transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-primary text-white text-base font-bold rounded-2xl hover:bg-primary-dark shadow-xl transition-all duration-300 mt-4"
              >
                Kirim Pesan
              </button>
            </form>
          </div>
        </div>
      </Section>

      <Footer />
    </main>
  );
}
