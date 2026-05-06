import { index, integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { employees } from "./users";

export const savedLocations = pgTable(
  "saved_locations",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    employeeId: integer("employee_id")
      .notNull()
      .references(() => employees.id),
    name: varchar({ length: 255 }).notNull(),
    address: varchar({ length: 500 }),
    lat: varchar({ length: 50 }).notNull(),
    lng: varchar({ length: 50 }).notNull(),
  },
  (t) => [
    index("saved_locations_employee_id_idx").on(t.employeeId),
  ],
);
