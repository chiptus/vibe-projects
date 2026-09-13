import type { Position, Program } from "../types";
import { WEEKS } from "./weeks";
import { sequence as sequenceOf } from "./workout";

export { BLOCK_NAME, RULES, TYPE_LABEL } from "./rules";
export { blankEntries, metrics } from "./workout";

export const BASIC_PROGRAM: Program = { name: "Basic", weeks: WEEKS };

export function sequence(): Position[] {
  return sequenceOf(BASIC_PROGRAM);
}
