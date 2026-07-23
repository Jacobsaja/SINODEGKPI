# 10 — State Management

## Pendekatan State Management

Proyek ini **tidak menggunakan library state management eksternal** seperti Redux, Zustand, atau Jotai. Semua state dikelola menggunakan primitif React bawaan:

- `useState` — State lokal komponen
- `useEffect` — Side effects (fetch data, event listener, timer)
- `useCallback` — Memoize fungsi handler
- `useMemo` — Memoize komputasi mahal
- Props drilling — Meneruskan state dari parent ke child
- URL Search Params — State yang disinkronkan ke URL

---

## Mengapa Tidak Ada Global State Manager?

Aplikasi ini adalah website berbasis konten dengan sedikit interaksi kompleks antar komponen yang jauh. Kebutuhan sharing state terbatas pada:

1. **Admin Layout** → meneruskan `email`, `onLogout`, `isOpen`, `onClose` ke `AdminSidebar` (4 level maksimal)
2. **MapExplorer** → meneruskan state peta ke `MapView`, `ChurchListPanel`, `ChurchDetailPanel`, `NearestChurchFinder` (1 komponen orkestrator)

Kedalaman state yang dangkal ini tidak memerlukan library tambahan.

---

## State Per Domain

### 1. Navbar State
**File**: `src/components/Navbar.tsx`

| State | Tipe | Keterangan |
|---|---|---|
| `isOpen` | `boolean` | Status menu mobile (terbuka/tertutup) |
| `isScrolled` | `boolean` | Apakah halaman sudah di-scroll lebih dari 24px |

```typescript
const [isOpen, setIsOpen] = useState(false);
const [isScrolled, setIsScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => setIsScrolled(window.scrollY > 24);
  window.addEventListener("scroll", handleScroll, { passive: true });
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
```

---

### 2. Hero Slideshow State
**File**: `src/components/Hero.tsx`

| State | Tipe | Keterangan |
|---|---|---|
| `current` | `number` | Index slide yang aktif saat ini |

Timer interval di `useEffect` memajukan `current` setiap 10 detik.

---

### 3. Admin Auth State
**File**: `src/app/admin/layout.tsx`

| State | Tipe | Keterangan |
|---|---|---|
| `session` | `boolean \| null` | Status sesi (`null` = loading, `false` = tidak login, `true` = login) |
| `email` | `string \| undefined` | Email pengguna yang login |
| `loginEmail` | `string` | Input email form login |
| `loginPassword` | `string` | Input password form login |
| `authError` | `string` | Pesan error dari Supabase Auth |
| `loggingIn` | `boolean` | Status loading saat proses login |
| `sidebarOpen` | `boolean` | Status sidebar mobile |

State `session === null` digunakan untuk menampilkan layar kosong sementara menunggu resolusi auth (menghindari flicker).

```typescript
useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    setSession(!!data.session);
    setEmail(data.session?.user.email ?? undefined);
  });
  const { data: listener } = supabase.auth.onAuthStateChange((_e, sess) => {
    setSession(!!sess);
    setEmail(sess?.user.email ?? undefined);
  });
  return () => listener.subscription.unsubscribe();
}, []);
```

---

### 4. MapExplorer State
**File**: `src/components/wilayah/MapExplorer.tsx`

| State | Tipe | Keterangan |
|---|---|---|
| `selectedJemaat` | `Jemaat \| null` | Gereja yang sedang dipilih |
| `nearestChurches` | `JemaatWithDistance[]` | Hasil pencarian gereja terdekat |
| `isNearestMode` | `boolean` | Apakah mode terdekat aktif |
| `userLocation` | `{ lat, lng } \| null` | Koordinat GPS pengguna |
| `flyTo` | `{ lat, lng, zoom? } \| null` | Target animasi peta |
| `mobileTab` | `"map" \| "list"` | Tab aktif di tampilan mobile |
| `searchQuery` | `string` | Teks pencarian |
| `activeCity` | `string \| null` | Kota yang difilter |

State `searchQuery` dan `activeCity` disinkronkan ke URL:
```typescript
useEffect(() => {
  const params = new URLSearchParams();
  if (searchQuery) params.set("search", searchQuery);
  if (activeCity) params.set("city", activeCity);
  router.replace(`?${params.toString()}`, { scroll: false });
}, [searchQuery, activeCity, router]);
```

Data yang dihitung dari state menggunakan `useMemo`:
```typescript
const filteredChurches = useMemo(() => {
  // Filter berdasarkan kota dan pencarian
}, [jemaatData, searchQuery, activeCity]);
```

---

### 5. AdminSidebar State
**File**: `src/components/admin/AdminSidebar.tsx`

| State | Tipe | Keterangan |
|---|---|---|
| `unreadCount` | `number` | Jumlah pesan belum dibaca (fetch dari Supabase) |

Di-fetch ulang setiap kali `pathname` berubah (navigasi admin).

---

### 6. InfoSlideshow State
**File**: `src/components/InfoSlideshow.tsx`

| State | Tipe | Keterangan |
|---|---|---|
| `currentIndex` | `number` | Index slide aktif |

Auto-advance setiap 6 detik via `setInterval`.

---

## Server Data (Bukan State)

Data yang di-fetch di **Server Components** tidak dikelola sebagai "state" dalam pengertian React biasa. Data ini ada saat render server dan dikirim ke browser sebagai HTML statis.

Contoh:
```typescript
// src/app/page.tsx (Server Component)
export default async function Home() {
  const latestPublications = await getLatestPublications(3); // server-side fetch
  // ...
}
```

Data ini tidak bisa diupdate tanpa refresh halaman atau navigasi ulang.

---

## URL sebagai State

Beberapa halaman menggunakan URL search params sebagai persistent state yang dapat dibagikan:

| Halaman | Search Params | Hook yang Digunakan |
|---|---|---|
| `/wilayah-resort` | `?search=&city=` | `useSearchParams()`, `useRouter()` |
| `/admin/publikasi` | `?tab=&edit=` | Tidak diketahui (perlu cek halaman admin) |

Pola ini memungkinkan pengguna menyimpan dan membagikan URL dengan filter yang sudah diterapkan.
