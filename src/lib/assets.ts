export const assets = {
  logo: "/logo.png",
  heroBg: "/hero-bg.png",
  slide1: "/hero_slide_1.jpg",
  slide2: "/hero_slide_2.jpg",
  slide3: "/hero_slide_3.png",
  slide4: "/hero_slide_4.png",
  slide5: "/hero_slide_5.png",
  slide6: "/hero_slide_6.png",
  slide7: "/hero_slide_7.png",
  aboutImg: "/hero-bg.png",
} as const;

export type AssetKey = keyof typeof assets;
