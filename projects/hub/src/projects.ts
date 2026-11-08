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
    // Placeholder until the Worker is deployed; update to the real workers.dev URL.
    href: "https://garmin-podcast.workers.dev/",
    external: true,
  },
];
