# 15 — Panduan Kontributor

## Selamat Datang!

Dokumen ini berisi panduan bagi Anda yang ingin berkontribusi pada pengembangan dan pemeliharaan website resmi GKPI Sinode.

Kontribusi dapat berupa:
- Penambahan fitur baru
- Perbaikan bug (bug fixing)
- Peningkatan desain antarmuka (UI/UX)
- Optimalisasi performa
- Pembaruan dokumentasi

---

## Syarat Prasyarat

Sebelum mulai berkontribusi, pastikan Anda memahami dan telah menginstal alat bantu berikut:
- **Node.js** (versi 18 ke atas)
- **Git**
- **VS Code** (atau editor kode modern lainnya)
- Pemahaman dasar tentang **React** dan **Next.js**
- Pemahaman dasar tentang **Tailwind CSS**
- Akses ke repository (dari Tim IT GKPI)

---

## Standar Kode (Coding Standards)

Untuk menjaga kualitas dan keterbacaan kode (codebase), harap ikuti panduan berikut:

### 1. TypeScript
Semua file kode menggunakan TypeScript (`.ts` atau `.tsx`). Pastikan tidak ada peringatan atau error dari TypeScript sebelum melakukan commit. Definisikan `interface` atau `type` untuk semua struktur data. Jangan gunakan `any` sebisa mungkin.

### 2. Penamaan Komponen dan File
- **Komponen React (Client/Server)**: Gunakan PascalCase (contoh: `Navbar.tsx`, `ChurchDetailPanel.tsx`).
- **File Library/Utilitas**: Gunakan kebab-case (contoh: `image-compress.ts`, `publikasi-upload.ts`).
- **File Konfigurasi**: Ikuti standar bawaan (contoh: `next.config.ts`, `tailwind.config.ts`).

### 3. Server Components vs Client Components
Sesuai pola Next.js App Router:
- **Default**: Gunakan Server Components (tidak perlu anotasi di awal file). Cocok untuk komponen yang hanya merender data, teks, tata letak. Server component bisa dibuat `async` untuk memanggil database langsung.
- **Client Components**: Tambahkan `"use client";` di baris paling atas jika komponen membutuhkan state (`useState`), efek (`useEffect`), DOM interaktif, event click (`onClick`), atau library khusus sisi klien.

### 4. Tailwind CSS @theme
Proyek ini menggunakan Tailwind CSS v4. Kami **tidak** menggunakan `tailwind.config.js`. Semua konfigurasi gaya (token warna, font, animasi) berada di dalam `src/app/globals.css` menggunakan struktur `@theme`. Jika Anda perlu menambahkan warna baru, tambahkan variabel baru di `@theme`.

### 5. Hindari "Inline Styling"
Usahakan semua gaya diatur menggunakan kelas (utility classes) dari Tailwind CSS. Jangan gunakan atribut `style={{ ... }}` pada elemen, kecuali untuk nilai dinamis yang tidak dapat diatur Tailwind.

---

## Panduan Modifikasi UI/UX

1. Pastikan Anda merujuk pada [docs/09-Design-System.md](09-Design-System.md) untuk pedoman warna dan spasi.
2. Usahakan untuk mempertahankan konsistensi margin, padding, radius sudut (`rounded-2xl`), dan ketebalan garis batas (`border`).
3. Selalu periksa tampilan aplikasi pada layar mobile (smartphone) dan desktop, karena kami menganut prinsip *responsive design*.

---

## Langkah-langkah Memulai Pekerjaan

1. Klon repository ke komputer lokal:
   ```bash
   git clone <URL_REPOSITORY>
   cd PROGRAM
   ```
2. Instal semua package (dependensi):
   ```bash
   npm install
   ```
3. Siapkan file `.env.local` (lihat dokumen [13-Environment.md](13-Environment.md)). Anda mungkin perlu meminta kunci *Supabase environment* dari admin/lead proyek.
4. Jalankan aplikasi lokal:
   ```bash
   npm run dev
   ```
5. Akses di browser pada `http://localhost:3000`.
6. Ikuti panduan pembuatan branch dan komit di [14-Git-Workflow.md](14-Git-Workflow.md).

---

## Bantuan / Bertanya

Jika Anda menemui kebuntuan (blocker), jangan ragu untuk berdiskusi dengan tim pengembangan melalui channel komunikasi internal (misal: grup WhatsApp, Telegram, atau issue tracker repository).
