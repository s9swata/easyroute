import { boolean, integer, pgTable, varchar, uniqueIndex } from "drizzle-orm/pg-core";

export const vehicles = pgTable(
  "vehicles",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    plateNumber: varchar("plate_number", { length: 50 }).notNull(),
    model: varchar({ length: 255 }),
    capacity: integer().notNull(),
    color: varchar({ length: 50 }),
    isActive: boolean("is_active").notNull().default(true),
  },
  (t) => [
    uniqueIndex("vehicles_plate_idx").on(t.plateNumber),
  ],
);
