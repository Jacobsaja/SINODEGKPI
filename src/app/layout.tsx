import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GKPI Sinode - Gereja Kristen Protestan Indonesia",
  description: "Selamat Datang di GKPI - Komunitas yang bertumbuh dalam iman, melayani dengan kasih, dan berdampak bagi sesama.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col selection:bg-primary/20 selection:text-primary-dark font-sans">
        {children}
      </body>
    </html>
  );
}
