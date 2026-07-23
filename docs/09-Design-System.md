# 09 — Design System

## Penjelasan Umum

Design system website GKPI Sinode didefinisikan menggunakan **Tailwind CSS 4** dengan blok `@theme` di file `src/app/globals.css`. Pendekatan ini memusatkan semua design token (warna, font, animasi) di satu tempat tanpa perlu file konfigurasi Tailwind terpisah.

---

## Palet Warna

Semua warna didefinisikan sebagai CSS custom properties di `@theme {}` dan dapat digunakan sebagai class Tailwind seperti `bg-primary`, `text-primary-dark`, dll.

| Token | Nilai Hex | Kelas Tailwind | Penggunaan |
|---|---|---|---|
| `--color-primary` | `#0E63E9` | `primary` | Warna utama merek (biru) |
| `--color-primary-dark` | `#0A3D91` | `primary-dark` | Hover state warna utama |
| `--color-accent` | `#D62828` | `accent` | Aksen merah (digunakan minimal) |
| `--color-background` | `#FFFFFF` | `background` | Background halaman utama |
| `--color-alternate` | `#F8FAFC` | `alternate` | Background section bergantian |
| `--color-surface` | `#FFFFFF` | `surface` | Background kartu dan elemen UI |
| `--color-text-primary` | `#1F2937` | `text-primary` | Teks heading dan utama |
| `--color-text-body` | `#374151` | `text-body` | Teks paragraf utama |
| `--color-text-secondary` | `#6B7280` | `text-secondary` | Teks sekunder/helper |
| `--color-text-muted` | `#9CA3AF` | `text-muted` | Teks placeholder/tidak aktif |
| `--color-border` | `#E5E7EB` | `border` | Garis batas elemen |
| `--color-success` | `#16A34A` | `success` | Warna sukses/positif |
| `--color-warning` | `#F59E0B` | `warning` | Warna peringatan |
| `--color-disabled` | `#D1D5DB` | `disabled` | Warna elemen dinonaktifkan |

---

## Tipografi

### Font Family

| Token | Font | Kelas Tailwind | Penggunaan |
|---|---|---|---|
| `--font-sans` | Inter | `font-sans` | Semua teks UI, heading |
| `--font-serif` | Playfair Display | `font-serif` | Kutipan ayat Alkitab, aksen dekoratif |

**Fallback Font Sans**: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

**Fallback Font Serif**: `Georgia, "Times New Roman", serif`

### Ukuran Font Dasar
- Font size body: `16px`
- Line height body: `1.8`
- Heading line height: `1.2`

---

## Animasi

### Animasi Kustom

Tiga animasi custom didefinisikan di `@theme {}` dan `@keyframes`:

| Token | Durasi | Easing | Efek |
|---|---|---|---|
| `--animate-fade-in-up` | `800ms` | `cubic-bezier(0.22, 1, 0.36, 1)` | Fade + slide dari bawah 18px |
| `--animate-fade-in` | `300ms` | `ease-out` | Fade sederhana |
| `--animate-slide-up` | `400ms` | `cubic-bezier(0.16, 1, 0.3, 1)` | Slide dari bawah 24px |

**Penggunaan di kelas**: `animate-fade-in-up`, `animate-fade-in`, `animate-slide-up`

**Contoh penggunaan:**
```html
<p class="animate-fade-in-up opacity-0 [animation-delay:120ms]">Teks masuk dari bawah</p>
```

### Scroll Reveal (CSS)
Selain animasi Framer Motion, tersedia utility CSS manual:

```css
.scroll-reveal { opacity: 0; transform: translateY(40px); transition: opacity 700ms, transform 700ms; }
.scroll-reveal.is-visible { opacity: 1; transform: translateY(0); }
```

### Scroll Reveal (Framer Motion)
Komponen `ScrollReveal.tsx` menggunakan Framer Motion `whileInView` dengan easing kustom `[0.21, 0.47, 0.32, 0.98]`.

---

## Elemen UI

### Button

#### Button Primer
```html
<button class="px-8 py-3.5 bg-primary text-white text-sm font-bold rounded-md hover:bg-primary-dark shadow-sm transition-all duration-300 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
  Teks Tombol
</button>
```

#### Button Transparan (Hero)
```html
<a class="px-10 py-4 bg-transparent border border-white/30 text-white text-sm uppercase tracking-widest hover:bg-white hover:text-primary-dark transition-all duration-500 rounded-md">
  Teks Tombol
</a>
```

#### Button Link
```html
<a class="inline-flex items-center gap-2 text-sm text-primary font-bold hover:text-primary-dark hover:underline underline-offset-8 transition-all">
  Lihat Semua →
</a>
```

---

### Card

#### Card Standar
Semua kartu menggunakan pola:
```html
<div class="bg-surface rounded-2xl border border-border hover:border-primary hover:shadow-md transition-all duration-300">
  <!-- konten -->
</div>
```

#### Card Info / Navigasi
Kartu yang bisa diklik:
```html
<a class="group flex flex-col items-center text-center p-6 bg-surface border border-border shadow-sm rounded-2xl hover:shadow-md hover:border-primary transition-all duration-300">
  <!-- ikon, judul, deskripsi -->
</a>
```

---

### Input Form

Semua input menggunakan pola yang konsisten:
```html
<input class="w-full bg-surface border border-border text-text-primary placeholder:text-text-muted text-sm rounded-md px-5 py-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent hover:border-primary transition-all duration-200" />
```

---

### Badge / Label Kategori

```html
<!-- Kategori Publikasi -->
<span class="text-[10px] font-bold uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1.5 rounded-full">
  Renungan Harian
</span>
```

---

## Ikon

Semua ikon menggunakan **Lucide React** dengan ukuran yang konsisten:
- Ikon navigasi & aksi: `size={18}` atau `size={20}`
- Ikon kecil/inline: `size={13}` atau `size={16}`
- Ikon besar/dekoratif: `size={26}` atau `size={28}`

---

## Border & Shadow

| Elemen | Nilai |
|---|---|
| Border radius standar | `rounded-2xl` (16px) |
| Border radius kecil | `rounded-xl` (12px) |
| Border radius tombol utama | `rounded-md` (6px) |
| Shadow standar kartu | `shadow-sm` |
| Shadow hover kartu | `shadow-md` |
| Border warna | `border-border` (`#E5E7EB`) |
| Border saat hover/aktif | `border-primary` (`#0E63E9`) |

---

## Responsive Breakpoints

Tailwind CSS 4 menggunakan breakpoint bawaan:

| Breakpoint | Nilai |
|---|---|
| `sm` | `640px` |
| `md` | `768px` |
| `lg` | `1024px` |
| `xl` | `1280px` |
| `2xl` | `1536px` |

Pola yang umum digunakan dalam proyek:
- Grid 1 kolom mobile → 2 kolom tablet → 3/4/5 kolom desktop
- Navbar: hamburger di `< lg`, horizontal di `>= lg`
- MapExplorer: tab map/list di mobile, layout split di `>= lg`

---

## Hover States

- Kartu: `hover:border-primary hover:shadow-md`
- Tombol: `hover:bg-primary-dark`
- Link teks: `hover:text-text-primary` atau `hover:text-primary`
- Navigasi: `hover:bg-white/5` (transparan saat di hero)

---

## Focus States (Aksesibilitas)

Semua elemen interaktif menggunakan outline fokus yang konsisten:
```css
*:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
  border-radius: 4px;
}
```

Tombol utama juga menggunakan `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`.

---

## Scrollbar

Secara default, scrollbar disembunyikan di seluruh halaman publik:
```css
html::-webkit-scrollbar, body::-webkit-scrollbar { display: none; }
html { scrollbar-width: none; }
```

Utility `.no-scrollbar` juga tersedia untuk elemen individual.

---

## Aksesibilitas Motion

Untuk pengguna yang memilih mengurangi gerakan (`prefers-reduced-motion`):
```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .scroll-reveal, .animate-fade-in-up { opacity: 1; transform: none; animation: none; }
}
```

---

## Pattern Background

`Section` komponen dengan prop `pattern={true}` menampilkan grid pattern tipis:
```css
background-image: linear-gradient(var(--color-primary) 1px, transparent 1px),
                  linear-gradient(90deg, var(--color-primary) 1px, transparent 1px);
background-size: 80px 80px;
opacity: 0.03;
```
