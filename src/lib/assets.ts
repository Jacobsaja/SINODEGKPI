export const assets = {
  logo: "/logo.webp",
  heroBg: "/hero-bg.webp",
  heroKontak: "/hero-bg.webp",
  heroPublikasi: "/hero-bg.webp",
  heroToko: "/hero-bg.webp",
  aboutImg: "/hero_slide_1.webp",
  slide1: "/hero_slide_1.webp",
  slide2: "/hero_slide_2.webp",
  slide3: "/hero_slide_3.webp",
  slide4: "/hero_slide_4.webp",
  slide5: "/hero_slide_1.webp",
  slide6: "/hero_slide_2.webp",
  slide7: "/hero_slide_3.webp",
  resortHeroBg: "/resort-hero-bg.webp",
} as const;

export type AssetKey = keyof typeof assets;
