import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const audioUrl = searchParams.get("url");

  if (!audioUrl) {
    return new NextResponse("Missing audio URL", { status: 400 });
  }

  // Hanya izinkan domain Supabase proyek Sinode GKPI
  const allowedPrefix = "https://cpzplvifayzyihjzecdp.supabase.co/storage/v1/object/public/publications/";
  if (!audioUrl.startsWith(allowedPrefix)) {
    return new NextResponse("Forbidden audio origin", { status: 403 });
  }

  const range = req.headers.get("range");
  const fetchHeaders: Record<string, string> = {};
  if (range) {
    fetchHeaders["Range"] = range;
  }

  try {
    const upstreamRes = await fetch(audioUrl, {
      headers: fetchHeaders,
      cache: "no-store",
    });

    const responseHeaders = new Headers();
    responseHeaders.set(
      "Content-Type",
      upstreamRes.headers.get("Content-Type") || "audio/mpeg"
    );
    responseHeaders.set("Accept-Ranges", "bytes");
    responseHeaders.set("Access-Control-Allow-Origin", "*");
    responseHeaders.set("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");

    const contentRange = upstreamRes.headers.get("Content-Range");
    if (contentRange) {
      responseHeaders.set("Content-Range", contentRange);
    }

    const contentLength = upstreamRes.headers.get("Content-Length");
    if (contentLength) {
      responseHeaders.set("Content-Length", contentLength);
    }

    return new NextResponse(upstreamRes.body, {
      status: upstreamRes.status,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error("Audio stream proxy error:", err);
    return new NextResponse("Failed to stream audio", { status: 502 });
  }
}
