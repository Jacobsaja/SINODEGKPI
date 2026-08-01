import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengurus GKPI",
  description:
    "Kenali jajaran pengurus dan struktur kepemimpinan GKPI Sinode — Gereja Kristen Protestan Indonesia.",
};

export default function PengurusLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}