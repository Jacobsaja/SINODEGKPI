# 04 — Struktur Proyek

## Penjelasan Umum

Proyek ini mengikuti konvensi folder standar Next.js App Router. Semua source code berada di dalam folder `src/`, dan aset statis berada di `public/`.

---

## Struktur Lengkap

```
PROGRAM/
│
├── .env.local                      # Variabel lingkungan lokal (TIDAK di-commit ke git)
├── .env                            # Variabel lingkungan default (biasanya kosong atau template)
├── .gitignore                      # File dan folder yang diabaikan oleh Git
├── .vscode/                        # Konfigurasi editor VS Code (opsional)
├── AGENTS.md                       # Instruksi khusus untuk AI coding agent
├── CLAUDE.md                       # Konfigurasi Claude AI (jika digunakan)
├── README.md                       # Dokumentasi utama proyek (English)
│
├── next.config.ts                  # Konfigurasi Next.js
├── tsconfig.json                   # Konfigurasi TypeScript
├── postcss.config.mjs              # Konfigurasi PostCSS + Tailwind CSS
├── eslint.config.mjs               # Konfigurasi ESLint
├── package.json                    # Dependensi npm dan skrip
├── package-lock.json               # Lock file dependensi (jangan diubah manual)
│
├── public/                         # Aset statis (diakses langsung oleh browser)
│   ├── logo.png                    # Logo GKPI
│   ├── hero-bg.png                 # Background gambar "Tentang Kami"
│   ├── hero_slide_1.png            # Slide hero 1
│   ├── hero_slide_2.png            # Slide hero 2
│   ├── hero_slide_3.png            # Slide hero 3
│   ├── hero_slide_4.png            # Slide hero 4
│   ├── resort-hero-bg.png          # Background halaman Wilayah & Resort
│   └── mitra/                      # Folder logo mitra pelayanan
│       ├── desain/                 # Subfolder logo mitra (versi desain)
│       │   ├── abdi-sabda.png
│       │   ├── CCA.png
│       │   ├── ELCA.png
│       │   └── ... (14 mitra total)
│       └── Logo_GKPI.png           # Dipakai di halaman admin login
│
├── docs/                           # Dokumentasi proyek (Bahasa Indonesia)
│   ├── 01-Gambaran-Proyek.md
│   ├── 02-Tujuan-Proyek.md
│   └── ...
│
└── src/                            # Source code utama
    │
    ├── app/                        # Next.js App Router
    │   ├── layout.tsx              # Root layout global (metadata, font, body class)
    │   ├── page.tsx                # Halaman Beranda (/)
    │   ├── globals.css             # Stylesheet global + Tailwind @theme tokens
    │   ├── icon.png                # Favicon (salinan logo.png)
    │   ├── sitemap.ts              # Generator sitemap.xml otomatis
    │   ├── robots.ts               # Generator robots.txt otomatis
    │   │
    │   ├── profil-gkpi/            # Halaman /profil-gkpi
    │   │   └── page.tsx
    │   │
    │   ├── pengurus/               # Halaman /pengurus
    │   │   └── page.tsx
    │   │
    │   ├── wilayah-resort/         # Halaman /wilayah-resort (peta interaktif)
    │   │   └── page.tsx
    │   │
    │   ├── publikasi/              # Halaman /publikasi
    │   │   ├── page.tsx            # Daftar publikasi
    │   │   └── [id]/               # Halaman detail publikasi
    │   │       └── page.tsx
    │   │
    │   ├── toko/                   # Halaman /toko (katalog produk)
    │   │   └── page.tsx
    │   │
    │   ├── mitra/                  # Halaman /mitra (mitra pelayanan)
    │   │   └── page.tsx
    │   │
    │   ├── kontak/                 # Halaman /kontak
    │   │   └── page.tsx
    │   │
    │   ├── laporan-keuangan/       # Halaman /laporan-keuangan
    │   │   └── page.tsx
    │   │
    │   ├── info/                   # Halaman /info (redirect/alias)
    │   │   └── page.tsx
    │   │
    │   ├── gkpi/                   # Halaman /gkpi (legacy/alias)
    │   │   └── page.tsx
    │   │
    │   ├── tentang-gkpi/           # Halaman /tentang-gkpi
    │   │   └── page.tsx
    │   │
    │   ├── api/                    # API Routes (server-side endpoints)
    │   │   └── sharefile/
    │   │       ├── download/       # /api/sharefile/download — unduh file
    │   │       │   └── route.ts
    │   │       └── verify/         # /api/sharefile/verify — verifikasi akses
    │   │           └── route.ts
    │   │
    │   └── admin/                  # Rute admin panel (dilindungi auth)
    │       ├── layout.tsx          # Layout admin: auth gate + sidebar
    │       ├── page.tsx            # Dashboard admin
    │       ├── publikasi/          # Kelola publikasi
    │       │   └── page.tsx
    │       ├── toko/               # Kelola produk toko
    │       │   └── page.tsx
    │       ├── pengurus/           # Kelola struktur pengurus
    │       │   └── page.tsx
    │       ├── jemaat/             # Kelola data jemaat
    │       │   └── page.tsx
    │       ├── kontak/             # Kelola pesan masuk
    │       │   └── page.tsx
    │       ├── laporan-keuangan/   # Kelola laporan keuangan
    │       │   └── page.tsx
    │       └── sharefiles/         # Kelola folder berbagi file
    │           └── page.tsx
    │
    ├── components/                 # Komponen React yang dapat digunakan ulang
    │   │
    │   ├── Navbar.tsx              # Navigasi utama (transparan → solid saat scroll)
    │   ├── Hero.tsx                # Slideshow hero halaman beranda
    │   ├── Footer.tsx              # Footer global
    │   ├── Section.tsx             # Wrapper section dengan heading dan background opsional
    │   ├── Card.tsx                # Kartu artikel publikasi
    │   ├── ScrollReveal.tsx        # Wrapper animasi scroll reveal (Framer Motion)
    │   ├── InfoSlideshow.tsx       # Slideshow info pada halaman beranda
    │   ├── InfoCarousel.tsx        # Carousel info alternatif
    │   ├── ResortHero.tsx          # Hero section halaman Wilayah & Resort
    │   ├── PengurusModal.tsx       # Modal detail anggota pengurus
    │   ├── ProductCard.tsx         # Kartu produk toko
    │   │
    │   ├── admin/                  # Komponen khusus admin panel
    │   │   ├── AdminSidebar.tsx    # Sidebar navigasi admin
    │   │   └── jemaat/
    │   │       └── JemaatFormModal.tsx  # Form modal tambah/edit jemaat
    │   │
    │   ├── publikasi/              # Komponen khusus halaman publikasi
    │   │   ├── CopyLinkButton.tsx  # Tombol salin link publikasi
    │   │   └── GalleryLightbox.tsx # Lightbox galeri foto publikasi
    │   │
    │   └── wilayah/                # Komponen peta & pencarian gereja
    │       ├── MapExplorer.tsx     # Orkestrator utama peta + panel
    │       ├── MapView.tsx         # Komponen peta Leaflet (SSR dinonaktifkan)
    │       ├── ChurchListPanel.tsx # Panel daftar gereja (kiri/bawah)
    │       ├── ChurchListItem.tsx  # Item individual dalam daftar gereja
    │       ├── ChurchDetailPanel.tsx # Panel detail gereja yang dipilih
    │       ├── NearestChurchFinder.tsx # Bar pencari gereja terdekat (GPS)
    │       └── SearchFilterBar.tsx # Bar pencarian + filter kota
    │
    ├── lib/                        # Lapisan utilitas dan akses data
    │   ├── supabase.ts             # Instance Supabase client (singleton)
    │   ├── types.ts                # Definisi tipe TypeScript bersama
    │   ├── assets.ts               # Konstanta path aset statis
    │   ├── publications.ts         # Fungsi CRUD + formatter publikasi
    │   ├── products.ts             # Fungsi CRUD + formatter produk
    │   ├── pengurus.ts             # Fungsi CRUD + tipe pengurus
    │   ├── laporan-keuangan.ts     # Fungsi CRUD + helper laporan keuangan
    │   ├── publikasi-upload.ts     # Helper upload gambar & dokumen publikasi
    │   ├── image-compress.ts       # Preset kompresi gambar browser
    │   ├── haversine.ts            # Kalkulator jarak geolokasi (rumus haversine)
    │   └── sharefile-types.ts      # Tipe TypeScript untuk sistem Share Files
    │
    └── data/                       # Layer data statis & data yang dibacking Supabase
        ├── jemaat.ts               # Layer data jemaat (CRUD + interface Jemaat)
        └── mitraDetails.ts         # Data detail mitra pelayanan (statis)
```

---

## Penjelasan Folder Kunci

### `src/app/` — Halaman dan Routing
Setiap folder di dalam `src/app/` otomatis menjadi route URL di browser. Misalnya:
- `src/app/publikasi/page.tsx` → URL `/publikasi`
- `src/app/publikasi/[id]/page.tsx` → URL `/publikasi/123`

### `src/components/` — Komponen UI
Berisi semua komponen React yang dapat digunakan ulang di berbagai halaman. Dikelompokkan berdasarkan domain (admin, publikasi, wilayah).

### `src/lib/` — Logika Bisnis & Data
Berisi semua fungsi yang berinteraksi dengan Supabase (fetch, insert, update, delete), fungsi utilitas (format, kompresi), dan tipe TypeScript.

### `src/data/` — Data Layer
Berisi layer data yang secara struktur mirip `src/lib/` tapi dipisah untuk keperluan historis (awalnya data statis, kemudian dimigrasi ke Supabase).

### `public/` — Aset Statis
Semua file di sini dapat diakses langsung oleh browser. Misalnya, `public/logo.png` dapat diakses di URL `/logo.png`.
