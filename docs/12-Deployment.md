# 12 — Deployment

## Platform Deployment

Website GKPI Sinode di-deploy menggunakan **[Vercel](https://vercel.com/)**, platform hosting resmi dari tim Next.js.

- **URL Produksi**: `https://sinodegkpi.vercel.app`
- **Framework yang Dideteksi**: Next.js (auto-detected oleh Vercel)

---

## Konfigurasi Next.js untuk Produksi

File `next.config.ts` berisi konfigurasi yang relevan untuk deployment:

```typescript
const nextConfig: NextConfig = {
  devIndicators: false,           // Sembunyikan indikator dev di production
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cpzplvifayzyihjzecdp.supabase.co",  // Supabase Storage
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "gkpisinode.org",                      // WordPress lama
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};
```

Konfigurasi `remotePatterns` memungkinkan komponen `<Image>` Next.js untuk mengoptimasi gambar dari domain Supabase.

---

## Proses Deployment

### Deployment Otomatis (Rekomendasi)

1. **Koneksikan repository** ke project Vercel
2. **Konfigurasi environment variables** di Vercel Dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. **Push ke branch produksi** (biasanya `main`) → Vercel otomatis build dan deploy

### Deployment Manual

Jika diperlukan, deploy manual bisa dilakukan menggunakan Vercel CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Login ke akun Vercel
vercel login

# Deploy ke production
vercel --prod
```

---

## Build Command

Vercel menjalankan perintah build berikut secara otomatis:

```bash
next build
```

Build ini menghasilkan:
- Server Components yang dirender di edge/server
- Static pages untuk halaman yang bisa di-pre-render
- Optimisasi otomatis gambar, JavaScript, dan CSS

---

## Environment Variables di Vercel

Di Vercel Dashboard, variabel lingkungan dikonfigurasi di:
**Project Settings → Environment Variables**

| Variable | Environment |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview (JANGAN di Development jika tidak aman) |

> ⚠️ **Penting**: Variabel yang diawali `NEXT_PUBLIC_` akan terekspos ke browser. Pastikan `SUPABASE_SERVICE_ROLE_KEY` **tidak** diawali `NEXT_PUBLIC_`.

---

## Sitemap & Robots

Website ini meng-generate `sitemap.xml` dan `robots.txt` secara otomatis:

**`src/app/sitemap.ts`** menghasilkan `/sitemap.xml`:
```
https://sinodegkpi.vercel.app/
https://sinodegkpi.vercel.app/profil-gkpi
https://sinodegkpi.vercel.app/publikasi
https://sinodegkpi.vercel.app/toko
https://sinodegkpi.vercel.app/kontak
https://sinodegkpi.vercel.app/mitra
https://sinodegkpi.vercel.app/pengurus
https://sinodegkpi.vercel.app/wilayah-resort
https://sinodegkpi.vercel.app/laporan-keuangan
```

**`src/app/robots.ts`** menghasilkan `/robots.txt` yang memungkinkan semua crawler mengindeks semua halaman publik.

---

## Domain Kustom

Saat ini, website menggunakan domain Vercel default (`sinodegkpi.vercel.app`). Untuk menggunakan domain kustom (misalnya `sinodegkpi.or.id`):

1. Beli domain dari registrar (Niagahoster, Namecheap, dll.)
2. Di Vercel Dashboard: **Project Settings → Domains → Add**
3. Tambahkan CNAME record di DNS yang mengarah ke Vercel
4. Tunggu propagasi DNS (biasanya 24-48 jam)
5. Vercel akan otomatis mengonfigurasi SSL/TLS (HTTPS)

---

## Metadata Base URL

URL produksi dikonfigurasi di `src/app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  metadataBase: new URL("https://sinodegkpi.vercel.app"),
  // ...
};
```

Jika domain kustom digunakan, nilai ini perlu diperbarui.

---

## Monitoring & Logs

Vercel menyediakan:
- **Function Logs**: Log dari Server Components dan API Routes
- **Build Logs**: Output proses build
- **Analytics**: Traffic dasar (jika diaktifkan)
- **Real-time Logs**: Di Vercel Dashboard → Deployments → Functions

---

## Rollback Deployment

Jika ada masalah setelah deployment:
1. Buka Vercel Dashboard → Deployments
2. Temukan deployment sebelumnya yang berfungsi
3. Klik **"Promote to Production"** untuk rollback instan

---

## Checklist Sebelum Deploy ke Produksi

- [ ] Environment variables sudah dikonfigurasi di Vercel
- [ ] Build berhasil secara lokal (`npm run build`)
- [ ] Tidak ada error TypeScript (`npx tsc --noEmit`)
- [ ] ESLint tidak menunjukkan error kritis (`npm run lint`)
- [ ] Supabase RLS policies sudah dikonfigurasi dengan benar
- [ ] URL produksi di `layout.tsx` dan `sitemap.ts` sudah benar
