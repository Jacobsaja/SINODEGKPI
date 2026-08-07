import { NextRequest, NextResponse } from "next/server";

// Next.js 16 Proxy Middleware for Security Headers (CSP & Permissions Policy)
export function proxy(request: NextRequest) {
  // Supabase WebSocket & HTTP origins for CSP connect-src
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseOrigin = supabaseUrl ? new URL(supabaseUrl).origin : "";
  const supabaseWs = supabaseOrigin.replace(/^http/, "ws");

  // Allow eval in dev mode for HMR & stack trace debugging
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

  // Hardened Browser API Permissions Policy (Defense in depth)
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

  // Prevent indexing on admin routes
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