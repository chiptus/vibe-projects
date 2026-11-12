// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { PROGRAMS } from "../../program/registry";
import type { Level, StappersDay } from "../../program/types";
import { ExerciseNameList } from "./ExerciseNameList";

// jsdom has no <dialog>.showModal().
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute("open", "");
  };
});
afterEach(cleanup);

function stappersDay(level: Level): StappersDay {
  const days = Object.values(PROGRAMS[level].weeks).flatMap((w) => Object.values(w));
  const day = days.find((d): d is StappersDay => d.type === "stappers");
  if (!day) throw new Error(`no Stappers day in ${level}`);
  return day;
}

describe.each([
  [
    "chief",
    ["Alternating Pistols", "Iron Mikes"],
    ["Pistols", "Iron Mikes"],
    "12 Alternating Pistols (6 total on each side) or 24 Iron Mikes (jumping as high as possible)",
  ],
  ["master", ["1-Legged Squats", "Box Jumps"], ["1-Legged Squats", "Box Jumps"], "12 Assisted Alternating 1-Legged Squats or Box Jumps"],
] as const)("%s Stappers label", (level, buttonNames, guideTitles, label) => {
  it("opens a separate guide for each alternative", () => {
    const { container } = render(<ExerciseNameList names={stappersDay(level).exercises} />);
    expect(container.textContent).toContain(label);
    buttonNames.forEach((name, i) => {
      fireEvent.click(screen.getByRole("button", { name: new RegExp(name) }));
      expect(screen.getByRole("heading", { name: guideTitles[i]! })).toBeTruthy();
      cleanup();
      render(<ExerciseNameList names={stappersDay(level).exercises} />);
    });
  });
});
