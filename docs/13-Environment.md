# 13 — Environment

## Variabel Lingkungan

Proyek ini menggunakan file `.env.local` untuk menyimpan konfigurasi yang sensitif dan spesifik untuk environment lokal. File ini diabaikan oleh Git (via `.gitignore`) agar kunci rahasia tidak bocor.

---

## File `.env.local`

Buat file bernama `.env.local` di root proyek (sejajar dengan `package.json`) dengan isi berikut:

```env
# URL API dari project Supabase Anda
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co

# Kunci anon (publik) untuk akses client-side ke database yang dilindungi RLS
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Kunci service role (TIDAK BOLEH DISEBARLUASKAN). Hanya dipakai di server-side.
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Penjelasan Variabel

| Nama Variabel | Cakupan | Keterangan |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Browser & Server | URL endpoint REST API Supabase. Semua route client menggunakannya via file `src/lib/supabase.ts`. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser & Server | Kunci anonim (public) Supabase. Digunakan oleh browser untuk read operasi dengan pengamanan RLS. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server Saja | Kunci "bypass RLS" dengan akses penuh ke Supabase. Hanya digunakan di Next.js API Routes (`/api/sharefile/*`). |

> ⚠️ **Peringatan Keamanan**: Variabel yang dimulai dengan `NEXT_PUBLIC_` disertakan ke dalam bundel JavaScript yang dikirim ke browser. **JANGAN PERNAH** menambahkan awalan `NEXT_PUBLIC_` pada `SUPABASE_SERVICE_ROLE_KEY`.

---

## Environment Variables di Vercel

Saat deploy ke production (Vercel), pastikan Anda menambahkan ketiga variabel di atas di pengaturan proyek Vercel:

1. Buka dashboard Vercel
2. Masuk ke proyek `sinodegkpi`
3. Ke menu **Settings** > **Environment Variables**
4. Tambahkan `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, dan `SUPABASE_SERVICE_ROLE_KEY` (dengan nilai yang tepat dari Supabase production).

---

## Tabel Database yang Dibutuhkan

Aplikasi ini mengharapkan tabel Supabase berikut ada:

1. `publications`
2. `products`
3. `pengurus_seksi`
4. `pengurus_grup`
5. `pengurus_anggota`
6. `jemaat`
7. `financial_reports`
8. `contact_messages`
9. `share_folders` (diperkirakan)
10. `share_folder_files` (diperkirakan)

Serta bucket Storage berikut:
1. `publications`
2. `pengurus`
3. `jemaat-photos`
4. `financial-reports`

*Catatan: Pastikan kebijakan Row Level Security (RLS) diatur dengan benar di dashboard Supabase agar admin (pengguna yang sudah login) bisa write dan publik bisa read.*
