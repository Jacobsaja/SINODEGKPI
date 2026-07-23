import Image from "next/image";
import Link from "next/link";

export default function ResortHero() {
  return (
    <section className="relative flex h-[85vh] min-h-[560px] w-full items-center justify-center overflow-hidden bg-background lg:h-[90vh]">
      <div className="absolute inset-0 z-0">
        <Image
          src="/resort-hero-bg.png"
          alt="Suasana gereja GKPI"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          quality={90}
        />
        <div className="absolute inset-0 bg-primary/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-primary/45 to-background/90" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-5 text-center text-text-primary sm:px-8">
        <p className="mb-5 animate-fade-in-up text-xs font-bold uppercase tracking-[0.28em] text-primary opacity-0 [animation-delay:120ms]">
          Pelayanan dan Wilayah
        </p>

        <h1 className="animate-fade-in-up font-serif text-4xl font-semibold leading-[1.05] text-white opacity-0 drop-shadow-sm sm:text-5xl md:text-6xl lg:text-7xl [animation-delay:220ms]">
          Resort & Jemaat Khusus GKPI
        </h1>

        <p className="mt-6 max-w-2xl animate-fade-in-up text-base font-semibold leading-8 text-white opacity-0 drop-shadow-sm sm:text-lg md:text-xl [animation-delay:360ms]">
          Temukan lokasi jemaat GKPI dan pahami struktur pelayanan di berbagai wilayah.
        </p>

        <Link
          href="#cari-jemaat"
          className="mt-9 inline-flex min-h-12 animate-fade-in-up items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-semibold text-white opacity-0 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:px-10 [animation-delay:500ms]"
        >
          Cari Jemaat
        </Link>

        <p className="mt-5 max-w-sm animate-fade-in-up text-sm leading-6 text-text-primary/80 opacity-0 sm:max-w-none [animation-delay:640ms]">
          Gunakan pencarian di bawah untuk menemukan gereja terdekat.
        </p>
      </div>
    </section>
  );
}
