import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

interface CardProps {
  title: string;
  excerpt: string;
  date?: string;
  category?: string;
  href?: string;
}

export default function Card({
  title,
  excerpt,
  date,
  category,
  href = "#",
}: CardProps) {
  return (
    <article className="group bg-surface rounded-3xl border border-border hover:border-accent/30 hover:shadow-2xl hover:shadow-black/20 transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Card body */}
      <div className="flex-1 p-8 space-y-5">
        {/* Meta row */}
        <div className="flex items-center gap-3 flex-wrap">
          {category && (
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent bg-accent/10 px-3 py-1.5 rounded-full">
              {category}
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
        <h3 className="text-xl font-sans font-bold text-text-primary group-hover:text-accent transition-colors duration-200 leading-tight">
          {title}
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
            href="/publikasi"
            className="inline-flex items-center gap-2 text-sm text-accent font-bold hover:gap-3 transition-all duration-200"
          >
            Baca Selengkapnya
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
