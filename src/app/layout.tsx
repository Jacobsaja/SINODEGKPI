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
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "GKPI Sinode" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "GKPI Sinode - Gereja Kristen Protestan Indonesia",
    description: "Komunitas yang bertumbuh dalam iman, melayani dengan kasih, dan berdampak bagi sesama.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
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
        {children}
      </body>
    </html>
  );
}