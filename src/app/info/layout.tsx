import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil GKPI — Sejarah, Visi & Misi | GKPI Sinode",
  description:
    "Mengenal Gereja Kristen Protestan Indonesia (GKPI): sejarah berdiri sejak 1964, visi menjadi Persekutuan Penyembahan dan Persembahan, serta Panca Pelayanan GKPI.",
  openGraph: {
    title: "Profil GKPI — Sejarah, Visi & Misi",
    description:
      "Mengenal Gereja Kristen Protestan Indonesia (GKPI): sejarah berdiri sejak 1964, visi menjadi Persekutuan Penyembahan dan Persembahan, serta Panca Pelayanan GKPI.",
    url: "https://gkpisinode.org/info",
    siteName: "GKPI Sinode",
    images: [
      {
        url: "https://gkpisinode.org/wp-content/uploads/2021/08/WhatsApp-Image-2021-08-26-at-19.45.18.jpeg",
        width: 972,
        height: 413,
        alt: "Profil GKPI Sinode",
      },
    ],
    locale: "id_ID",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Profil GKPI — Sejarah, Visi & Misi",
    description:
      "Mengenal Gereja Kristen Protestan Indonesia (GKPI): sejarah berdiri sejak 1964, visi menjadi Persekutuan Penyembahan dan Persembahan, serta Panca Pelayanan GKPI.",
  },
};

export default function InfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
