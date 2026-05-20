import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { disputeReasonEnum, disputeStatusEnum } from "./enums";
import { trips } from "./trips";
import { users } from "./users";

export const disputes = pgTable(
  "disputes",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    tripId: integer("trip_id")
      .notNull()
      .references(() => trips.id),
    raisedByUserId: integer("raised_by_user_id")
      .notNull()
      .references(() => users.id),
    reason: disputeReasonEnum().notNull(),
    description: text(),
    status: disputeStatusEnum().notNull().default("open"),
    resolutionMsg: text("resolution_msg"),
    resolvedByUserId: integer("resolved_by_user_id").references(() => users.id),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().$onUpdate(() => new Date()).notNull(),
  },
  (t) => [
    index("disputes_trip_id_idx").on(t.tripId),
    index("disputes_status_idx").on(t.status),
  ],
);
