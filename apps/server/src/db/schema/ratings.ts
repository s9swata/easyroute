import { check, index, integer, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { trips } from "./trips";
import { users } from "./users";

export const ratings = pgTable(
  "ratings",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    tripId: integer("trip_id")
      .notNull()
      .references(() => trips.id),
    fromUserId: integer("from_user_id")
      .notNull()
      .references(() => users.id),
    toUserId: integer("to_user_id")
      .notNull()
      .references(() => users.id),
    score: integer().notNull(),
    comment: text(),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [
    index("ratings_trip_id_idx").on(t.tripId),
    uniqueIndex("ratings_trip_from_user_unique").on(t.tripId, t.fromUserId),
    check("ratings_score_range", sql`score >= 1 AND score <= 5`),
  ],
);
