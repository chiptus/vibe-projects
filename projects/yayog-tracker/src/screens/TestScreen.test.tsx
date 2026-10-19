// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { TestResult } from "../program/levelTests";
import { TestScreen } from "./TestScreen";

afterEach(cleanup);

const show = (results: TestResult[], active: "basic" | "first-class" = "basic") =>
  render(<TestScreen active={active} results={results} onRecord={async () => null} onSwitch={() => {}} />);

describe("TestScreen", () => {
  it("shows only the 1st Class test before any result", () => {
    show([]);
    expect(screen.getByText("1st Class test")).toBeTruthy();
    expect(screen.queryByText(/Master/)).toBeNull();
    expect(screen.queryByText(/Chief/)).toBeNull();
  });

  it("shows only the shortfall after a failed attempt", () => {
    show([{ level: "first-class", date: "2026-02-03", scores: { push: 10, pull: 7, legs: 15, core: 60 } }]);
    expect(screen.getByText(/Pull: 7 of 10 Let Me Ups/)).toBeTruthy();
    expect(screen.queryByText(/Push: 10 of/)).toBeNull();
    expect(screen.queryByText(/Master/)).toBeNull();
  });

  it("recommends the passed Level and reveals only the next test", () => {
    show([{ level: "first-class", date: "2026-02-03", scores: { push: 10, pull: 10, legs: 15, core: 60 } }]);
    expect(screen.getByText("Switch to 1st Class")).toBeTruthy();
    expect(screen.getByText("Master Class test")).toBeTruthy();
    expect(screen.queryByText(/Chief/)).toBeNull();
  });

  it("says there is no further test after Chief", () => {
    show([{ level: "chief", date: "2026-02-03", scores: { push: 8, pull: 12, legs: 12, core: 300 } }]);
    expect(screen.getByText("No further test")).toBeTruthy();
  });
});
