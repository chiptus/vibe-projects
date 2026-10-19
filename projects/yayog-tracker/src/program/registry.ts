import { BASIC_PROGRAM } from "./basic";
import { FIRST_CLASS_PROGRAM } from "./first-class";
import { MASTER_PROGRAM } from "./master";
import { LEVELS, type Level, type Program } from "./types";

export const PROGRAMS: Record<Level, Program> = {
  basic: BASIC_PROGRAM,
  "first-class": FIRST_CLASS_PROGRAM,
  master: MASTER_PROGRAM,
};

export const LEVEL_LABEL: Record<Level, string> = {
  basic: "Basic",
  "first-class": "1st Class",
  master: "Master Class",
};

// Levels the person may train at. Until Level tests exist, only dev builds
// see more than Basic, so a new Program's data can be checked.
export function unlockedLevels(): Level[] {
  return import.meta.env.DEV ? [...LEVELS] : ["basic"];
}
