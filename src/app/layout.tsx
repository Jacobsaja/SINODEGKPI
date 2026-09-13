import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "@/lib/site-config";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GKPI Sinode - Gereja Kristen Protestan Indonesia",
    template: "%s | GKPI Sinode",
  },
  description: "Selamat Datang di GKPI - Komunitas yang bertumbuh dalam iman, melayani dengan kasih, dan berdampak bagi sesama.",
  keywords: ["GKPI", "Gereja Kristen Protestan Indonesia", "Sinode GKPI", "Pematangsiantar", "gereja protestan"],
  openGraph: {
    title: "GKPI Sinode - Gereja Kristen Protestan Indonesia",
    description: "Komunitas yang bertumbuh dalam iman, melayani dengan kasih, dan berdampak bagi sesama.",
    url: SITE_URL,
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
const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["Church", "Organization"],
  name: "GKPI Sinode - Gereja Kristen Protestan Indonesia",
  alternateName: "GKPI",
  url: SITE_URL,
  logo: `${SITE_URL}/mitra/Logo_GKPI.webp`,
  image: `${SITE_URL}/og-image.webp`,
  description:
    "GKPI Sinode - Komunitas yang bertumbuh dalam iman, melayani dengan kasih, dan berdampak bagi sesama.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Pematang Siantar",
    addressRegion: "Sumatera Utara",
    addressCountry: "ID",
  },
  sameAs: [
    // Isi link medsos resmi di sini kalau/ketika sudah ada
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
      className={`h-full antialiased ${plusJakartaSans.variable} ${playfairDisplay.variable}`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col selection:bg-primary/20 selection:text-primary-dark font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        {process.env.NODE_ENV === "production" && (
          <>
            <SpeedInsights />
            <Analytics />
          </>
        )}
      </body>
    </html>
  );
}