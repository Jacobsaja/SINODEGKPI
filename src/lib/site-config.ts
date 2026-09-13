/**
 * Konfigurasi Global Situs GKPI Sinode
 * 
 * Saat domain resmi (.or.id / .org) sudah aktif:
 * Cukup set environment variable NEXT_PUBLIC_SITE_URL di Vercel Dashboard
 * (misalnya: https://gkpi.or.id) tanpa perlu mengubah kode sumber di banyak file.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  "https://sinodegkpi.vercel.app"
).replace(/\/$/, "");
