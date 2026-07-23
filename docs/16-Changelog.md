# 16 — Changelog

Semua perubahan besar pada proyek GKPI Sinode Website didokumentasikan di sini.

Format yang digunakan berbasis [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), dan proyek ini belum menganut *Semantic Versioning* ketat, namun perubahan dicatat per fase/waktu rilis.

---

## [Unreleased]

Bagian ini untuk mencatat fitur yang sedang dalam tahap pengembangan atau perubahan kecil sebelum dirilis ke versi stabil berikutnya.

### Added (Ditambahkan)
- *Belum ada fitur baru yang sedang ditambahkan.*

### Fixed (Diperbaiki)
- *Belum ada bug yang diperbaiki di tahap unreleased.*

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
