import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { getAllPublications, formatDateID } from "@/lib/publications";
import {
  DEPARTMENTS,
  VALID_DEPARTMENT_SLUGS,
} from "@/lib/departmentConfig";
import type { Publication } from "@/lib/types";
import {
  Calendar,
  User,
  Clock,
  ChevronRight,
  ArrowLeft,
  FileText,
  Megaphone,
  BookOpen,
  Sparkles,
  Bookmark,
  CalendarDays,
  HeartHandshake,
  Compass,
  Users,
} from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return VALID_DEPARTMENT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const config = DEPARTMENTS[slug.toLowerCase()];

  if (!config) {
    return { title: "Departemen Tidak Ditemukan | GKPI" };
  }

  return {
    title: `Publikasi ${config.name} | GKPI`,
    description: config.description,
    openGraph: {
      title: `Publikasi ${config.name} | Sinode GKPI`,
      description: config.description,
      type: "website",
    },
  };
}

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

const getDeptIcon = (iconName: string) => {
  switch (iconName) {
    case "HeartHandshake":
      return <HeartHandshake className="h-8 w-8 text-primary" />;
    case "Compass":
      return <Compass className="h-8 w-8 text-primary" />;
    case "Users":
      return <Users className="h-8 w-8 text-primary" />;
    default:
      return <Sparkles className="h-8 w-8 text-primary" />;
  }
};

export default async function DepartmentPublicationPage({ params }: Props) {
  const { slug } = await params;
  const normalizedSlug = slug.toLowerCase();

  const config = DEPARTMENTS[normalizedSlug];
  if (!config) {
    notFound();
  }

  const publications: Publication[] = await getAllPublications(config.department);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-text-primary">
      <Navbar />

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[45vh] items-end overflow-hidden bg-background pb-12 pt-32 md:min-h-[50vh] md:pb-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-bg.webp"
            alt={`Publikasi ${config.name}`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            quality={90}
          />
          <div className="absolute inset-0 bg-primary-dark/20 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-primary-dark/10 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/90" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-text-primary/75 transition-colors hover:text-primary"
            >
              Beranda
            </Link>
            <ChevronRight size={14} className="text-text-primary/30" />
            <Link
              href="/publikasi"
              className="flex items-center gap-1.5 text-sm text-text-primary/75 transition-colors hover:text-primary"
            >
              Publikasi
            </Link>
            <ChevronRight size={14} className="text-text-primary/30" />
            <span className="text-sm font-medium text-primary">{config.shortName}</span>
          </nav>

          <ScrollReveal>
            <div className="mb-4 inline-flex items-center gap-3 rounded-2xl border border-border/80 bg-surface/80 px-4 py-2 backdrop-blur-md">
              {getDeptIcon(config.iconName)}
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                Publikasi Departemen
              </span>
            </div>
            <h1 className="mb-4 max-w-3xl text-4xl font-bold leading-tight text-text-primary sm:text-5xl lg:text-6xl">
              {config.name}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
              {config.description}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Content Section ───────────────────────────────────────────── */}
      <section className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-16">
        <ScrollReveal>
          <div className="mb-8 flex items-center justify-between border-b border-border/40 pb-4">
            <Link
              href="/publikasi"
              className="inline-flex items-center gap-2 text-xs font-bold text-text-secondary hover:text-primary transition-colors"
            >
              <ArrowLeft size={16} />
              Lihat Semua Publikasi Sinode
            </Link>
            <span className="text-xs font-semibold text-text-secondary">
              {publications.length} Artikel Diterbitkan
            </span>
          </div>
        </ScrollReveal>

        {/* Grid List */}
        {publications.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {publications.map((post) => (
              <ScrollReveal key={post.id}>
                <Link
                  href={`/publikasi/${post.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm shadow-black/5 hover:-translate-y-1 hover:border-primary/30 hover:bg-surface hover:shadow-sm hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
                  style={{ backdropFilter: "blur(12px)" }}
                >
                  {/* Card Thumbnail */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
                    <Image
                      src={post.image || "/hero-bg.webp"}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 30vw, 50vw"
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
                    <span className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-primary backdrop-blur">
                      {getCategoryIcon(post.category)}
                      {post.category}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col p-6">
                    {/* Meta */}
                    <div className="mb-3.5 flex items-center gap-4 text-xs text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Calendar size={13} className="text-primary" />
                        {formatDateID(post.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={13} className="text-primary" />
                        {post.read_time}
                      </span>
                    </div>

                    {/* Title & Desc */}
                    <h3
                      className="font-serif text-lg font-bold text-text-primary mb-2 leading-snug group-hover:text-primary transition-colors"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {post.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Author / Footer */}
                    <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7.5 w-7.5 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <User size={13} />
                        </div>
                        <span className="text-xs font-semibold text-text-primary">
                          {post.author}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:underline">
                        <span>Buka</span>
                        <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <ScrollReveal>
            <div className="my-16 flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-border/40 bg-surface/20">
              <FileText size={48} className="text-text-secondary mb-4 opacity-50" />
              <h3 className="text-lg font-bold text-white">Belum Ada Publikasi</h3>
              <p className="text-sm text-text-secondary mt-1">
                Belum ada publikasi yang diunggah untuk {config.name}.
              </p>
            </div>
          </ScrollReveal>
        )}
      </section>

      <Footer />
    </main>
  );
}
