# 16 — Changelog

Semua perubahan besar pada proyek GKPI Sinode Website didokumentasikan di sini.

Format yang digunakan berbasis [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), dan proyek ini belum menganut *Semantic Versioning* ketat, namun perubahan dicatat per fase/waktu rilis.

---

## [Unreleased] - September 2026

### Added (Ditambahkan)
- **Security Headers di `src/proxy.ts`**:
  - `X-Content-Type-Options: nosniff` (mencegah browser mengeksekusi file upload sebagai script MIME lain).
  - `Referrer-Policy: strict-origin-when-cross-origin` (melindungi kerahasiaan URL rute saat pengunjung membuka tautan luar).
  - `X-Frame-Options: DENY` (mencegah web GKPI di-embed ke dalam iframe jahat/clickjacking).
- **Vercel Analytics CSP**: Mengizinkan endpoint `https://vitals.vercel-insights.com` pada `connect-src` di `src/proxy.ts` agar data web vitals tercatat akurat.
- **Dynamic Sitemap (`src/app/sitemap.ts`)**:
  - Mengubah generasi `sitemap.xml` menjadi dinamis (*async*) dengan mengambil data artikel publikasi dari Supabase secara otomatis (hingga 500 artikel terbaru) beserta tanggal modifikasi `lastModified`.
  - Mendaftarkan rute departemen (`/publikasi/departemen/diakonat`, `/apostolat`, `/pastorat`) ke dalam sitemap untuk pengindeksan Google.
  - Dilengkapi *graceful error handling* jika koneksi database gagal, sitemap tetap menyajikan rute statis tanpa merusak build.
- **Konfigurasi Domain Terpusat**: Modul `src/lib/site-config.ts` untuk mengelola `NEXT_PUBLIC_SITE_URL` secara dinamis dengan fallback `https://sinodegkpi.vercel.app` (dipakai di metadata layout, `sitemap.ts`, dan `robots.ts`).

### Changed (Diubah)
- **Modern Custom Dropdown UI (Publikasi, Toko, Laporan Keuangan, Sharefiles)**:
  - Mengganti seluruh elemen native `<select>` browser di Admin Publikasi, Admin Toko, Admin Laporan Keuangan, Laporan Keuangan Publik, serta Admin Sharefiles (Daftar & Detail Folder) dengan komponen dropdown kustom berbasis React & Framer Motion.
  - Tampilan dropdown konsisten dengan tema desain aplikasi (glassmorphism/surface, rounded-xl, animasi halus scale/fade saat buka-tutup, indikator panah rotasi `ChevronDown`, dan *click-outside overlay*).
- **Edge CDN Caching (ISR) di Beranda (`src/app/page.tsx`)**:
  - Menambahkan `export const revalidate = 300` agar halaman Beranda di-cache oleh Vercel Edge CDN selama 5 menit. Mencegah jeda *cold start* serverless dan menjaga FCP/TTFB tetap instan (< 50 ms) tanpa membebani Supabase.
- **Komponen Gambar Toko & Admin**:
  - Migrasi seluruh tag HTML `<img>` di `src/app/toko/page.tsx` dan logo `src/app/admin/layout.tsx` menjadi Next.js `<Image />` dengan atribut `sizes`, `fill`, dan `loading="lazy"`.
- **Hero Image LCP & Bandwidth Optimization**:
  - Menghapus atribut `loading` yang berkonflik dengan `priority` di `src/components/Hero.tsx` untuk menghilangkan warning LCP di Next.js.
  - Menunda preloading slide ke-2 selama 2,5 detik di `Hero.tsx` agar 100% bandwidth awal difokuskan hanya untuk memuat slide pertama (LCP), tanpa menggunakan kuota Vercel Image Optimization sama sekali (`unoptimized: true` tetap terjaga).
- **Mars GKPI Audio Bandwidth Optimization**:
  - Menambahkan `preload="none"` pada elemen `<audio>` di `src/app/profil-gkpi/page.tsx` untuk menghemat kuota data seluler pengunjung dan bandwidth hosting (2.75 MB hanya dimuat saat tombol Play ditekan).
- **Konfigurasi `next.config.ts`**:
  - Merapikan opsi `images` dengan `unoptimized: true` (memastikan pemakaian Vercel Image Optimization 0 kuota / 100% aman free tier) serta membersihkan properti yang tidak terpakai.
- **Refactor React 19 & ESLint Clean-up (0 Errors, 0 Warnings)**:
  - Mengubah `BookmarkButton.tsx` menggunakan `useSyncExternalStore` untuk sinkronisasi `localStorage` tanpa re-render berantai.
  - Memperbaiki sinkronisasi tab admin (`toko`, `publikasi`, `laporan-keuangan`) berbasis query param `useSearchParams` tanpa `setState` sinkron di dalam `useEffect`.
  - Mengamankan fungsi `startEdit` dengan `useCallback` di `admin/publikasi` dan `admin/laporan-keuangan` untuk menghilangkan seluruh peringatan `react-hooks/exhaustive-deps`.
  - Mengamankan data fetch async dengan `ignore` flag di `admin/jemaat`, `admin/pengurus`, `admin/kontak`, dan `admin/sharefiles`.
  - Menghapus import dan ikon yang tidak terpakai di berbagai komponen.

### Fixed (Diperbaiki)
- **Aset 404 (Missing Asset)**: Mengarahkan `heroPublikasi` yang hilang ke `/hero-bg.webp` pada `src/lib/assets.ts` sehingga halaman pengurus dan mitra tidak lagi menghasilkan error 404.
- **React Immobility / Safe Download**: Menghindari mutasi langsung `window.location.href` di `src/app/gkpi/sharefile/[slug]/page.tsx` dengan trigger download via anchor elemen dinamis.

---

## [Versi 1.0.0] - Juli 2026

Rilis perdana (MVP) website resmi GKPI Sinode.

### Added (Ditambahkan)
- **Halaman Publik**:
  - Halaman Beranda dengan Hero Slideshow dinamis.
  - Halaman Profil GKPI (Sejarah, Visi, Misi).
  - Peta Interaktif (Leaflet) Wilayah dan Resort dengan fitur cari gereja terdekat.
  - Halaman Direktori Pengurus Sinode.
  - Daftar dan Detail Publikasi (Renungan, Berita, Pengumuman, Kegiatan).
  - Halaman Produk/Toko GKPI dengan integrasi link Shopee dan Tokopedia.
  - Daftar Laporan Keuangan publik.
  - Halaman Mitra Pelayanan.
  - Formulir Kontak.

- **Admin Panel**:
  - Autentikasi Admin via Supabase (Email/Password).
  - Dasbor dengan ringkasan data.
  - CRUD Publikasi (Tambah, Edit, Hapus, Upload Gambar/Dokumen).
  - CRUD Produk Toko.
  - CRUD Pengurus (Manajemen struktur multi-level: Seksi > Grup > Anggota).
  - CRUD Data Jemaat (beserta foto dan koordinat).
  - Manajemen Pesan Kontak.
  - Manajemen Dokumen Laporan Keuangan.
  - Share Files: Folder berbagi terlindungi password/email via API Route.

- **Sistem & Desain**:
  - Implementasi Next.js 16 (App Router).
  - Styling lengkap menggunakan Tailwind CSS v4 `@theme`.
  - Sistem kompresi gambar otomatis sebelum diunggah ke Storage.
  - Basis Data PostgreSQL dan Supabase Storage.
  - Integrasi Framer Motion untuk animasi scroll.
  - Optimisasi SEO (Sitemap & Open Graph).

---

## Tentang Changelog

Untuk memudahkan pelacakan, setiap kali fitur baru dirilis ke _production_ (Vercel `main` branch), harap perbarui file ini dengan mencatat apa yang ditambahkan, diubah, atau dihapus. Gunakan format standar:
- **Added**: Fitur baru
- **Changed**: Perubahan fitur yang sudah ada
- **Deprecated**: Fitur yang akan dihapus di rilis mendatang
- **Removed**: Fitur yang dihapus
- **Fixed**: Perbaikan bug
- **Security**: Peningkatan keamanan
