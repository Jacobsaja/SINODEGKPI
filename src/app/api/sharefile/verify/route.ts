import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Admin service role client for restricted RLS table queries
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { slug, identifier } = await req.json();

    if (!slug || typeof slug !== "string" || !identifier || typeof identifier !== "string") {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const { data: folder, error: folderError } = await supabaseAdmin
      .from("share_folders")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (folderError || !folder) {
      return NextResponse.json({ error: "Folder tidak ditemukan" }, { status: 404 });
    }

    if (folder.status !== "published" || !folder.is_active) {
      return NextResponse.json({ error: "Folder ini belum tersedia" }, { status: 403 });
    }

    let accessId: string | null = null;
    let displayName = "";
    const trimmed = identifier.trim();

    if (folder.access_mode === "email") {
      const normalized = trimmed.toLowerCase();
      const { data: access } = await supabaseAdmin
        .from("share_folder_access")
        .select("id, name, email")
        .eq("folder_id", folder.id)
        .ilike("email", normalized)
        .maybeSingle();

      if (!access) {
        return NextResponse.json(
          { error: "Email tidak terdaftar untuk folder ini" },
          { status: 403 }
        );
      }
      accessId = access.id;
      displayName = access.name;
    } else {
      if (!folder.access_code || trimmed !== folder.access_code) {
        return NextResponse.json({ error: "Kode registrasi salah" }, { status: 403 });
      }
    }

    const { data: files } = await supabaseAdmin
      .from("share_folder_files")
      .select("id, title, description, original_filename, file_type, sort_order")
      .eq("folder_id", folder.id)
      .order("sort_order", { ascending: true });

    // Audit log verification event
    await supabaseAdmin.from("share_folder_access_logs").insert({
      folder_id: folder.id,
      access_id: accessId,
      identifier: folder.access_mode === "email" ? trimmed.toLowerCase() : "kode registrasi",
      action: "verify",
    });

    return NextResponse.json({
      folder: { title: folder.title, description: folder.description },
      name: displayName,
      files: files ?? [],
    });
  } catch {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
