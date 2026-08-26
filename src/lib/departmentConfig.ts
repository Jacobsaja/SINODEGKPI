import type { PublicationDepartment } from "@/lib/types";

export interface DepartmentConfig {
  slug: string;
  department: PublicationDepartment;
  name: string;
  shortName: string;
  description: string;
  iconName: "HeartHandshake" | "Compass" | "Users";
  badgeColor: string;
}

export const DEPARTMENTS: Record<string, DepartmentConfig> = {
  diakonat: {
    slug: "diakonat",
    department: "Diakonat",
    name: "Departemen Diakonat",
    shortName: "Diakonat",
    description:
      "Mengkoordinasikan pelayanan kasih, kepedulian sosial, pemberdayaan masyarakat, dan bantuan kemanusiaan GKPI.",
    iconName: "HeartHandshake",
    badgeColor: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  },
  apostolat: {
    slug: "apostolat",
    department: "Apostolat",
    name: "Departemen Apostolat",
    shortName: "Apostolat",
    description:
      "Mengarahkan pelayanan pekabaran injil, misi pengutusan, pembinaan kategorial, dan perluasan jangkauan gereja.",
    iconName: "Compass",
    badgeColor: "bg-sky-400/10 text-sky-300 border-sky-400/20",
  },
  pastorat: {
    slug: "pastorat",
    department: "Pastorat",
    name: "Departemen Pastorat",
    shortName: "Pastorat",
    description:
      "Melakukan pendampingan penggembalaan, pembinaan wawasan teologi, kepemimpinan pelayan, dan kualitas spiritualitas jemaat.",
    iconName: "Users",
    badgeColor: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  },
};

export const VALID_DEPARTMENT_SLUGS = ["diakonat", "apostolat", "pastorat"] as const;
export type DepartmentSlug = (typeof VALID_DEPARTMENT_SLUGS)[number];
