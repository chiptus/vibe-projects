export interface ProjectLink {
  name: string;
  title: string;
  description: string;
  /** Path this project is served at when deployed alongside the hub. */
  href: string;
}

// Keep in sync with the root README's project list.
export const PROJECTS: ProjectLink[] = [
  {
    name: "yayog-tracker",
    title: "YAYOG Tracker",
    description: "Mobile-first workout tracker for the YAYOG \"Basic\" program.",
    href: "/yayog-tracker/",
  },
  {
    name: "trilled-r-trainer",
    title: "Trilled R Trainer",
    description: "Interval-timer trainer for the Spanish rolled R (RR).",
    href: "/trilled-r-trainer/",
  },
];
