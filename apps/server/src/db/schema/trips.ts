import {
  date,
  index,
  integer,
  pgTable,
  timestamp,
  varchar,
  primaryKey,
} from "drizzle-orm/pg-core";
import { tripStatusEnum } from "./enums";
import { routes } from "./routes";
import { shiftSchedules } from "./shifts";
import { employees, drivers } from "./users";
import { vehicles } from "./vehicles";
import { routeStops } from "./routes";

export const trips = pgTable(
  "trips",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    routeId: integer("route_id")
      .notNull()
      .references(() => routes.id),
    vehicleId: integer("vehicle_id").references(() => vehicles.id),
    driverId: integer("driver_id").references(() => drivers.id),
    shiftScheduleId: integer("shift_schedule_id")
      .notNull()
      .references(() => shiftSchedules.id),
    scheduledDate: date("scheduled_date").notNull(),
    status: tripStatusEnum().notNull().default("waiting"),
    loginOtp: varchar("login_otp", { length: 6 }),
    logoutOtp: varchar("logout_otp", { length: 6 }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [
    index("trips_route_id_idx").on(t.routeId),
    index("trips_driver_id_idx").on(t.driverId),
    index("trips_scheduled_date_idx").on(t.scheduledDate),
    index("trips_status_idx").on(t.status),
  ],
);

export const tripPassengers = pgTable(
  "trip_passengers",
  {
    tripId: integer("trip_id")
      .notNull()
      .references(() => trips.id),
    employeeId: integer("employee_id")
      .notNull()
      .references(() => employees.id),
    rosterId: integer("roster_id"),
    stopId: integer("stop_id")
      .notNull()
      .references(() => routeStops.id),
    boardedAt: timestamp("boarded_at", { mode: "date" }),
    droppedAt: timestamp("dropped_at", { mode: "date" }),
  },
  (t) => [
    primaryKey({ columns: [t.tripId, t.employeeId] }),
    index("trip_passengers_trip_id_idx").on(t.tripId),
    index("trip_passengers_employee_id_idx").on(t.employeeId),
  ],
);

export const locationPings = pgTable(
  "location_pings",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    driverId: integer("driver_id")
      .notNull()
      .references(() => drivers.id),
    tripId: integer("trip_id")
      .notNull()
      .references(() => trips.id),
    lat: varchar({ length: 50 }).notNull(),
    lng: varchar({ length: 50 }).notNull(),
    timestamp: timestamp({ mode: "date" }).defaultNow().notNull(),
  },
  (t) => [
    index("location_pings_driver_id_idx").on(t.driverId),
    index("location_pings_trip_id_idx").on(t.tripId),
    index("location_pings_timestamp_idx").on(t.timestamp),
  ],
);
