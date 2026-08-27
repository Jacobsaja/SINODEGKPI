import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import GalleryLightbox from "@/components/publikasi/GalleryLightbox";
import BookmarkButton from "@/components/publikasi/BookmarkButton";
import ShareMenu from "@/components/publikasi/ShareMenu";
import { getPublicationById, formatDateID, formatViewsID } from "@/lib/publications";
import {
  Calendar,
  User,
  Clock,
  Eye,
  ChevronRight,
  ArrowLeft,
  FileText,
  Download,
  Megaphone,
  BookOpen,
  Sparkles,
  Bookmark,
  CalendarDays,
} from "lucide-react";

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Berita":
      return <BookOpen size={14} />;
    case "Pengumuman":
      return <Megaphone size={14} />;
    case "Kegiatan":
      return <CalendarDays size={14} />;
    case "Dokumen":
      return <FileText size={14} />;
    case "Renungan Harian":
      return <Bookmark size={14} />;
    default:
      return <Sparkles size={14} />;
  }
};

/** Ambil label ekstensi file dari URL untuk ditampilkan di kartu lampiran (mis. "PDF"). */
function getFileLabel(url: string): string {
  const ext = url.split(".").pop()?.split("?")[0]?.toUpperCase() ?? "FILE";
  return ext.length <= 5 ? ext : "FILE";
}

// NOTE: Jika project ini sudah di Next.js 15+ dan `params` datang sebagai
// Promise, ubah tipe di bawah jadi `Promise<{ id: string }>` lalu
// `const { id } = await params;` di kedua fungsi.
export const revalidate = 3600; // Cache Edge CDN 1 jam

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const post = await getPublicationById(id);

  if (!post) {
    return { title: "Publikasi Tidak Ditemukan | GKPI" };
  }

  return {
    title: `${post.title} | Publikasi GKPI`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : undefined,
      type: "article",         
      publishedTime: post.date,
    },
  };
}

export default async function PublikasiDetailPage({ params }: Props) {
  const { id } = await params;
  const post = await getPublicationById(id);

  if (!post) {
    notFound();
  }

  // Galeri: pakai `images` (array, kalau admin sudah upload banyak gambar),
  // fallback ke `image` tunggal supaya kompatibel dengan data lama.
  const galleryRaw =
    post.images && post.images.length > 0 ? post.images : [post.image];
  const gallery = galleryRaw.filter((img): img is string => Boolean(img && img.trim() !== ""));
  if (gallery.length === 0) gallery.push("/hero-bg.webp");

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-text-primary">
      <Navbar />

      <section className="relative pb-16 pt-32 md:pt-36">
        <div className="mx-auto w-full max-w-4xl px-5 sm:px-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2">
            <Link
              href="/"
              className="text-sm text-text-primary/75 transition-colors hover:text-primary"
            >
              Beranda
            </Link>
            <ChevronRight size={14} className="text-text-primary/30" />
            <Link
              href="/publikasi"
              className="text-sm text-text-primary/75 transition-colors hover:text-primary"
            >
              Publikasi
            </Link>
            <ChevronRight size={14} className="text-text-primary/30" />
            <span className="max-w-[200px] truncate text-sm font-medium text-primary sm:max-w-xs">
              {post.title}
            </span>
          </nav>

          <ScrollReveal>
            <Link
              href="/publikasi"
              className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition-colors hover:text-primary"
            >
              <ArrowLeft size={16} />
              Kembali ke Publikasi
            </Link>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary">
                {getCategoryIcon(post.category)}
                {post.category}
              </span>
              <div className="flex items-center gap-2">
                <BookmarkButton id={post.id} />
                <ShareMenu title={post.title} />
              </div>
            </div>

            <h1
              className="mb-6 text-3xl font-bold leading-tight text-text-primary sm:text-4xl lg:text-5xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {post.title}
            </h1>

            <div className="mb-10 flex flex-wrap gap-5 border-b border-border/50 pb-6 text-xs text-text-secondary">
              <span className="flex items-center gap-2">
                <Calendar size={14} className="text-primary" />
                {formatDateID(post.date)}
              </span>
              <span className="flex items-center gap-2">
                <User size={14} className="text-primary" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={14} className="text-primary" />
                {post.read_time}
              </span>
              <span className="flex items-center gap-2">
                <Eye size={14} className="text-primary" />
                {formatViewsID(post.views)} dilihat
              </span>
            </div>
          </ScrollReveal>

          {/* Galeri Gambar */}
          <ScrollReveal>
            <GalleryLightbox images={gallery} title={post.title} />
          </ScrollReveal>

          {/* Konten */}
          <ScrollReveal>
            <div className="mt-10 space-y-5 text-base leading-relaxed text-text-primary md:text-lg">
              <p className="first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-5xl first-letter:font-bold first-letter:text-primary">
                {post.content}
              </p>
              <p className="rounded-r-lg border-l-2 border-primary/20 bg-surface py-2 pl-4 text-sm italic text-text-secondary">
                Informasi ini akan diperbarui mengikuti materi resmi dari
                pengurus dan bidang pelayanan terkait.
              </p>
            </div>
          </ScrollReveal>

          {/* Dokumen Lampiran (bisa lebih dari satu file) */}
          {post.documents && post.documents.length > 0 && (
            <ScrollReveal>
              <div className="mt-10 space-y-3">
                <h2 className="mb-1 text-sm font-bold uppercase tracking-widest text-text-secondary">
                  Lampiran Dokumen
                </h2>
                {post.documents.map((doc, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-5 sm:flex-row"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">
                          {doc.name}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {doc.size ? `${doc.size} · ` : ""}
                          {getFileLabel(doc.url)}
                        </p>
                      </div>
                    </div>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-background shadow transition-all hover:bg-primary/90"
                    >
                      <Download size={14} />
                      Unduh
                    </a>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
