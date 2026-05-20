import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  secretHash: text("secret_hash").notNull(),
  userId: text("user_id").notNull(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});
