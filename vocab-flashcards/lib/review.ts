
export type ReviewResult = "know" | "again";

export function getNextReviewDate(
  result: ReviewResult,
  now: Date = new Date()
): Date {
  const next = new Date(now);
  next.setDate(next.getDate() + (result === "know" ? 3 : 1));
  return next;
}
