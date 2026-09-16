export const assets = {
  logo: "/logo.webp",
  heroBg: "/sinode_GKPI.webp",
  heroKontak: "/kontak.webp",
  heroPublikasi: "/Publikasi.webp",
  heroToko: "/sinode_GKPI.webp",
  heroMitra: "/partnership.webp",
  aboutImg: "/about_us.webp",
  slide1: "/sinode_GKPI.webp",
  slide2: "/gereja_terdekat.webp",
  slide3: "/read_devotion.webp",
  slide4: "/kontak.webp",
  slide5: "/Publikasi.webp",
  slide6: "/visi-misi.webp",
  slide7: "/partnership.webp",
  slide8: "/Profil.webp",
  resortHeroBg: "/gereja_terdekat.webp",
  rules: "/Rules.webp",
} as const;

export type AssetKey = keyof typeof assets;
