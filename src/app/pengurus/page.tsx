import { getAllSeksi } from "@/lib/pengurus";
import PengurusClient from "./PengurusClient";

export const dynamic = "force-dynamic";

export default async function PengurusPage() {
  const seksiList = await getAllSeksi();

  return <PengurusClient seksiList={seksiList} />;
}
