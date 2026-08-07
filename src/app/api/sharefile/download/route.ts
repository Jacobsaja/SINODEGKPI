import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { slug, identifier, fileId } = await req.json();

    if (!slug || !identifier || !fileId) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const { data: folder } = await supabaseAdmin
      .from("share_folders")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (!folder || folder.status !== "published" || !folder.is_active) {
      return NextResponse.json({ error: "Folder tidak tersedia" }, { status: 403 });
    }

    // Server-side authorization check (Zero Trust)
    let accessId: string | null = null;
    const trimmed = String(identifier).trim();

    if (folder.access_mode === "email") {
      const normalized = trimmed.toLowerCase();
      const { data: access } = await supabaseAdmin
        .from("share_folder_access")
        .select("id")
        .eq("folder_id", folder.id)
        .ilike("email", normalized)
        .maybeSingle();
      if (!access) {
        return NextResponse.json({ error: "Tidak memiliki akses ke folder ini" }, { status: 403 });
      }
      accessId = access.id;
    } else {
      if (!folder.access_code || trimmed !== folder.access_code) {
        return NextResponse.json({ error: "Tidak memiliki akses ke folder ini" }, { status: 403 });
      }
    }

    const { data: file } = await supabaseAdmin
      .from("share_folder_files")
      .select("*")
      .eq("id", fileId)
      .eq("folder_id", folder.id)
      .maybeSingle();

    if (!file || !file.storage_path) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 404 });
    }

    const { data: signed, error: signError } = await supabaseAdmin.storage
      .from("sharefiles")
      .createSignedUrl(file.storage_path, 60, {
        download: file.original_filename ?? true,
      });

    if (signError || !signed) {
      return NextResponse.json({ error: "Gagal membuat link unduhan" }, { status: 500 });
    }

    await supabaseAdmin.from("share_folder_access_logs").insert({
      folder_id: folder.id,
      access_id: accessId,
      identifier: folder.access_mode === "email" ? trimmed.toLowerCase() : "kode registrasi",
      action: "download",
      file_id: file.id,
    });

    return NextResponse.json({ url: signed.signedUrl, filename: file.original_filename });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
