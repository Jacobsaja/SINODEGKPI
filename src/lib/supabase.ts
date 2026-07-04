import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase env vars belum diset. Tambahkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local"
  );
}

// Client tunggal, dipakai baik di server component maupun client component
// untuk request publik (read) dan, setelah login, untuk request admin (write).
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
