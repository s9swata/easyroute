import { index, integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
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
  ],
);
