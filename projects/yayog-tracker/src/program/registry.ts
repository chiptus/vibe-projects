import { BASIC_PROGRAM } from "./basic";
import { CHIEF_PROGRAM } from "./chief";
import { FIRST_CLASS_PROGRAM } from "./first-class";
import { MASTER_PROGRAM } from "./master";
import type { Level, Program } from "./types";

export const PROGRAMS: Record<Level, Program> = {
  basic: BASIC_PROGRAM,
  "first-class": FIRST_CLASS_PROGRAM,
  master: MASTER_PROGRAM,
  chief: CHIEF_PROGRAM,
};

export const LEVEL_LABEL: Record<Level, string> = {
  basic: "Basic",
  "first-class": "1st Class",
  master: "Master Class",
  chief: "Chief Class",
};
