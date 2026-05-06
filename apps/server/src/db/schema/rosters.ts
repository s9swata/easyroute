import { boolean, date, index, integer, pgTable, smallint } from "drizzle-orm/pg-core";
import { employees } from "./users";
import { routes, routeStops } from "./routes";
import { shiftSchedules } from "./shifts";

export const rosters = pgTable(
  "rosters",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    employeeId: integer("employee_id")
      .notNull()
      .references(() => employees.id),
    routeId: integer("route_id")
      .notNull()
      .references(() => routes.id),
    stopId: integer("stop_id")
      .notNull()
      .references(() => routeStops.id),
    shiftScheduleId: integer("shift_schedule_id")
      .notNull()
      .references(() => shiftSchedules.id),
    daysOfWeek: smallint("days_of_week").notNull(),
    effectiveFrom: date("effective_from").notNull(),
    effectiveUntil: date("effective_until"),
    isActive: boolean("is_active").notNull().default(true),
  },
  (t) => [
    index("rosters_employee_id_idx").on(t.employeeId),
    index("rosters_route_id_idx").on(t.routeId),
  ],
);
