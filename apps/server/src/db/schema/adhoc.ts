import { date, geometry, index, integer, pgTable, time, timestamp, varchar } from "drizzle-orm/pg-core";
import { employees } from "./users";
import { adhocTripStatusEnum } from "./enums";
import { trips } from "./trips";

export const adhocTrips = pgTable(
  "adhoc_trips",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    employeeId: integer("employee_id")
      .notNull()
      .references(() => employees.id),
    tripId: integer("trip_id").references(() => trips.id),
    pickupLocation: geometry("pickup_location", { type: "point", mode: "xy", srid: 4326 }).notNull(),
    dropoffLocation: geometry("dropoff_location", { type: "point", mode: "xy", srid: 4326 }).notNull(),
    scheduledDate: date("scheduled_date").notNull(),
    scheduledTime: time("scheduled_time").notNull(),
    status: adhocTripStatusEnum().notNull().default("requested"),
    loginOtpHash: varchar("login_otp_hash", { length: 255 }),
    logoutOtpHash: varchar("logout_otp_hash", { length: 255 }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().$onUpdate(() => new Date()).notNull(),
  },
  (t) => [
    index("adhoc_trips_employee_id_idx").on(t.employeeId),
    index("adhoc_trips_scheduled_date_idx").on(t.scheduledDate),
    index("adhoc_trips_status_idx").on(t.status),
    index("adhoc_trips_pickup_idx").using("gist", t.pickupLocation),
  ],
);
