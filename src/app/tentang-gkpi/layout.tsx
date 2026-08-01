import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang GKPI",
  description:
    "Sejarah, visi, misi, dan profil GKPI Sinode — Gereja Kristen Protestan Indonesia.",
};

export default function TentangGkpiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}