# GKPI Sinode — Official Website

<p align="center">
  <img src="public/logo.png" alt="GKPI Logo" width="100" />
</p>

<p align="center">
  <strong>Gereja Kristen Protestan Indonesia — Sinode</strong><br/>
  Official web presence for GKPI, serving the congregation since 1964.
</p>

<p align="center">
  <a href="https://sinodegkpi.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/Live%20Site-sinodegkpi.vercel.app-blue?style=for-the-badge&logo=vercel" alt="Live Site" />
  </a>
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-BaaS-green?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-teal?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS" />
</p>

---

## 📖 Project Overview

The **GKPI Sinode Website** is the official digital platform of *Gereja Kristen Protestan Indonesia* (GKPI), a Protestant denomination headquartered in Pematangsiantar, North Sumatra, Indonesia, founded on **30 August 1964**.

This website serves as the central hub for the GKPI congregation — providing information about the church, its leadership, publications, financial reports, an interactive church-location map, a merchandise store, and a protected admin panel for content management.

The application is deployed at **[https://sinodegkpi.vercel.app](https://sinodegkpi.vercel.app)**.

---

## 🎯 Project Goals

- Provide a modern, accessible digital home for GKPI congregation members.
- Enable easy discovery of local churches using an interactive map.
- Publish devotional content, announcements, and church news.
- Offer transparent access to financial reports.
- Manage church leadership (Pengurus) structure dynamically.
- Facilitate a product store for GKPI-branded merchandise.
- Provide a secure admin panel for authorized content management.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Hero Slideshow** | Full-screen auto-rotating slideshow with Scripture verses |
| **About GKPI** | Church history, vision, mission, and service mottos |
| **Info Slideshow** | Featured announcements and church profile highlights |
| **Publications & Devotionals** | List, filter, and read church publications (Berita, Renungan, Kegiatan, Dokumen) |
| **Church Map (Wilayah & Resort)** | Interactive Leaflet map with search, city filter, and nearest church finder |
| **Church Leadership (Pengurus)** | Dynamically managed sectioned board with modal detail view |
| **Partnership Directory (Mitra)** | Grid of ministry partner logos with detail pages |
| **GKPI Store (Toko)** | Product catalog with Tokopedia & Shopee buy links |
| **Financial Reports** | Publicly accessible financial report PDFs |
| **Contact Form** | UI form on the homepage for congregation inquiries |
| **Admin Panel** | Protected CMS to manage Publications, Products, Leadership, Jemaat, Financial Reports, Contact Messages, and Shared Files |
| **Share Files** | Time-limited or code-protected file sharing for internal documents |
| **SEO** | Full Open Graph, Twitter Card, sitemap.xml, robots.txt |

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, RSC + Client Components) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) with custom `@theme` design tokens |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage) |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) |
| **Maps** | [Leaflet](https://leafletjs.com/) + [React Leaflet](https://react-leaflet.js.org/) + [React Leaflet Cluster](https://github.com/akursat/react-leaflet-cluster) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Image Compression** | [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression) |
| **Deployment** | [Vercel](https://vercel.com/) |
| **Fonts** | Inter (sans-serif), Playfair Display (serif) via Google Fonts |

---

## 📁 Folder Structure

```
PROGRAM/
├── public/                     # Static assets (images, logos, partner logos)
│   ├── logo.png
│   ├── hero_slide_*.png
│   └── mitra/                  # Partner logo images
│
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with global metadata
│   │   ├── page.tsx            # Homepage
│   │   ├── globals.css         # Global styles + Tailwind @theme tokens
│   │   ├── sitemap.ts          # Auto-generated sitemap.xml
│   │   ├── robots.ts           # robots.txt
│   │   ├── profil-gkpi/        # Church profile page
│   │   ├── pengurus/           # Church leadership page
│   │   ├── wilayah-resort/     # Church map & resort page
│   │   ├── publikasi/          # Publications list + detail [id]
│   │   ├── toko/               # GKPI Store
│   │   ├── mitra/              # Ministry partners
│   │   ├── kontak/             # Contact page
│   │   ├── laporan-keuangan/   # Public financial reports
│   │   ├── info/               # Info redirect page
│   │   ├── gkpi/               # Legacy/alias route
│   │   ├── tentang-gkpi/       # About page
│   │   ├── api/
│   │   │   └── sharefile/      # API routes for secure file sharing
│   │   │       ├── download/
│   │   │       └── verify/
│   │   └── admin/              # Protected admin panel
│   │       ├── layout.tsx      # Auth gate + sidebar shell
│   │       ├── page.tsx        # Admin dashboard
│   │       ├── publikasi/      # Manage publications
│   │       ├── toko/           # Manage store products
│   │       ├── pengurus/       # Manage church leadership
│   │       ├── jemaat/         # Manage congregations
│   │       ├── kontak/         # Manage contact messages
│   │       ├── laporan-keuangan/ # Manage financial reports
│   │       └── sharefiles/     # Manage shared file folders
│   │
│   ├── components/             # Reusable React components
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── Footer.tsx
│   │   ├── Section.tsx
│   │   ├── Card.tsx
│   │   ├── ScrollReveal.tsx
│   │   ├── InfoSlideshow.tsx
│   │   ├── InfoCarousel.tsx
│   │   ├── ResortHero.tsx
│   │   ├── PengurusModal.tsx
│   │   ├── ProductCard.tsx
│   │   ├── admin/              # Admin-specific components
│   │   │   ├── AdminSidebar.tsx
│   │   │   └── jemaat/
│   │   │       └── JemaatFormModal.tsx
│   │   ├── publikasi/          # Publication-specific components
│   │   │   ├── CopyLinkButton.tsx
│   │   │   └── GalleryLightbox.tsx
│   │   └── wilayah/            # Map & church finder components
│   │       ├── MapExplorer.tsx
│   │       ├── MapView.tsx
│   │       ├── ChurchListPanel.tsx
│   │       ├── ChurchListItem.tsx
│   │       ├── ChurchDetailPanel.tsx
│   │       ├── NearestChurchFinder.tsx
│   │       └── SearchFilterBar.tsx
│   │
│   ├── lib/                    # Utility functions & data access layer
│   │   ├── supabase.ts         # Supabase client singleton
│   │   ├── types.ts            # Shared TypeScript types
│   │   ├── assets.ts           # Static asset path constants
│   │   ├── publications.ts     # Publication CRUD + formatters
│   │   ├── products.ts         # Product CRUD + formatters
│   │   ├── pengurus.ts         # Leadership CRUD + types
│   │   ├── laporan-keuangan.ts # Financial report CRUD + helpers
│   │   ├── publikasi-upload.ts # Image/document upload helpers
│   │   ├── image-compress.ts   # Client-side image compression presets
│   │   ├── haversine.ts        # Geolocation distance calculator
│   │   └── sharefile-types.ts  # Share Files type definitions
│   │
│   └── data/
│       ├── jemaat.ts           # Jemaat data layer (Supabase-backed)
│       └── mitraDetails.ts     # Static mitra partner detail data
│
├── .env.local                  # Local environment variables (not committed)
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── postcss.config.mjs          # PostCSS + Tailwind CSS configuration
└── package.json                # Dependencies and scripts
```

---

## 🚀 Installation

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- A **Supabase** project with the required tables (see [docs/13-Environment.md](docs/13-Environment.md))

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PROGRAM
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file at the project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ▶️ Running the Project

| Command | Description |
|---|---|
| `npm run dev` | Start local development server (hot reload) |
| `npm run build` | Build the production bundle |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint checks |

---

## 🏗 Build

```bash
npm run build
```

The production build will be output to `.next/`. This is handled automatically by Vercel on every push to the deployment branch.

---

## 🌐 Deployment

This project is deployed on **[Vercel](https://vercel.com/)**.

- **Production URL**: `https://sinodegkpi.vercel.app`
- **Deployment Trigger**: Automatic on push to the main branch
- **Build Command**: `next build` (configured by Vercel)
- **Output Directory**: `.next`

To deploy manually, connect the repository to a Vercel project and configure the environment variables in the Vercel dashboard.

---

## 🔐 Environment Variables

| Variable | Scope | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project API URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase anonymous (public) key for read operations |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | Supabase service role key for elevated server-side operations |

> ⚠️ **Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.** It is used only in server-side API routes.

---

## 📸 Screenshots

> *Screenshots will be added here.*

| Page | Preview |
|---|---|
| Homepage | *(pending)* |
| Church Map | *(pending)* |
| Publications | *(pending)* |
| Admin Dashboard | *(pending)* |

---

## 🤝 Contributing

This project is maintained by the GKPI IT Team. Contributions are welcome from authorized team members.

1. Fork or clone the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: describe your change"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request for review.

Please refer to [docs/15-Panduan-Kontributor.md](docs/15-Panduan-Kontributor.md) for the full contribution guide in Bahasa Indonesia.

---

## 📄 License

This project is **private** and belongs to GKPI Sinode. All rights reserved. No part of this codebase may be reproduced, distributed, or used outside the organization without explicit written permission.

---

## 📬 Contact

For technical matters, please contact the GKPI IT Team.

- **Email**: info@gkpi.or.id
- **Website**: [https://sinodegkpi.vercel.app](https://sinodegkpi.vercel.app)
- **Instagram**: [@gkpisinode_official](https://www.instagram.com/gkpisinode_official/)
- **Facebook**: [GKPI Community](https://www.facebook.com/share/g/1D6Mpnv3uB/)
- **YouTube**: [GKPI YouTube Channel](https://www.youtube.com/channel/UCtvKVh4B_w5QVvLtsGslcdg)
