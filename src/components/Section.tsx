import ScrollReveal from "@/components/ScrollReveal";

interface SectionProps {
  id?: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  narrow?: boolean;
  pattern?: boolean;
}

export default function Section({
  id,
  title,
  subtitle,
  children,
  className = "",
  dark = false, // In this new design, most sections are dark by default
  narrow = false,
  pattern = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`relative py-12 md:py-20 px-5 sm:px-8 overflow-hidden ${
        !pattern && !dark ? "bg-background" : ""
      } ${className}`}
      style={pattern ? {
        background: "linear-gradient(135deg, #0E63E9 0%, #0A3D91 40%, #0E63E9 70%, #0A3D91 100%)",
      } : {}}
    >
      {pattern && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/10 blur-[120px]" />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </div>
      )}

      <div className={`relative z-10 mx-auto ${narrow ? "max-w-4xl" : "max-w-7xl"}`}>
        <ScrollReveal>
          {(title || subtitle) && (
            <div className="text-center mb-12 md:mb-16 space-y-4">
              {title && (
                <h2 className={`text-3xl sm:text-4xl md:text-5xl font-sans font-bold tracking-tight ${
                  pattern || dark ? "text-white" : "text-text-primary"
                }`}>
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${
                  pattern || dark ? "text-blue-100/90" : "text-text-secondary"
                }`}>
                  {subtitle}
                </p>
              )}
              <div className={`w-16 h-1 mx-auto rounded-full ${
                pattern || dark ? "bg-accent" : "bg-primary/40"
              }`} />
            </div>
          )}
          {children}
        </ScrollReveal>
      </div>
    </section>
  );
}
