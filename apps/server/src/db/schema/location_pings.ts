import { doublePrecision, index, integer, pgTable, timestamp } from "drizzle-orm/pg-core";
import { drivers } from "./users";
import { trips } from "./trips";

export const locationPings = pgTable(
  "location_pings",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    driverId: integer("driver_id")
      .notNull()
      .references(() => drivers.id),
    tripId: integer("trip_id").references(() => trips.id),
    lat: doublePrecision("lat").notNull(),
    lng: doublePrecision("lng").notNull(),
    timestamp: timestamp({ mode: "date" }).defaultNow().notNull(),
  },
  (t) => [
    index("location_pings_driver_id_idx").on(t.driverId),
    index("location_pings_trip_id_idx").on(t.tripId),
    index("location_pings_timestamp_idx").on(t.timestamp),
  ],
);
