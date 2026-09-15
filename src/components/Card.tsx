import Link from "next/link";
import { ArrowRight, Calendar, Headphones } from "lucide-react";

interface CardProps {
  title: string;
  excerpt: string;
  date?: string;
  category?: string;
  href?: string;
  hasAudio?: boolean;
}

export default function Card({
  title,
  excerpt,
  date,
  category,
  href = "#",
  hasAudio = false,
}: CardProps) {
  return (
    <article className="group bg-surface rounded-2xl border border-border hover:border-primary hover:shadow-md transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Card body */}
      <div className="flex-1 p-8 space-y-5">
        {/* Meta row */}
        <div className="flex items-center gap-3 flex-wrap">
          {category && (
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary bg-primary/10 px-3 py-1.5 rounded-full">
              {category}
            </span>
          )}
          {hasAudio && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
              <Headphones size={11} />
              Audio
            </span>
          )}
          {date && (
            <span className="flex items-center gap-1.5 text-xs text-text-secondary">
              <Calendar size={13} />
              {date}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-sans font-bold text-text-primary group-hover:text-primary transition-colors duration-200 leading-tight">
          <Link href={href || "/publikasi"}>
            {title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
          {excerpt}
        </p>
      </div>

      {/* Card footer */}
      <div className="px-8 pb-8">
        <div className="pt-6 border-t border-border/50">
          <Link
            href={href || "/publikasi"}
            className="inline-flex items-center gap-2 text-sm text-primary font-bold hover:text-primary-dark hover:gap-3 transition-all duration-200"
          >
            Baca Selengkapnya
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
