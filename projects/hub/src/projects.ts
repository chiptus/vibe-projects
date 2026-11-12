export interface ProjectLink {
  name: string;
  title: string;
  description: string;
  /** Path this project is served at when deployed alongside the hub, or an absolute URL when it is deployed elsewhere. */
  href: string;
  /** True when `href` points off-site; the card opens in a new tab. */
  external?: boolean;
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
  {
    name: "garmin-podcast",
    title: "Garmin Podcast",
    description: "Pick podcast episodes and sync them to a Garmin watch.",
    // TODO: point at the deployed Worker URL (<name>.<account-subdomain>.workers.dev) once it exists.
    href: "https://github.com/chiptus/vibe-projects/tree/main/projects/garmin-podcast",
    external: true,
  },
];
