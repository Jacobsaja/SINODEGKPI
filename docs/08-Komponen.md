# 08 — Komponen

## Penjelasan Umum

Dokumen ini mendokumentasikan semua komponen React yang ada di folder `src/components/`. Setiap komponen dijelaskan berdasarkan tujuan, lokasi, props, dependensi, dan tanggung jawabnya.

---

## Komponen Global (Shared)

### `Navbar`

| Atribut | Keterangan |
|---|---|
| **Lokasi** | `src/components/Navbar.tsx` |
| **Jenis** | Client Component (`"use client"`) |
| **Props** | Tidak ada (data internal) |

**Tanggung Jawab:**
- Menampilkan navigasi utama website
- Berperilaku **transparan** di halaman Beranda saat belum di-scroll
- Berubah menjadi **solid** (background putih + shadow) setelah di-scroll lebih dari 24px
- Di halaman non-Beranda: selalu solid
- Menampilkan hamburger menu di mobile
- Mobile overlay menu dengan animasi fade + slide

**Dependensi:**
- `next/link`, `next/image`
- `usePathname` (mendeteksi halaman aktif)
- `lucide-react` (ikon Menu, X)
- `@/lib/assets` (logo)

---

### `Hero`

| Atribut | Keterangan |
|---|---|
| **Lokasi** | `src/components/Hero.tsx` |
| **Jenis** | Client Component (`"use client"`) |
| **Props** | Tidak ada (data internal) |

**Tanggung Jawab:**
- Menampilkan slideshow full-screen sebagai header halaman Beranda
- 8 slide: 1 slide "identity" (judul + logo), 7 slide "verse" (ayat Alkitab + CTA)
- Auto-advance setiap 10 detik
- Animasi Ken Burns (scale gambar latar) saat slide aktif
- Overlay gradien gelap untuk kontras teks
- Indikator slide (garis horizontal) di bagian bawah dengan interaksi klik
- Slide verse memiliki tombol CTA yang mengarah ke halaman yang relevan

---

### `Footer`

| Atribut | Keterangan |
|---|---|
| **Lokasi** | `src/components/Footer.tsx` |
| **Jenis** | Server Component |
| **Props** | Tidak ada |

**Tanggung Jawab:**
- Menampilkan footer global website
- Grid 4 kolom: brand, navigasi, layanan, kontak
- Ikon sosial media (Facebook, Instagram, YouTube) dengan link asli
- Bar bawah: hak cipta + tautan Kebijakan Privasi & Syarat Ketentuan

**Dependensi:**
- `next/link`, `next/image`
- `lucide-react` (Mail, Phone, MapPin, Facebook, Instagram, Youtube)
- `ScrollReveal`
- `@/lib/assets`

---

### `Section`

| Atribut | Keterangan |
|---|---|
| **Lokasi** | `src/components/Section.tsx` |
| **Jenis** | Server Component |

**Props:**

| Prop | Tipe | Default | Keterangan |
|---|---|---|---|
| `id` | `string` | — | ID HTML untuk anchor link |
| `title` | `string` | — | Judul section |
| `subtitle` | `string` | — | Deskripsi singkat di bawah judul |
| `children` | `ReactNode` | **wajib** | Konten section |
| `className` | `string` | `""` | Class CSS tambahan |
| `dark` | `boolean` | `false` | Gunakan background gelap |
| `narrow` | `boolean` | `false` | Batasi lebar konten ke `max-w-4xl` |
| `pattern` | `boolean` | `false` | Tampilkan background alternate + grid pattern |

**Tanggung Jawab:**
- Wrapper layout untuk setiap section konten
- Menampilkan heading + divider secara konsisten
- Mengelola background (putih / alternate / gelap / dengan pattern grid)
- Membungkus children dalam `ScrollReveal`

---

### `Card`

| Atribut | Keterangan |
|---|---|
| **Lokasi** | `src/components/Card.tsx` |
| **Jenis** | Server Component |

**Props:**

| Prop | Tipe | Default | Keterangan |
|---|---|---|---|
| `title` | `string` | **wajib** | Judul artikel |
| `excerpt` | `string` | **wajib** | Cuplikan teks |
| `date` | `string` | — | Tanggal (sudah diformat) |
| `category` | `string` | — | Kategori publikasi |
| `href` | `string` | `"#"` | URL tujuan |

**Tanggung Jawab:**
- Menampilkan kartu ringkasan publikasi di halaman Beranda
- Badge kategori + tanggal di bagian atas
- Judul yang berubah warna saat hover
- Link "Baca Selengkapnya" di bagian bawah

---

### `ScrollReveal`

| Atribut | Keterangan |
|---|---|
| **Lokasi** | `src/components/ScrollReveal.tsx` |
| **Jenis** | Client Component (`"use client"`) |

**Props:**

| Prop | Tipe | Default | Keterangan |
|---|---|---|---|
| `children` | `ReactNode` | **wajib** | Konten yang dianimasikan |
| `className` | `string` | `""` | Class CSS tambahan |
| `delay` | `number` | `0` | Delay animasi dalam ms |
| `direction` | `"up" \| "down" \| "left" \| "right" \| "none"` | `"up"` | Arah animasi masuk |

**Tanggung Jawab:**
- Membungkus elemen apapun dengan animasi reveal saat masuk viewport
- Menggunakan `framer-motion` `whileInView` dengan viewport `once: true`
- Animasi default: fade-in dari bawah (`y: 50 → 0`)

---

### `InfoSlideshow`

| Atribut | Keterangan |
|---|---|
| **Lokasi** | `src/components/InfoSlideshow.tsx` |
| **Jenis** | Client Component (`"use client"`) |
| **Props** | Tidak ada (data internal) |

**Tanggung Jawab:**
- Menampilkan slideshow informasi di halaman Beranda (section "Info")
- 3 slide statis yang mengarah ke halaman Profil GKPI
- Auto-advance setiap 6 detik
- Tombol navigasi prev/next (hanya desktop)
- Dot indicator di bagian bawah
- Layout dua kolom: gambar (kiri) + teks (kanan)

---

### `ResortHero`

| Atribut | Keterangan |
|---|---|
| **Lokasi** | `src/components/ResortHero.tsx` |
| **Jenis** | Server Component |
| **Props** | Tidak ada |

**Tanggung Jawab:**
- Hero section khusus untuk halaman `/wilayah-resort`
- Gambar latar penuh layar dengan overlay gradien
- Judul, deskripsi, dan tombol CTA "Cari Jemaat" yang mengarah ke `#cari-jemaat`
- Animasi `fade-in-up` dengan delay bertahap pada setiap elemen teks

---

### `PengurusModal`

| Atribut | Keterangan |
|---|---|
| **Lokasi** | `src/components/PengurusModal.tsx` |
| **Jenis** | Client Component (`"use client"`) |

**Props:**

| Prop | Tipe | Keterangan |
|---|---|---|
| `person` | `PengurusAnggota \| null` | Data anggota yang dipilih |
| `onClose` | `() => void` | Callback saat modal ditutup |

**Tanggung Jawab:**
- Modal overlay untuk menampilkan detail anggota pengurus
- Foto anggota (atau ikon placeholder jika tidak ada)
- Jabatan, nama, bio
- Link email dan telepon jika tersedia
- Klik di luar modal → menutup modal

---

### `ProductCard`

| Atribut | Keterangan |
|---|---|
| **Lokasi** | `src/components/ProductCard.tsx` |
| **Jenis** | Server Component |

**Props:**

| Prop | Tipe | Keterangan |
|---|---|---|
| `product` | `Product` | Objek produk dari Supabase |

**Tanggung Jawab:**
- Menampilkan kartu produk di halaman `/toko`
- Gambar produk dengan efek zoom saat hover
- Badge "Unggulan" jika `is_featured === true`
- Nama, kategori, deskripsi (2 baris max), harga dalam Rupiah
- Tombol beli: Tokopedia (hijau) dan Shopee (merah)

---

## Komponen Wilayah (Peta)

### `MapExplorer`

| Atribut | Keterangan |
|---|---|
| **Lokasi** | `src/components/wilayah/MapExplorer.tsx` |
| **Jenis** | Client Component |

**Props:**

| Prop | Tipe | Keterangan |
|---|---|---|
| `initialChurches` | `Jemaat[]` | Data jemaat dari server (prop drilling) |

**Tanggung Jawab:**
- Orkestrator utama halaman peta
- Mengelola state: gereja dipilih, mode terdekat, lokasi user, filter, tab mobile
- Sinkronisasi state ke URL (search params)
- Meneruskan data ke `MapView`, `ChurchListPanel`, `ChurchDetailPanel`, `NearestChurchFinder`
- Dynamic import `MapView` dengan `ssr: false`

---

### `MapView`

| Lokasi | `src/components/wilayah/MapView.tsx` |
|---|---|
| **Jenis** | Client Component (SSR dinonaktifkan) |

Menampilkan peta Leaflet dengan semua marker jemaat. Mendukung clustering marker, marker user, dan flyTo animasi saat gereja dipilih.

---

### `ChurchListPanel`

| Lokasi | `src/components/wilayah/ChurchListPanel.tsx` |
|---|---|

Panel daftar gereja di sisi kiri (desktop) atau tab "Daftar" (mobile). Berisi `SearchFilterBar` dan daftar `ChurchListItem`.

---

### `ChurchDetailPanel`

| Lokasi | `src/components/wilayah/ChurchDetailPanel.tsx` |
|---|---|

Panel detail gereja yang muncul dari kanan saat marker atau item daftar dipilih. Menampilkan nama, alamat, pendeta, telepon, foto, dan jarak (jika dalam mode terdekat).

---

### `NearestChurchFinder`

| Lokasi | `src/components/wilayah/NearestChurchFinder.tsx` |
|---|---|

Bar di atas peta. Tombol "Cari Gereja Terdekat" meminta izin lokasi browser, lalu menggunakan fungsi `findNearestChurches` (haversine) untuk menemukan 5 gereja terdekat.

---

## Komponen Admin

### `AdminSidebar`

| Atribut | Keterangan |
|---|---|
| **Lokasi** | `src/components/admin/AdminSidebar.tsx` |
| **Jenis** | Client Component |

**Props:**

| Prop | Tipe | Keterangan |
|---|---|---|
| `email` | `string \| undefined` | Email pengguna yang login |
| `onLogout` | `() => void` | Callback logout |
| `isOpen` | `boolean` | Status sidebar di mobile |
| `onClose` | `() => void` | Callback tutup sidebar |

**Tanggung Jawab:**
- Sidebar navigasi admin panel
- Menampilkan 9 item menu dengan ikon
- Badge jumlah pesan belum dibaca di item "Pesan Masuk"
- Indikator aktif (garis merah di kiri) untuk halaman yang sedang dibuka
- Profil user (inisial dari email) di bagian bawah
- Tombol logout dan link buka situs
- Dapat disembunyikan di mobile (slide dari kiri)

---

## Komponen Publikasi

### `GalleryLightbox`

| Lokasi | `src/components/publikasi/GalleryLightbox.tsx` |
|---|---|

Lightbox untuk menampilkan galeri foto dalam publikasi. Klik gambar → tampil full-screen dengan navigasi prev/next.

### `CopyLinkButton`

| Lokasi | `src/components/publikasi/CopyLinkButton.tsx` |
|---|---|

Tombol kecil yang menyalin URL halaman saat ini ke clipboard. Memberikan feedback visual (ikon berubah) saat berhasil disalin.
