"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import type { FinancialReport } from "@/lib/types";
import {
  getAllFinancialReports,
  getMonthNameID,
  getAvailableYears,
  filterFinancialReports,
  getDownloadUrl,
  formatFileSize,
} from "@/lib/laporan-keuangan";
import { Search, ChevronRight, FileText, Download, ExternalLink, Calendar } from "lucide-react";

function formatUploadDate(iso: string): string {
  return new Date(iso).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

export default function LaporanKeuanganPage() {
  const [reports, setReports] = useState<FinancialReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | "Semua">("Semua");

  useEffect(() => {
    let isMounted = true;
    getAllFinancialReports().then((data) => {
      if (isMounted) {
        setReports(data);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const availableYears = useMemo(() => getAvailableYears(reports), [reports]);

  const yearGroups = useMemo(() => {
    const filtered = filterFinancialReports(reports, selectedYear, searchQuery);
    const groups = new Map<number, FinancialReport[]>();
    filtered.forEach((r) => {
      if (!groups.has(r.year)) groups.set(r.year, []);
      groups.get(r.year)!.push(r);
    });
    return Array.from(groups.entries()).sort((a, b) => b[0] - a[0]);
  }, [reports, selectedYear, searchQuery]);

  const totalFiltered = yearGroups.reduce((sum, [, list]) => sum + list.length, 0);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-text-primary">
      <Navbar />

      <section className="relative overflow-hidden bg-background pb-10 pt-32 md:pb-14">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="relative mx-auto w-full max-w-4xl px-5 sm:px-8">
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-text-primary/75 transition-colors hover:text-primary"
            >
              Beranda
            </Link>
            <ChevronRight size={14} className="text-text-primary/30" />
            <span className="text-sm font-medium text-primary">Laporan Keuangan</span>
          </nav>

          <ScrollReveal>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-primary">
              Transparansi Pelayanan
            </p>
            <h1
              className="mb-3 max-w-2xl text-3xl font-bold leading-tight text-text-primary sm:text-4xl"
            >
              Laporan Keuangan Sinode
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-text-secondary md:text-base mb-8">
              Dokumen laporan keuangan GKPI Sinode tiap bulan, terbuka untuk jemaat.
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary/60"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama laporan, bulan, atau tahun..."
                  className="w-full rounded-xl border border-border bg-surface py-3 pl-11 pr-4 text-sm text-text-primary outline-none focus:border-primary/40 focus:bg-surface transition-all"
                />
              </div>
              <select
                value={selectedYear}
                onChange={(e) =>
                  setSelectedYear(e.target.value === "Semua" ? "Semua" : parseInt(e.target.value))
                }
                className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary outline-none focus:border-primary/40 cursor-pointer"
              >
                <option value="Semua">Semua Tahun</option>
                {availableYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-4xl px-5 pb-24 sm:px-8">
        {isLoading ? (
          <div className="py-16 text-center text-sm text-text-secondary">Memuat laporan...</div>
        ) : totalFiltered === 0 ? (
          <ScrollReveal>
            <div className="rounded-2xl border border-dashed border-border py-16 text-center">
              <FileText size={28} className="mx-auto mb-3 text-text-secondary/50" />
              <h3 className="text-lg font-bold text-text-primary">Tidak ada laporan ditemukan</h3>
              <p className="text-sm text-text-secondary mt-1">Coba kata kunci atau tahun lain.</p>
            </div>
          </ScrollReveal>
        ) : (
          <div className="space-y-10">
            {yearGroups.map(([year, yearReports]) => (
              <ScrollReveal key={year}>
                <div>
                  <div className="mb-4 flex items-center justify-between gap-3 border-b border-border/50 pb-3">
                    <h2
                      className="text-lg font-bold text-text-primary"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Tahun {year}
                    </h2>
                    <span className="text-xs text-text-secondary">
                      {yearReports.length} laporan
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-border/60 divide-y divide-border/50">
                    {yearReports.map((report) => (
                      <div
                        key={report.id}
                        className="flex flex-col gap-4 bg-surface/20 p-5 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <a
                          href={report.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="group flex min-w-0 flex-1 items-start gap-4"
                        >
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <FileText size={20} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="truncate font-bold text-text-primary transition-colors group-hover:text-primary">
                                {report.name}
                              </p>
                              <span className="shrink-0 rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary">
                                {getMonthNameID(report.month)} {report.year}
                              </span>
                            </div>
                            {report.description && (
                              <p className="mt-1 line-clamp-2 text-xs text-text-secondary">
                                {report.description}
                              </p>
                            )}
                            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-text-secondary/70">
                              <Calendar size={11} />
                              Diunggah {formatUploadDate(report.created_at)}
                              {report.file_size ? ` · ${formatFileSize(report.file_size)}` : ""}
                            </p>
                          </div>
                        </a>

                        <div className="flex shrink-0 items-center gap-2 sm:justify-end">
                          <a
                            href={report.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 text-xs font-bold text-text-secondary transition-all hover:border-primary/40 hover:text-primary"
                          >
                            <ExternalLink size={13} /> Buka
                          </a>
                          <a
                            href={getDownloadUrl(report)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-2 text-xs font-bold text-primary transition-all hover:bg-primary/10"
                          >
                            <Download size={13} /> Unduh
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}