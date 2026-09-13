import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/profil-gkpi",
    "/publikasi",
    "/toko",
    "/kontak",
    "/mitra",
    "/pengurus",
    "/wilayah-resort",
    "/laporan-keuangan",
    "/publikasi/departemen/diakonat",
    "/publikasi/departemen/apostolat",
    "/publikasi/departemen/pastorat",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  try {
    const { data: publications, error } = await supabase
      .from("publications")
      .select("id, updated_at, created_at, date")
      .order("date", { ascending: false })
      .limit(500);

    if (error || !publications) {
      return staticRoutes;
    }

    const publicationRoutes: MetadataRoute.Sitemap = publications.map((item) => {
      const dateStr = item.updated_at || item.created_at || item.date;
      const lastModified = dateStr ? new Date(dateStr) : new Date();

      return {
        url: `${SITE_URL}/publikasi/${item.id}`,
        lastModified: isNaN(lastModified.getTime()) ? new Date() : lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      };
    });

    return [...staticRoutes, ...publicationRoutes];
  } catch {
    return staticRoutes;
  }
}