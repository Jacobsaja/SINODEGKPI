# 06 — Fitur

## Daftar Fitur Lengkap

Dokumen ini menjelaskan seluruh fitur yang ada di website GKPI Sinode, baik di sisi publik maupun admin panel.

---

## Halaman Publik

### 1. Beranda (`/`)

Halaman utama website yang menjadi titik masuk pengunjung.

**Komponen:**
- **Hero Slideshow**: Slideshow full-screen dengan 8 slide (1 slide identitas + 7 slide ayat Alkitab). Ganti otomatis setiap 10 detik. Setiap slide "verse" memiliki tombol CTA yang mengarah ke halaman terkait.
- **Feature Navigation Cards**: 5 kartu navigasi cepat (Renungan, Info, Publikasi, Kontak, Toko GKPI).
- **Tentang GKPI**: Sejarah singkat gereja + 4 moto pelayanan + tombol "Selengkapnya".
- **Visi & Misi**: Dua kartu yang menampilkan visi ("Menjadi Persekutuan Penyembahan...") dan misi (Panca Pelayanan: Koinonia, Marturia, Diakonia, Liturgia, Oikonomia).
- **Info Slideshow**: Slideshow dengan 3 slide yang mengarah ke halaman profil GKPI.
- **Publikasi Terbaru**: 3 kartu publikasi terbaru dari Supabase, dengan kategori dan tanggal.
- **Mitra Pelayanan**: Grid logo 14 mitra dengan tooltip nama saat hover.
- **Formulir Kontak**: Form UI untuk mengirim pesan (nama, email, subjek, pesan).
- **Footer**: Navigasi, tautan layanan, kontak, tautan sosial media.

---

### 2. Profil GKPI (`/profil-gkpi`)

Halaman informasi lengkap tentang GKPI termasuk sejarah, visi, misi, dan dokumen-dokumen resmi.

---

### 3. Pengurus (`/pengurus`)

Halaman yang menampilkan struktur kepemimpinan GKPI secara dinamis dari Supabase.

**Fitur:**
- Tab navigasi berdasarkan **Seksi** (Sinode, Komisi, dll.)
- Tiap seksi memiliki **layout yang berbeda**:
  - `leaders_grid`: Pimpinan utama di atas + grid jabatan di bawah
  - `komisi_groups`: Beberapa grup/komisi dengan ketua + sekretaris + anggota
  - `single_group`: Satu grup tunggal
  - `flat_grid`: Grid rata nama + jabatan
- Klik anggota → Modal detail (`PengurusModal`) muncul dengan foto, bio, email, telepon

---

### 4. Wilayah & Resort (`/wilayah-resort`)

Halaman peta interaktif untuk menemukan gereja GKPI di seluruh Indonesia.

**Fitur:**
- **Hero section** dengan animasi
- **Peta Leaflet interaktif** dengan marker semua jemaat dari Supabase
- **Marker clustering** untuk performa di area padat gereja
- **Panel daftar gereja** (kiri desktop / tab mobile)
- **Panel detail gereja** (slide dari kanan, tampilkan nama, alamat, pendeta, telepon, foto)
- **Bar pencarian**: Cari berdasarkan nama gereja, kota, atau nama pendeta
- **Filter kota**: Chip filter kota yang tersedia
- **Gereja Terdekat**: Tombol "Cari Terdekat" yang menggunakan GPS browser + rumus Haversine untuk menemukan 5 gereja terdekat
- **Sinkronisasi URL**: Filter pencarian & kota tersimpan di URL (`?search=...&city=...`) sehingga bisa dibagikan

---

### 5. Publikasi (`/publikasi`)

Daftar semua publikasi GKPI: Berita, Pengumuman, Kegiatan, Renungan Harian, Dokumen.

**Fitur:**
- Filter berdasarkan kategori
- Pencarian berdasarkan judul / konten
- Halaman detail publikasi (`/publikasi/[id]`) dengan:
  - Konten lengkap
  - Galeri foto (lightbox)
  - Lampiran dokumen (PDF, Word, Excel) untuk diunduh
  - Salin link (`CopyLinkButton`)

---

### 6. Toko GKPI (`/toko`)

Katalog produk GKPI (buku, kaos, aksesori).

**Fitur:**
- Grid produk dari Supabase
- Setiap produk: nama, kategori, deskripsi, harga (format Rupiah), gambar
- Tombol beli langsung ke **Tokopedia** dan **Shopee**
- Badge "Unggulan" untuk produk pilihan

---

### 7. Mitra Pelayanan (`/mitra`)

Halaman daftar mitra gereja dengan detail masing-masing.

---

### 8. Kontak (`/kontak`)

Halaman kontak dengan formulir pengiriman pesan dan informasi kontak resmi (alamat, telepon, email, jam operasional).

---

### 9. Laporan Keuangan (`/laporan-keuangan`)

Halaman publik yang menampilkan laporan keuangan yang telah dipublikasikan.

**Fitur:**
- Daftar laporan berdasarkan tahun dan bulan
- Filter tahun + pencarian kata kunci
- Tombol unduh dokumen (PDF) langsung dari Supabase Storage

---

## Admin Panel (`/admin`)

Admin panel hanya dapat diakses oleh pengguna terautentikasi (Supabase Auth).

### Dasbor Admin (`/admin`)
- Statistik ringkasan: jumlah total publikasi, produk, publikasi unggulan, produk unggulan
- Aksi cepat: Tulis Publikasi, Tambah Produk, Lihat Website
- Tabel publikasi terkini (5 terakhir)
- Tabel produk terkini (5 terakhir)

### Kelola Publikasi (`/admin/publikasi`)
- Daftar semua publikasi dengan filter dan pencarian
- Form tambah/edit publikasi (judul, konten, kategori, tanggal, penulis, gambar, galeri, lampiran dokumen, pin/unpin)
- Upload gambar (dikompres otomatis sebelum upload)
- Upload dokumen (PDF, Word, Excel)
- Hapus publikasi

### Kelola Produk Toko (`/admin/toko`)
- Daftar semua produk
- Form tambah/edit produk (nama, deskripsi, harga, kategori, gambar, URL Tokopedia, URL Shopee, unggulan)
- Hapus produk

### Kelola Pengurus (`/admin/pengurus`)
- Manajemen **Seksi** (tab pengurus): tambah, edit, hapus, urutan (naik/turun)
- Manajemen **Grup** dalam seksi: tambah, edit, hapus, urutan
- Manajemen **Anggota** dalam grup: tambah, edit, hapus, urutan
- Upload foto anggota
- Pilihan layout per seksi (`leaders_grid`, `komisi_groups`, dll.)

### Kelola Jemaat & Resort (`/admin/jemaat`)
- Daftar semua jemaat dari Supabase
- Form tambah/edit jemaat (`JemaatFormModal`): nama, pendeta, alamat, telepon, koordinat (lat/lng), kota, provinsi, foto
- Upload foto gereja
- Hapus jemaat

### Pesan Masuk (`/admin/kontak`)
- Daftar pesan dari formulir kontak
- Badge jumlah pesan belum dibaca di sidebar
- Tandai pesan sebagai dibaca/belum dibaca

### Laporan Keuangan (`/admin/laporan-keuangan`)
- Daftar semua laporan (draft + published)
- Form upload laporan baru (bulan, tahun, nama, deskripsi, file PDF, status draft/published)
- Edit status laporan (publish/unpublish)
- Hapus laporan + file dari storage

### Share Files (`/admin/sharefiles`)
- Kelola **folder berbagi** yang dapat diproteksi dengan kode atau email
- Upload file ke setiap folder
- Aktif/nonaktifkan folder
- Sistem Share Files diakses publik melalui API routes (`/api/sharefile/`)

---

## SEO & Metadata

- **Open Graph** dan **Twitter Card** dikonfigurasi di `layout.tsx` dan setiap `page.tsx`
- `sitemap.ts` menghasilkan `sitemap.xml` secara otomatis
- `robots.ts` menghasilkan `robots.txt`
- `next-env.d.ts` untuk tipe Next.js
- **Heading hierarchy** diikuti dengan benar di setiap halaman
