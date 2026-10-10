
import { describe, expect, it } from "vitest";
import { getNextReviewDate } from "../lib/review";

describe("getNextReviewDate", () => {
  it("schedules a known word 3 days later", () => {
    const now = new Date("2026-10-10T10:00:00.000Z");
    const result = getNextReviewDate("know", now);

    expect(result.toISOString()).toBe(
      "2026-10-13T10:00:00.000Z"
    );
  });

  it("schedules a word marked again 1 day later", () => {
    const now = new Date("2026-10-10T10:00:00.000Z");
    const result = getNextReviewDate("again", now);

    expect(result.toISOString()).toBe(
      "2026-10-11T10:00:00.000Z"
    );
  });
});

