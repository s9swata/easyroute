import { integer, pgTable, text, timestamp, varchar, boolean, uniqueIndex, index } from "drizzle-orm/pg-core";
import { userRoleEnum } from "./enums";
import { vehicles } from "./vehicles";

export const users = pgTable(
  "users",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    employeeId: varchar("employee_id", { length: 50 }).notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: userRoleEnum().notNull().default("employee"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
);

export const employees = pgTable(
  "employees",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id)
      .unique(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }),
    phone: varchar({ length: 20 }),
    department: varchar({ length: 255 }),
    employeeCode: varchar("employee_code", { length: 50 }).notNull().unique(),
    homeAddress: varchar("home_address", { length: 500 }),
    dropLocation: varchar("drop_location", { length: 500 }),
    pickupLocation: varchar("pickup_location", { length: 500 }),
  },
  (t) => [
    index("employees_user_id_idx").on(t.userId),
  ],
);

export const drivers = pgTable(
  "drivers",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id)
      .unique(),
    name: varchar({ length: 255 }).notNull(),
    phone: varchar({ length: 20 }),
    email: varchar({ length: 255 }),
    vehicleId: integer("vehicle_id").references(() => vehicles.id),
    licenseNumber: varchar("license_number", { length: 100 }),
    available: boolean().notNull().default(false),
  },
  (t) => [
    index("drivers_user_id_idx").on(t.userId),
    index("drivers_vehicle_id_idx").on(t.vehicleId),
  ],
);
