import { NextResponse } from "next/server";
import { cleanupExpiredDevotions } from "@/lib/publikasi-cleanup";

export const dynamic = "force-dynamic";

/**
 * Endpoint API untuk membersihkan renungan harian yang usianya > 30 hari
 * beserta file media (audio, foto, dokumen) di Supabase Storage.
 * 
 * Dapat dipanggil via cron job eksternal (misal Vercel Cron, Supabase Webhook, atau cURL).
 */
export async function GET() {
  try {
    const result = await cleanupExpiredDevotions(30);
    return NextResponse.json({
      success: !result.error,
      timestamp: new Date().toISOString(),
      ...result,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST() {
  return GET();
}
