import { NextRequest, NextResponse } from "next/server";

// Next.js 16: konvensi "middleware.ts" sudah deprecated, diganti "proxy.ts"
// dengan fungsi bernama `proxy` (bukan lagi `middleware`). Logic-nya sama
// persis, cuma nama file & nama fungsi export yang berubah.
//
// CATATAN PENTING soal desain CSP di file ini:
// Awalnya dicoba pakai CSP nonce + 'strict-dynamic' (best practice paling
// ketat), tapi itu MENGHARUSKAN semua halaman di-render dinamis per-request.
// Situs ini sebagian besar statis (SSG) untuk performa terbaik, jadi nonce
// per-request tidak sinkron dengan HTML yang sudah "dibekukan" saat build —
// akibatnya semua script (termasuk script internal Next.js) ikut diblokir.
//
// Solusinya: pakai pendekatan 'self' + 'unsafe-inline' yang direkomendasikan
// resmi oleh Next.js untuk aplikasi yang tidak butuh nonce. Ini tetap
// memblokir script dari domain asing/pihak ketiga (proteksi utama yang kita
// butuhkan), sambil tetap kompatibel dengan static generation.
export function proxy(request: NextRequest) {
  // ── Ganti NEXT_PUBLIC_SUPABASE_URL sesuai domain project Supabase kamu ──
  // Dipakai di connect-src supaya fetch/realtime ke Supabase tidak diblokir CSP.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseOrigin = supabaseUrl ? new URL(supabaseUrl).origin : "";
  const supabaseWs = supabaseOrigin.replace(/^http/, "ws");

  // React di mode development butuh 'unsafe-eval' untuk fitur debugging
  // (rekonstruksi call stack, dll). Production build TIDAK butuh ini sama
  // sekali — jadi kita izinkan cuma pas development, tetap ketat di production.
  const isDev = process.env.NODE_ENV === "development";

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self' data:;
    connect-src 'self' ${supabaseOrigin} ${supabaseWs};
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `;

  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, " ")
    .trim();

  const response = NextResponse.next();

  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue
  );

  // Permissions-Policy: kontrol browser API mana yang boleh dipakai situs ini.
  // - geolocation=(self): DIIZINKAN, dipakai fitur NearestChurchFinder
  //   (cari gereja terdekat) di src/components/wilayah/NearestChurchFinder.tsx
  // - Semua API lain yang tidak dipakai di project ini di-disable eksplisit
  //   untuk mengurangi permukaan serangan (defense in depth).
  response.headers.set(
    "Permissions-Policy",
    [
      "geolocation=(self)",
      "camera=()",
      "microphone=()",
      "payment=()",
      "usb=()",
      "magnetometer=()",
      "gyroscope=()",
      "accelerometer=()",
    ].join(", ")
  );

  // Cegah Google & search engine lain nge-index halaman admin.
  // Ditaruh di sini (bukan lewat `export const metadata` di admin/layout.tsx)
  // karena admin/layout.tsx adalah "use client" component, dan Next.js tidak
  // mengizinkan export metadata dari client component.
  if (request.nextUrl.pathname.startsWith("/admin")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Terapkan ke semua route KECUALI:
     * - api routes (kalau ada, biar tidak kena header ini)
     * - static files Next.js (_next/static, _next/image)
     * - favicon
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};