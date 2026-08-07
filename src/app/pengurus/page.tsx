import { getAllSeksi } from "@/lib/pengurus";
import PengurusClient from "./PengurusClient";

export const revalidate = 3600; // Cache Edge CDN 1 jam

export default async function PengurusPage() {
  const seksiList = await getAllSeksi();

  return <PengurusClient seksiList={seksiList} />;
}
