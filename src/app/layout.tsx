import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sinodegkpi.vercel.app"),
  title: {
    default: "GKPI Sinode - Gereja Kristen Protestan Indonesia",
    template: "%s | GKPI Sinode",
  },
  description: "Selamat Datang di GKPI - Komunitas yang bertumbuh dalam iman, melayani dengan kasih, dan berdampak bagi sesama.",
  keywords: ["GKPI", "Gereja Kristen Protestan Indonesia", "Sinode GKPI", "Pematangsiantar", "gereja protestan"],
  openGraph: {
    title: "GKPI Sinode - Gereja Kristen Protestan Indonesia",
    description: "Komunitas yang bertumbuh dalam iman, melayani dengan kasih, dan berdampak bagi sesama.",
    url: "https://sinodegkpi.vercel.app",
    siteName: "GKPI Sinode",
    locale: "id_ID",
    type: "website",
    images: [{ url: "/og-image.webp", width: 1200, height: 630, alt: "GKPI Sinode" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GKPI Sinode - Gereja Kristen Protestan Indonesia",
    description: "Komunitas yang bertumbuh dalam iman, melayani dengan kasih, dan berdampak bagi sesama.",
    images: ["/og-image.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD structured data: kasih tau Google identitas resmi organisasi ini.
// Ditaruh di root layout (bukan per-halaman) karena ini identitas GLOBAL
// situs, bukan konten spesifik satu halaman.
//
// CATATAN: begitu domain final (.or.id) sudah aktif, ganti SEMUA URL
// "https://sinodegkpi.vercel.app" di bawah (dan di metadataBase atas)
// ke domain final. Isi juga array `sameAs` dengan link medsos resmi
// GKPI Sinode kalau/ketika sudah ada.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["Church", "Organization"],
  name: "GKPI Sinode - Gereja Kristen Protestan Indonesia",
  alternateName: "GKPI",
  url: "https://sinodegkpi.vercel.app",
  logo: "https://sinodegkpi.vercel.app/mitra/Logo_GKPI.webp",
  image: "https://sinodegkpi.vercel.app/og-image.webp",
  description:
    "GKPI Sinode - Komunitas yang bertumbuh dalam iman, melayani dengan kasih, dan berdampak bagi sesama.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Pematang Siantar",
    addressRegion: "Sumatera Utara",
    addressCountry: "ID",
  },
  sameAs: [
    // Isi link medsos resmi di sini kalau/ketika sudah ada, contoh:
    // "https://www.facebook.com/gkpisinode",
    // "https://www.instagram.com/gkpisinode",
    // "https://www.youtube.com/@gkpisinode",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`h-full antialiased ${inter.variable} ${playfairDisplay.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col selection:bg-primary/20 selection:text-primary-dark font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}