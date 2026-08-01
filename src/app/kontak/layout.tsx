import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontak Kami",
  description:
    "Hubungi GKPI Sinode — Gereja Kristen Protestan Indonesia. Temukan alamat, nomor telepon, dan informasi kontak resmi kami.",
};

export default function KontakLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}