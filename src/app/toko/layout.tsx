import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Toko Jemaat",
  description:
    "Belanja produk rohani, Alkitab, buku renungan, dan merchandise resmi dari Toko GKPI Sinode.",
};

export default function TokoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}