import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publikasi & Berita",
  description:
    "Berita terkini, artikel, dan publikasi resmi dari GKPI Sinode — Gereja Kristen Protestan Indonesia.",
};

export default function PublikasiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}