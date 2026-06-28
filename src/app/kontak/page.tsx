"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Send,
  CheckCircle,
  ChevronDown,
  ArrowLeft,
  ChevronRight,
  Info,
} from "lucide-react";

// ─── Operational Hours ────────────────────────────────────────────────────────
const operationalHours = [
  { day: "Senin - Jumat", hours: "08.00 - 16.00 WIB" },
  { day: "Sabtu", hours: "09.00 - 13.00 WIB" },
  { day: "Minggu / Hari Libur", hours: "Tutup" },
];

// ─── FAQ Bantuan Cepat ────────────────────────────────────────────────────────
const faqs = [
  {
    question: "Bagaimana cara mengajukan permohonan pelayanan jemaat?",
    answer: "Anda dapat menghubungi sekretariat kantor pusat kami melalui email atau nomor telepon yang tertera, atau mengunjungi Resort terdekat di wilayah Anda.",
  },
  {
    question: "Apakah dokumen tata gereja dapat diunduh secara bebas?",
    answer: "Ya, dokumen administrasi, peraturan rumah tangga, dan profil umum gereja dapat diakses dan diunduh di halaman Publikasi kami secara gratis.",
  },
  {
    question: "Bagaimana cara melakukan kerja sama kemitraan?",
    answer: "Silakan kirimkan proposal atau permohonan resmi Anda ke alamat email sekretariat kami dengan subjek 'Kemitraan'. Tim kami akan segera meninjau permohonan Anda.",
  },
];

export default function KontakPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 4000);
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-text-primary">
      <Navbar />

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[50vh] items-end overflow-hidden bg-background pb-12 pt-32 md:min-h-[55vh] md:pb-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.png"
            alt="Kontak Latar Belakang"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            quality={90}
          />
          <div className="absolute inset-0 bg-primary/75 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-primary/35 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-background/80" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-text-primary/75 transition-colors hover:text-accent"
            >
              Beranda
            </Link>
            <ChevronRight size={14} className="text-text-primary/30" />
            <span className="text-sm font-medium text-accent">Kontak</span>
          </nav>

          <ScrollReveal>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-accent">
              Hubungi Kami
            </p>
            <h1
              className="mb-5 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Kontak
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-text-secondary md:text-lg">
              Deskripsi
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Contact Section Content ──────────────────────────────────────── */}
      <section className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 lg:gap-16">

          {/* Column 1: Info & Operational Hours */}
          <div className="lg:col-span-2 space-y-8">
            <ScrollReveal>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white tracking-wide">
                  Informasi Kontak
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Hubungi kami melalui saluran berikut untuk informasi lebih lanjut mengenai kegiatan sinode, layanan resort, atau bantuan administratif lainnya.
                </p>
              </div>
            </ScrollReveal>

            {/* Core Info Cards */}
            <ScrollReveal>
              <div className="space-y-4">
                {[
                  { icon: MapPin, title: "Alamat", content: "Jl. Pematang Siantar No. 12, Sumatera Utara, Indonesia" },
                  { icon: Phone, title: "No Telepon", content: "+621234567890", isLink: true, href: "tel:+000000000000" },
                  { icon: Mail, title: "Email", content: "info@gkpi.or.id", isLink: true, href: "mailto:email@contoh.com" },
                  { icon: Globe, title: "Website", content: "Deskripsi" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 p-5 rounded-2xl bg-surface/50 border border-border/70 hover:border-accent/30 transition-all duration-300"
                    style={{ backdropFilter: "blur(12px)" }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/15 border border-accent/20 flex items-center justify-center shrink-0">
                      <item.icon size={18} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-accent">
                        {item.title}
                      </p>
                      {item.isLink ? (
                        <a
                          href={item.href}
                          className="text-sm text-text-primary hover:underline hover:text-accent mt-1 block font-medium"
                        >
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
            </ScrollReveal>

            {/* Jam Operasional (Office Hours) */}
            <ScrollReveal>
              <div
                className="p-6 rounded-3xl border border-border/80 bg-surface/30 space-y-4"
                style={{ backdropFilter: "blur(12px)" }}
              >
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock size={18} className="text-accent" />
                  Jam Operasional
                </h3>
                <div className="space-y-3 text-sm">
                  {operationalHours.map((op, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center py-2 border-b border-border/30 last:border-b-0"
                    >
                      <span className="text-text-secondary font-medium">{op.day}</span>
                      <span className="text-white font-bold">{op.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Column 2: Form & Success Alert */}
          <div className="lg:col-span-3">
            <ScrollReveal>
              <div
                className="rounded-[2rem] p-8 md:p-12 shadow-2xl border border-border"
                style={{
                  background: "linear-gradient(135deg, #162A40 0%, #0F1E2E 100%)",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
                }}
              >
                <h3 className="text-2xl font-bold text-white mb-6">Kirim Pesan</h3>

                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-fade-in text-center">
                    <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center">
                      <CheckCircle size={32} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Pesan Terkirim</h4>
                      <p className="text-sm text-text-secondary mt-1 max-w-sm">
                        Terima kasih! Pesan Anda telah kami terima. Kami akan segera menghubungi Anda kembali secepatnya.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-text-secondary uppercase tracking-[0.15em]">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Nama"
                          className="w-full bg-background/50 border border-border text-text-primary placeholder:text-text-secondary/35 text-sm rounded-2xl px-5 py-4 focus:outline-none focus:border-accent/50 focus:bg-background/80 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-text-secondary uppercase tracking-[0.15em]">
                          Alamat Email
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="Email"
                          className="w-full bg-background/50 border border-border text-text-primary placeholder:text-text-secondary/35 text-sm rounded-2xl px-5 py-4 focus:outline-none focus:border-accent/50 focus:bg-background/80 transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-text-secondary uppercase tracking-[0.15em]">
                        Subjek
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Perihal"
                        className="w-full bg-background/50 border border-border text-text-primary placeholder:text-text-secondary/35 text-sm rounded-2xl px-5 py-4 focus:outline-none focus:border-accent/50 focus:bg-background/80 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-text-secondary uppercase tracking-[0.15em]">
                        Isi Pesan
                      </label>
                      <textarea
                        rows={5}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Pesan"
                        className="w-full bg-background/50 border border-border text-text-primary placeholder:text-text-secondary/35 text-sm rounded-2xl px-5 py-4 focus:outline-none focus:border-accent/50 focus:bg-background/80 transition-all resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-4 bg-primary text-white text-sm font-bold rounded-2xl hover:bg-primary-dark shadow-xl hover:shadow-primary/20 transition-all duration-300 mt-4 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Send size={15} />
                      Kirim Pesan
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* ── Lokasi Peta Mock ── */}
        <ScrollReveal>
          <div className="mt-16 space-y-6">
            <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
              <MapPin size={22} className="text-accent" />
              Peta Lokasi Kantor Pusat
            </h2>
            <div
              className="relative w-full h-[400px] overflow-hidden rounded-[2rem] border border-border/80 flex items-center justify-center p-8 bg-surface/30"
              style={{ backdropFilter: "blur(12px)" }}
            >
              {/* Dark Map Mockup */}
              <div className="absolute inset-0 bg-[#0c1421] opacity-90" />

              {/* Map grid lines / decorative elements */}
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "radial-gradient(#6FA8DC 1px, transparent 1px)",
                  backgroundSize: "24px 24px"
                }}
              />

              {/* Map mockup elements */}
              <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0,100 L 800,120 M 100,0 L 150,400 M 400,0 L 450,400 M 0,250 L 800,200" stroke="#6FA8DC" strokeWidth="2" fill="none" />
                <path d="M 200,80 C 300,100 450,50 600,150" stroke="#2C5F8A" strokeWidth="3" fill="none" />
              </svg>

              {/* Pulsing Pin marker */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="absolute -inset-4 bg-accent/20 rounded-full animate-ping pointer-events-none" />
                <div className="relative w-12 h-12 bg-accent rounded-full border border-white flex items-center justify-center shadow-lg shadow-accent/40">
                  <MapPin size={20} className="text-background" />
                </div>
                <div className="mt-4 px-4 py-2 bg-surface/90 border border-border rounded-xl text-xs font-bold text-white shadow-xl max-w-xs text-center backdrop-blur">
                  <p className="text-accent uppercase tracking-widest text-[9px] mb-0.5">Kantor Pusat</p>
                  <p>Alamat</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Bantuan Cepat / FAQ ── */}
        <ScrollReveal>
          <div className="mt-20 max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                <Info size={20} className="text-accent" />
                Pertanyaan Umum
              </h2>
              <p className="text-sm text-text-secondary">
                Jawaban cepat untuk pertanyaan yang paling sering ditanyakan mengenai administrasi dan hubungan kami.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden
                      ${isOpen ? "border-accent/30 bg-surface/50" : "border-border/60 bg-surface/20 hover:border-border"}`}
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full text-left p-5 flex items-center justify-between cursor-pointer"
                    >
                      <h4 className="font-semibold text-white text-base leading-snug pr-4">
                        {faq.question}
                      </h4>
                      <ChevronDown
                        size={18}
                        className={`text-text-secondary transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180 text-accent" : ""}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 border-t border-border/10">
                        <p className="text-text-secondary leading-relaxed text-sm md:text-base">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </main>
  );
}
