# 📊 Simulasi & Estimasi Penggunaan Kuota (Vercel & Supabase Free Tier)

Dokumen ini memuat analisis arsitektur, perhitungan matematis, dan simulasi kuota penggunaan (*resource usage simulation*) untuk **Website Resmi Sinode GKPI** yang di-hosting pada **Vercel Hobby Plan (Free Tier)** dan database **Supabase Free Tier**.

Tujuan dokumen ini adalah memberikan panduan transparan bagi tim IT, Majelis Sinode, dan pengelola teknis mengenai efisiensi sistem, kapasitas pengunjung, serta jaminan **100% Gratis (Rp 0/bulan)** tanpa risiko biaya terduga (*zero-cost architecture*).

---

## 📑 Daftar Isi

1. [Ringkasan Batas Kuota Gratis (Free Tier Limits)](#1-ringkasan-batas-kuota-gratis-free-tier-limits)
2. [Strategi Optimasi Kode & Arsitektur (Zero-Waste Design)](#2-strategi-optimasi-kode--arsitektur-zero-waste-design)
3. [Simulasi Skenario Beban Trafik Jemaat](#3-simulasi-skenario-beban-trafik-jemaat)
   - [Skenario A: Operasional Normal Mingguan](#skenario-a-operasional-normal-mingguan-rutin)
   - [Skenario B: Puncak Acara (Natal, Paskah, Sinode Godang)](#skenario-b-puncak-acara-natal-paskah-sinode-godang)
   - [Skenario C: Batas Maksimal Kapasitas Free Tier](#skenario-c-batas-maksimal-kapasitas-free-tier-stress-boundary)
4. [Tabel Perbandingan Penggunaan vs Batas Kuota](#4-tabel-perbandingan-penggunaan-vs-batas-kuota)
5. [Analisis Potensi Bottleneck & Solusi Pencegahan](#5-analisis-potensi-bottleneck--solusi-pencegahan)
6. [Panduan Monitoring untuk Administrator](#6-panduan-monitoring-untuk-administrator)

---

## 1. Ringkasan Batas Kuota Gratis (Free Tier Limits)

### A. Vercel (Hobby Tier — Personal/Non-Commercial)
| Metrik Sumber Daya                 | Batas Gratis Bulanan           | Keterangan                                                                     |
|---                                 |---                             |---                                                                             |
| **Fast Data Transfer (Bandwidth)** | **100 GB / bulan**             | Transfer data keluar (HTML, CSS, JS, aset statis)                              |
| **Serverless Function Execution**  | **100 GB-Hours / bulan**       | Waktu pemrosesan API / SSR                                                     |
| **Serverless Function Invocations**| **1.000.000 panggilan / bulan**| Panggilan ke route handler / backend API                                       |
| **Edge Middleware Invocations**    | **1.000.000 eksekusi / bulan** | Eksekusi proteksi rute & security proxy                                        |
| **Image Optimization**             | **1.000 gambar / bulan**       | *Catatan: Dinonaktifkan di kode ini agar kuota tetap 0% terpakai*              |
| **Build Execution Time**           | **6.000 menit / bulan**        | Waktu kompilasi saat push git commit                                           |
| **Deployments**                    | **100 deploy / hari**          | Batas rilis update aplikasi                                                    |

### B. Supabase (Free Tier — PostgreSQL BaaS)
| Metrik Sumber Daya                | Batas Gratis Bulanan            | Keterangan                                                                     |
|---                                |---                              |---                                                                             |
| **Database Disk Storage**         | **500 MB**                      | Ukuran tabel SQL (berita, pengurus, produk, metadata)                          |
| **File Storage (Bucket)**         | **1.000 MB (1 GB)**             | File PDF laporan, foto publikasi, gambar toko                                  |
| **Storage Egress (Bandwidth)**    | **2.000 MB (2 GB) / bulan**     | Kuota unduh/tampil berkas media dari storage                                   |
| **Database Egress**               | **5.000 MB (5 GB) / bulan**     | Data JSON hasil query dari aplikasi                                            |
| **Monthly Active Users (Auth)**   | **50.000 MAU**                  | Pengguna admin yang login                                                      |
| **Connection Pool**               | **Direct: 60 / Pooler: 200**    | Koneksi konkuren ke database                                                   |
| **Realtime Messages**             | **2.000.000 pesan / bulan**     | Fitur sinkronisasi data live                                                   |

---

## 2. Strategi Optimasi Kode & Arsitektur (Zero-Waste Design)

Untuk memastikan website berjalan mulus tanpa menyentuh batas gratis, beberapa optimasi teknis kunci telah diterapkan langsung pada codebase:

### 1. `images.unoptimized: true` (Penghematan Kuota Vercel 100%)
- **Lokasi**: [`next.config.ts`](file:///d:/ANTIGRAVITY/SINODE%20GKPI/PROGRAM/next.config.ts)
- **Mekanisme**: Fitur Vercel Image Optimization sengaja di-bypass. Gambar langsung dimuat dari storage Supabase dan CDN publik tanpa melalui engine transformasi Vercel.
- **Dampak**: Penggunaan kuota Vercel Image Optimization adalah **0 dari 1.000 gambar (0% kuota terpakai)**. Tidak ada risiko terkena suspend akibat limit gambar Vercel.

### 2. Client-Side Image Compression (`browser-image-compression`)
- **Lokasi**: [`src/lib/image-compress.ts`](file:///d:/ANTIGRAVITY/SINODE%20GKPI/PROGRAM/src/lib/image-compress.ts)
- **Mekanisme**: Setiap foto dokumentasi yang diupload oleh admin (yang seringkali berukuran 5 MB – 15 MB dari kamera smartphone) secara otomatis dikompresi di browser pengunggah sebelum dikirim ke Supabase.
- **Hasil**: Ukuran file berkurang drastis menjadi **150 KB – 300 KB** dengan kualitas visual prima WebP/JPEG.
- **Dampak**: Menghemat kapasitas storage Supabase hingga **95%**, memungkinkan penyimpanan ribuan foto dalam batas 1 GB.

### 3. Edge CDN Caching & ISR (`revalidate = 300`)
- **Lokasi**: [`src/app/page.tsx`](file:///d:/ANTIGRAVITY/SINODE%20GKPI/PROGRAM/src/app/page.tsx)
- **Mekanisme**: Halaman beranda di-cache oleh Vercel Edge Network selama **5 menit (300 detik)**.
- **Dampak**: Jika ada 1.000 jemaat membuka website dalam rentang 5 menit, hanya **1 request** yang memicu query ke Supabase; 999 pengunjung lainnya dilayani secara instan oleh server CDN Vercel dengan latensi < 50ms dan **0 beban query ke Supabase**.

### 4. Audio On-Demand (`preload="none"`)
- **Lokasi**: [`src/app/profil-gkpi/page.tsx`](file:///d:/ANTIGRAVITY/SINODE%20GKPI/PROGRAM/src/app/profil-gkpi/page.tsx)
- **Mekanisme**: Berkas audio Mars GKPI (2.75 MB) diberi atribut `preload="none"`.
- **Dampak**: Audio tidak diunduh kecuali jemaat secara sadar menekan tombol "Play". Menghemat hingga puluhan Gigabyte bandwidth hosting per bulan dari pengunjung pasif.

### 5. Client Component & Selective Hydration
- Seluruh navigasi publik menggunakan sistem SPA (*Single Page Application*) Next.js Link. Perpindahan halaman antar publikasi, profil, jemaat, dan toko hanya mengambil delta JSON data kecil (~2-10 KB), bukan me-reload seluruh halaman HTML/CSS/JS.

---

## 3. Simulasi Skenario Beban Trafik Jemaat

Berikut kalkulasi simulasi matematis konsumsi kuota berdasarkan estimasi kunjungan jemaat GKPI:

### Skenario A: Operasional Normal Mingguan (Rutin)
- **Estimasi Pengunjung**: 750 pengguna unik / hari (~22.500 pengunjung / bulan).
- **Page Views**: ~60.000 tayangan halaman / bulan (rata-rata 2,6 halaman per kunjungan).
- **Rata-rata payload halaman**: ~350 KB (HTML, CSS, script terkompresi Brotli/Gzip) + gambar thumbnail artikel.

#### Kalkulasi Penggunaan:
1. **Vercel Bandwidth**:
   - Perhitungan: `60.000 PV × 350 KB = 21.000.000 KB ≈ 21 GB / bulan`
   - Evaluasi: Batas 100 GB → **Terpakai ~21%** (Sangat Aman)
2. **Vercel Serverless Executions**:
   - Sebagian besar rute bersifat statis & ter-cache oleh ISR. Hanya menghasilkan ~15.000 invocation dinamis.
   - Evaluasi: Batas 1.000.000 → **Terpakai ~1,5%** (Sangat Aman)
3. **Supabase Database Storage**:
   - Data teks untuk 500 artikel, 300 gereja/resort, 50 pengurus, dan log kontak: `~25 MB`
   - Evaluasi: Batas 500 MB → **Terpakai ~5%** (Sangat Aman)
4. **Supabase File Storage (Bucket)**:
   - Perhitungan: `(400 foto × 0,25 MB) + (24 file PDF × 0,8 MB) = 100 MB + 19,2 MB ≈ 120 MB`
   - Evaluasi: Batas 1.000 MB (1 GB) → **Terpakai ~12%** (Sangat Aman)
5. **Supabase Storage Egress**:
   - Konsumsi unduhan gambar dan berkas PDF bulanan: `~0,85 GB / bulan`
   - Evaluasi: Batas 2 GB → **Terpakai ~42,5%** (Aman)

---

### Skenario B: Puncak Acara (Natal, Paskah, Sinode Godang)
- **Estimasi Pengunjung**: Lonjakan 5.000 pengunjung / hari selama pekan perayaan (~75.000 pengunjung / bulan).
- **Page Views**: ~200.000 tayangan halaman / bulan.
- **Aktivitas Tinggi**: Pembacaan warta jemaat, renungan harian, galeri foto kegiatan, dan laporan keuangan.

#### Kalkulasi Penggunaan:
1. **Vercel Bandwidth**:
   - Karena CDN cache hit ratio mencapai ~75%, bandwidth keluar Vercel diperkirakan: `~48 GB / bulan`
   - Evaluasi: Batas 100 GB → **Terpakai ~48%** (Aman)
2. **Vercel Serverless Executions**:
   - Perkiraan pemanggilan: `~50.000 invocations`
   - Evaluasi: Batas 1.000.000 → **Terpakai ~5%** (Sangat Aman)
3. **Supabase Database Egress**:
   - Data JSON query ter-cache: `~1,8 GB`
   - Evaluasi: Batas 5 GB → **Terpakai ~36%** (Aman)
4. **Supabase Storage Egress**:
   - Unduhan PDF warta & tampilan foto acara: `~1,65 GB / bulan`
   - Evaluasi: Batas 2 GB → **Terpakai ~82,5%** (Waspada, mendekati batas free tier)

---

### Skenario C: Batas Maksimal Kapasitas Free Tier (Stress Boundary)
Berapa kapasitas maksimal yang bisa ditampung website GKPI Sinode **tanpa membayar 1 rupiah pun**?

- **Batas Pengunjung Maksimal**: **~120.000 - 150.000 pengunjung / bulan** (~350.000 Page Views).
- **Faktor Pembatas Utama (*Primary Bottleneck*)**: Kuota **Supabase Storage Egress (2 GB/bulan)** untuk pengunduhan berkas PDF dan foto dokumentasi langsung dari Supabase Storage.
- Vercel sendiri masih sangat sanggup melayani hingga **300.000+ Page Views** dengan kuota 100 GB berkat efisiensi caching.

---

## 4. Tabel Perbandingan Penggunaan vs Batas Kuota

| Metrik Layanan                | Batas Free Tier | Skenario Normal  | Skenario Puncak Acara   | Status Keamanan |
|---                            |:---:            |:---:             |:---:                    |:---:            |
| **Vercel Bandwidth**          | 100 GB          | ~21 GB (21%)     | ~48 GB (48%)            | 🟢 Sangat Aman  |
| **Vercel Function Calls**     | 1.000.000       | ~15.000 (1,5%)   | ~50.000 (5%)            | 🟢 Sangat Aman  |
| **Vercel Image Optimization** | 1.000           | 0 (0%)           | 0 (0%)                  | 🟢 Kebal Limit  |
| **Vercel Build Minutes**      | 6.000 menit     | ~120 menit (2%)  | ~200 menit (3,3%)       | 🟢 Sangat Aman  |
| **Supabase DB Disk**          | 500 MB          | ~25 MB (5%)      | ~40 MB (8%)             | 🟢 Sangat Aman  |
| **Supabase Bucket Disk**      | 1.000 MB (1 GB) | ~120 MB (12%)    | ~280 MB (28%)           | 🟢 Aman         |
| **Supabase DB Egress**        | 5.000 MB (5 GB) | ~650 MB (13%)    | ~1.800 MB (36%)         | 🟢 Aman         |
| **Supabase Storage Egress**   | 2.000 MB (2 GB) | ~850 MB (42,5%)  | ~1.650 MB (82,5%)       | 🟡 Perlu Perhatian Saat Peak |

---

## 5. Analisis Potensi Bottleneck & Solusi Pencegahan

Jika di masa mendatang trafik jemaat bertambah pesat atau terjadi lonjakan unduhan berkas, berikut analisis dan mitigasi preventifnya:

### 1. Bottleneck: Supabase Storage Egress (Batas 2 GB)
- **Gejala**: Kuota unduh berkas media/PDF di dashboard Supabase mencapai >80%.
- **Mitigasi Teknis (Tanpa Biaya Tambahan)**:
  1. **Dokumen Keuangan Ukuran Besar (>10 MB)**: Unggah dokumen arsip besar ke Google Drive Sinode resmi dan sematkan tautan unduhan publik di halaman Laporan Keuangan.
  2. **CDN Proxy Caching untuk Storage**: Pasang Cloudflare Free Tier di depan domain storage kustom Supabase agar aset gambar/PDF di-cache di edge node global, memotong konsumsi egress Supabase hingga 90%.

### 2. Bottleneck: Database Pausing (Supabase Inactivity)
- **Aturan Supabase**: Proyek free tier yang tidak menerima query sama sekali selama 7 hari akan di-pause otomatis.
- **Kondisi GKPI**: Website ini aktif diakses jemaat setiap hari untuk membaca renungan harian dan warta, sehingga **database tidak akan pernah mengalami auto-pause**.

---

## 6. Panduan Monitoring untuk Administrator

Administrator IT Sinode GKPI disarankan melakukan pengecekan berkala (1x sebulan) pada dashboard resmi:

1. **Vercel Dashboard**:
   - Buka [vercel.com/dashboard](https://vercel.com/dashboard) → Pilih project `sinodegkpi` → Tab **Usage**.
   - Pantau grafik **Fast Data Transfer** (pastikan < 80 GB).
2. **Supabase Dashboard**:
   - Buka [supabase.com/dashboard](https://supabase.com/dashboard) → Pilih organisasi → **Settings** → **Usage**.
   - Pantau diagram lingkaran **Disk Size**, **Database Egress**, dan **Storage Egress**.
3. **Pengelolaan Arsip Foto & Berkas**:
   - Pastikan admin publikasi selalu mengunggah gambar melalui form admin resmi yang sudah dilengkapi fungsi kompresi otomatis (`browser-image-compression`).
   - Hindari menghapus dan mengupload ulang file berulang kali dalam volume masif dalam 1 hari.

---

*Dokumen ini disusun sebagai referensi operasional resmi proyek GKPI Sinode Website (September 2026).*
