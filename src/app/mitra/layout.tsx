import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mitra GKPI | Gereja Kristen Protestan Indonesia",
  description:
    "Jaringan mitra pelayanan GKPI — dari lembaga ekumenis internasional seperti LWF, WCC, ELCA, hingga lembaga nasional seperti PGI, LAI, dan STT Abdi Sabda Medan.",
};

export default function MitraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
