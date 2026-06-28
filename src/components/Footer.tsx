import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import { assets } from "@/lib/assets";
import ScrollReveal from "@/components/ScrollReveal";

const navLinks = [
  { name: "Beranda", href: "/" },
  { name: "Tentang GKPI", href: "tentang-gkpi" },
  { name: "Pengurus", href: "pengurus" },
  { name: "Wilayah", href: "wilayah-resort" },
  { name: "Publikasi", href: "publikasi" },
  { name: "Mitra", href: "mitra" },
];

const serviceLinks = [
  { name: "Jadwal Ibadah", href: "#" },
  { name: "Renungan Harian", href: "#" },
  { name: "Pengumuman", href: "#publikasi" },
  { name: "Formulir Online", href: "#" },
  { name: "Pendaftaran", href: "#" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background text-text-primary border-t border-border">
      <ScrollReveal className="max-w-7xl mx-auto px-5 sm:px-8 pt-20 pb-12">

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-12 h-12 shrink-0">
                <Image
                  src={assets.logo}
                  alt="Logo GKPI"
                  fill
                  className="object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <span className="text-2xl font-sans font-bold tracking-tight text-white">GKPI</span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
              Membangun komunitas yang bertumbuh dalam iman, melayani dengan kasih, dan berdampak bagi sesama melalui Injil Kristus.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-4">
              {[
                { Icon: Facebook, label: "Facebook GKPI" },
                { Icon: Instagram, label: "Instagram GKPI" },
                { Icon: Youtube, label: "YouTube GKPI" },
              ].map(({ Icon, label }) => (
                <Link
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-text-secondary hover:text-white hover:border-accent/40 hover:bg-accent/5 transition-all duration-300 shadow-sm"
                >
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Navigasi</h4>
            <ul className="space-y-4">
              {navLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-text-secondary hover:text-white transition-colors duration-200 inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Layanan</h4>
            <ul className="space-y-4">
              {serviceLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-text-secondary hover:text-white transition-colors duration-200 inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Kontak</h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
                <span className="text-sm text-text-secondary leading-relaxed">
                  Jl. Pematang Siantar No. 12,<br />Sumatera Utara, Indonesia
                </span>
              </li>
              <li className="flex items-center gap-4">
                <Phone size={18} className="text-accent shrink-0" />
                <a href="tel:+621234567890" className="text-sm text-text-secondary hover:text-white transition-colors font-medium">
                  +62 123 4567 890
                </a>
              </li>
              <li className="flex items-center gap-4">
                <Mail size={18} className="text-accent shrink-0" />
                <a href="mailto:info@gkpi.or.id" className="text-sm text-text-secondary hover:text-white transition-colors font-medium">
                  info@gkpi.or.id
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-10 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-xs text-text-secondary/60">
            © {currentYear} GKPI Sinode. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex gap-8">
            {["Kebijakan Privasi", "Syarat & Ketentuan"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-xs text-text-secondary/60 hover:text-white transition-colors duration-200"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </footer>
  );
}
