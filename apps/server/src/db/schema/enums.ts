import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["employee", "driver", "admin"]);

export const tripStatusEnum = pgEnum("trip_status", [
  "waiting",
  "allocated",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
]);

export const disputeReasonEnum = pgEnum("dispute_reason", [
  "pickup_issue",
  "drop_issue",
  "trip_quality",
  "other",
]);

export const disputeStatusEnum = pgEnum("dispute_status", [
  "open",
  "in_review",
  "resolved",
]);
