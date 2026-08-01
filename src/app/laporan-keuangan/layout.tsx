import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laporan Keuangan",
  description:
    "Transparansi laporan keuangan GKPI Sinode — Gereja Kristen Protestan Indonesia.",
};

export default function LaporanKeuanganLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}