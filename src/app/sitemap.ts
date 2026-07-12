import type { MetadataRoute } from "next";

const BASE_URL = "https://sinodegkpi.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/profil-gkpi",
    "/publikasi",
    "/toko",
    "/kontak",
    "/mitra",
    "/pengurus",
    "/wilayah-resort",
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return staticRoutes;
}