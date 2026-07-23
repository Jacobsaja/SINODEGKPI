# 14 — Git Workflow

## Strategi Branching

Proyek GKPI Sinode Website menggunakan pendekatan Git yang terpusat dan sederhana untuk memudahkan pengelolaan kolaborasi.

---

## Branch Utama

- **`main`**: Branch produksi utama. Branch ini dilindungi (protected) dan otomatis akan ter-deploy ke Vercel ketika ada perubahan. Jangan pernah melakukan commit langsung ke branch ini.

---

## Aturan Kolaborasi

Bagi anggota tim IT GKPI atau kontributor yang ditunjuk, ikuti alur ini:

1. **Sinkronisasi Kode Lokal**
   Pastikan kode lokal Anda terbaru dari branch `main` sebelum memulai pekerjaan.
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Buat Branch Fitur Baru**
   Buat branch baru untuk setiap fitur, perubahan, atau perbaikan bug.
   - Format: `feature/nama-fitur` atau `fix/nama-perbaikan` atau `docs/nama-dokumentasi`
   ```bash
   git checkout -b feature/tambah-peta-jemaat
   ```

3. **Lakukan Pekerjaan dan Commit**
   Commit perubahan Anda secara bertahap dan berikan pesan commit yang deskriptif. (Lihat aturan penamaan commit di bawah).
   ```bash
   git add .
   git commit -m "feat: tambahkan fitur pencarian gereja terdekat"
   ```

4. **Push ke Remote**
   Push branch fitur Anda ke repository Git jarak jauh (misal: GitHub/GitLab).
   ```bash
   git push origin feature/tambah-peta-jemaat
   ```

5. **Buat Pull Request (PR)**
   Buka Pull Request (PR) ke branch `main`. Pastikan memberikan penjelasan singkat tentang apa yang diubah.

6. **Review dan Merge**
   PR akan direview oleh developer lain (jika ada). Jika sudah disetujui, PR akan di-merge ke branch `main`. Vercel otomatis akan mendeploy versi terbaru ke production.

7. **Hapus Branch Fitur**
   Setelah di-merge, hapus branch fitur Anda.
   ```bash
   git branch -d feature/tambah-peta-jemaat
   ```

---

## Konvensi Pesan Commit (Conventional Commits)

Kami menganjurkan penggunaan konvensi commit agar history rapi dan mudah dibaca. Format dasar: `tipe: deskripsi singkat`.

- `feat`: Menambahkan fitur baru. (contoh: `feat: halaman profil GKPI baru`)
- `fix`: Memperbaiki bug. (contoh: `fix: perbaiki modal pengurus yang tidak bisa ditutup`)
- `docs`: Perubahan dokumentasi (hanya markdown/komentar). (contoh: `docs: perbarui panduan instalasi`)
- `style`: Perubahan gaya kode (spasi, formatting) tanpa mengubah logika. (contoh: `style: rapikan indentasi Navbar.tsx`)
- `refactor`: Perubahan struktur kode tanpa menambah fitur atau memperbaiki bug. (contoh: `refactor: pisah komponen MapView dari MapExplorer`)
- `perf`: Optimasi performa. (contoh: `perf: kompres gambar hero`)
- `chore`: Perubahan pada file konfigurasi, dependensi, atau hal-hal non-kode lainnya. (contoh: `chore: update Next.js ke versi terbaru`)

---

## Pengelolaan Konflik (Merge Conflict)

Jika terjadi konflik saat akan menggabungkan kode:

1. Tarik perubahan terbaru dari `main` ke branch fitur Anda:
   ```bash
   git checkout feature/branch-saya
   git pull origin main
   ```
2. Buka editor (seperti VS Code), cari file yang konflik (ditandai dengan `<<<<<<<`, `=======`, `>>>>>>>`).
3. Pilih kode mana yang akan dipertahankan, atau gabungkan secara manual.
4. Simpan, tambahkan, dan commit penyelesaian konflik tersebut:
   ```bash
   git add .
   git commit -m "Merge branch 'main' into feature/branch-saya"
   git push origin feature/branch-saya
   ```
