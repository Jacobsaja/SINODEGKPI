# 11 — API

## Penjelasan Umum

Website GKPI Sinode menggunakan dua jenis "API":

1. **Supabase Client (Data Layer)** — Fungsi TypeScript di `src/lib/` yang berinteraksi langsung dengan Supabase
2. **Next.js API Routes** — Endpoint HTTP di `src/app/api/` untuk operasi server-side khusus

---

## Bagian 1: Data Layer (Supabase Functions)

Semua interaksi database dienkapsulasi dalam fungsi-fungsi di folder `src/lib/`. Ini bukan REST API tradisional, melainkan fungsi TypeScript yang memanggil Supabase JS Client.

---

### `src/lib/publications.ts`

| Fungsi | Return Type | Keterangan |
|---|---|---|
| `getLatestPublications(limit?)` | `Promise<Publication[]>` | Ambil N publikasi terbaru (digunakan di Beranda) |
| `getAllPublications()` | `Promise<Publication[]>` | Ambil semua publikasi |
| `getPublicationById(id)` | `Promise<Publication \| null>` | Ambil satu publikasi berdasarkan ID |
| `formatDateID(isoDate)` | `string` | Format ISO date → format Indonesia (misal: "03 Juli 2026") |
| `formatViewsID(views)` | `string` | Format angka views → format ribuan Indonesia |

---

### `src/lib/products.ts`

| Fungsi | Return Type | Keterangan |
|---|---|---|
| `getAllProducts()` | `Promise<Product[]>` | Ambil semua produk |
| `getFeaturedProduct()` | `Promise<Product \| null>` | Ambil satu produk unggulan |
| `formatRupiah(value)` | `string` | Format angka → format Rupiah (misal: "Rp185.000") |

---

### `src/lib/pengurus.ts`

Modul ini menangani data struktur kepemimpinan (pengurus) dengan tiga level: Seksi → Grup → Anggota.

| Fungsi | Return Type | Keterangan |
|---|---|---|
| `getAllSeksi()` | `Promise<PengurusSeksi[]>` | Ambil semua seksi beserta grup dan anggotanya |
| `createSeksi(input, existing)` | `Promise<data>` | Buat seksi baru |
| `updateSeksi(id, input)` | `Promise<void>` | Perbarui seksi |
| `deleteSeksi(id)` | `Promise<void>` | Hapus seksi (cascade ke grup + anggota) |
| `createGrup(input, existing)` | `Promise<data>` | Buat grup baru |
| `updateGrup(id, input)` | `Promise<void>` | Perbarui grup |
| `deleteGrup(id)` | `Promise<void>` | Hapus grup |
| `createAnggota(input, existing)` | `Promise<void>` | Tambah anggota |
| `updateAnggota(id, input)` | `Promise<void>` | Perbarui anggota |
| `deleteAnggota(id)` | `Promise<void>` | Hapus anggota |
| `uploadPengurusPhoto(file)` | `Promise<string>` | Upload foto ke Supabase Storage bucket `pengurus`, return URL publik |
| `deletePengurusPhoto(photoUrl)` | `Promise<void>` | Hapus foto dari Storage |
| `swapSeksiOrder(a, b)` | `Promise<void>` | Tukar urutan dua seksi (tombol naik/turun) |
| `swapGrupOrder(a, b)` | `Promise<void>` | Tukar urutan dua grup |
| `swapAnggotaOrder(a, b)` | `Promise<void>` | Tukar urutan dua anggota |
| `slugify(text)` | `string` | Konversi teks ke slug URL |

---

### `src/lib/laporan-keuangan.ts`

| Fungsi | Return Type | Keterangan |
|---|---|---|
| `getAllFinancialReports()` | `Promise<FinancialReport[]>` | Ambil laporan dengan status `published` (halaman publik) |
| `getAllFinancialReportsAdmin()` | `Promise<FinancialReport[]>` | Ambil semua laporan termasuk draft (admin) |
| `getFinancialReportById(id)` | `Promise<FinancialReport \| null>` | Ambil satu laporan |
| `createFinancialReport(input)` | `Promise<FinancialReport>` | Buat laporan baru |
| `updateFinancialReport(id, input)` | `Promise<FinancialReport>` | Perbarui laporan |
| `deleteFinancialReport(id, filePath?)` | `Promise<void>` | Hapus laporan + file dari Storage |
| `uploadFinancialReportFile(file)` | `Promise<{ url, path, name, size }>` | Upload dokumen ke bucket `financial-reports` |
| `getMonthNameID(month)` | `string` | Nomor bulan → nama bulan Indonesia |
| `formatFileSize(bytes)` | `string` | Ukuran file → label terbaca (misal: "1.2 MB") |
| `getDownloadUrl(report)` | `string` | URL download dengan nama file asli |
| `getAvailableYears(reports)` | `number[]` | Ekstrak tahun unik dari daftar laporan |
| `filterFinancialReports(reports, year, query)` | `FinancialReport[]` | Filter client-side berdasarkan tahun + kata kunci |

---

### `src/data/jemaat.ts`

| Fungsi | Return Type | Keterangan |
|---|---|---|
| `getAllJemaat()` | `Promise<Jemaat[]>` | Ambil semua jemaat |
| `getJemaatById(id)` | `Promise<Jemaat \| null>` | Ambil satu jemaat |
| `createJemaat(input)` | `Promise<Jemaat>` | Buat jemaat baru |
| `updateJemaat(id, updates)` | `Promise<Jemaat>` | Perbarui jemaat |
| `deleteJemaat(id)` | `Promise<void>` | Hapus jemaat |
| `uploadJemaatPhoto(file, jemaatId)` | `Promise<string>` | Upload foto ke bucket `jemaat-photos` |
| `slugify(nama)` | `string` | Buat slug ID dari nama jemaat |

---

### `src/lib/publikasi-upload.ts`

| Fungsi | Return Type | Keterangan |
|---|---|---|
| `uploadPublikasiImage(file)` | `Promise<string>` | Kompres + upload satu gambar ke bucket `publications/images/`, return URL |
| `uploadPublikasiImages(files)` | `Promise<string[]>` | Upload banyak gambar berurutan |
| `uploadPublikasiDocument(file)` | `Promise<PublicationDocument>` | Upload dokumen ke bucket `publications/documents/`, return objek `{ name, url, size }` |
| `uploadPublikasiDocuments(files)` | `Promise<PublicationDocument[]>` | Upload banyak dokumen berurutan |
| `isAllowedImage(file)` | `boolean` | Validasi tipe file gambar |
| `isAllowedDocument(file)` | `boolean` | Validasi tipe file dokumen |
| `formatFileSize(bytes)` | `string` | Format ukuran file |

---

### `src/lib/haversine.ts`

| Fungsi | Return Type | Keterangan |
|---|---|---|
| `haversineDistance(lat1, lng1, lat2, lng2)` | `number` | Jarak antara dua koordinat dalam kilometer |
| `formatDistance(km)` | `string` | Format jarak → label (misal: "500 m", "1.2 km") |
| `findNearestChurches(userLat, userLng, churches, count?)` | `JemaatWithDistance[]` | Temukan N gereja terdekat dari koordinat pengguna |

---

### `src/lib/image-compress.ts`

| Fungsi | Return Type | Keterangan |
|---|---|---|
| `compressBeforeUpload(file, preset)` | `Promise<File>` | Kompres gambar sebelum upload. Preset: `"publikasi"`, `"toko"`, `"pengurus"`, `"logo"` |

**Preset Kompresi:**

| Preset | Max Size | Max Dimensi |
|---|---|---|
| `publikasi` | 0.5 MB | 1600px |
| `toko` | 0.3 MB | 1200px |
| `pengurus` | 0.2 MB | 800px |
| `logo` | 0.1 MB | 600px |

---

## Bagian 2: Next.js API Routes

API Routes yang ada di `src/app/api/` berfungsi sebagai server-side endpoint HTTP.

### `/api/sharefile/verify`

> **Catatan**: Detail implementasi internal tidak dapat dikonfirmasi secara menyeluruh dari analisis kode saat ini.

- **Metode**: `POST`
- **Fungsi**: Verifikasi akses pengguna ke sebuah folder berbagi
- **Input**: `{ slug, mode, credential }` (kode akses atau email)
- **Output**: Token/cookie sesi jika verifikasi berhasil

---

### `/api/sharefile/download`

> **Catatan**: Detail implementasi internal tidak dapat dikonfirmasi secara menyeluruh dari analisis kode saat ini.

- **Metode**: `GET`
- **Fungsi**: Mengunduh file dari Supabase Storage dengan validasi otorisasi server
- **Keuntungan**: `SUPABASE_SERVICE_ROLE_KEY` hanya digunakan di server (tidak terekspos ke browser)

---

## Supabase Tables yang Digunakan

Berdasarkan analisis kode, tabel-tabel Supabase berikut digunakan:

| Tabel | Digunakan di |
|---|---|
| `publications` | `lib/publications.ts` |
| `products` | `lib/products.ts` |
| `pengurus_seksi` | `lib/pengurus.ts` |
| `pengurus_grup` | `lib/pengurus.ts` |
| `pengurus_anggota` | `lib/pengurus.ts` |
| `jemaat` | `data/jemaat.ts` |
| `financial_reports` | `lib/laporan-keuangan.ts` |
| `contact_messages` | `components/admin/AdminSidebar.tsx` |
| `share_folders` *(diperkirakan)* | `api/sharefile/*` |
| `share_folder_files` *(diperkirakan)* | `api/sharefile/*` |

---

## Supabase Storage Buckets

| Bucket | Konten | Digunakan di |
|---|---|---|
| `publications` | Gambar + dokumen publikasi | `lib/publikasi-upload.ts` |
| `pengurus` | Foto anggota pengurus | `lib/pengurus.ts` |
| `jemaat-photos` | Foto gereja jemaat | `data/jemaat.ts` |
| `financial-reports` | Dokumen laporan keuangan | `lib/laporan-keuangan.ts` |

---

## External Image Domains

Gambar dari domain berikut diizinkan oleh konfigurasi `next.config.ts`:

```typescript
remotePatterns: [
  {
    protocol: "https",
    hostname: "cpzplvifayzyihjzecdp.supabase.co",
    pathname: "/storage/v1/object/public/**",
  },
  {
    protocol: "https",
    hostname: "gkpisinode.org",
    pathname: "/wp-content/uploads/**",
  },
]
```

Domain pertama adalah Supabase Storage project GKPI. Domain kedua mengizinkan gambar dari website WordPress GKPI lama (untuk kompatibilitas konten lama).
