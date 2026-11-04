// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { TestResult } from "../program/levelTests";
import { TestScreen } from "./TestScreen";

afterEach(cleanup);

const show = (results: TestResult[], active: "basic" | "first-class" = "basic") =>
  render(<TestScreen active={active} results={results} onRecord={async () => null} onDelete={async () => null} onSwitch={() => {}} />);

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

  it("deletes the chosen result by its position after confirming", async () => {
    const results: TestResult[] = [
      { level: "first-class", date: "2026-01-01", scores: { push: 10, pull: 10, legs: 15, core: 60 } },
      { level: "first-class", date: "2026-02-02", scores: { push: 1, pull: 1, legs: 1, core: 1 } },
    ];
    const onDelete = vi.fn(async () => null);
    vi.spyOn(window, "confirm").mockReturnValue(true);
    render(<TestScreen active="basic" results={results} onRecord={async () => null} onDelete={onDelete} onSwitch={() => {}} />);
    fireEvent.click(screen.getByLabelText(/Delete .* result from 2026-01-01/));
    await waitFor(() => expect(onDelete).toHaveBeenCalledWith(0));
  });

  it("does not delete when the confirmation is declined", () => {
    const onDelete = vi.fn(async () => null);
    vi.spyOn(window, "confirm").mockReturnValue(false);
    render(<TestScreen active="basic" results={[{ level: "first-class", date: "2026-01-01", scores: { push: 1, pull: 1, legs: 1, core: 1 } }]} onRecord={async () => null} onDelete={onDelete} onSwitch={() => {}} />);
    fireEvent.click(screen.getByLabelText(/Delete .* result/));
    expect(onDelete).not.toHaveBeenCalled();
  });
});
