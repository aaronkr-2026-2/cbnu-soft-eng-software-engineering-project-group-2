
import { describe, expect, it } from "vitest";
import { getNextReviewDate } from "../lib/review";

describe("getNextReviewDate", () => {
  it("schedules a known word 3 days later", () => {
    const now = new Date("2026-10-10T09:00:00");
    const next = getNextReviewDate("know", now);

    expect(next.getDate()).toBe(13);
  });

  it("schedules a difficult word 1 day later", () => {
    const now = new Date("2026-10-10T09:00:00");
    const next = getNextReviewDate("again", now);

    expect(next.getDate()).toBe(11);
  });
});
