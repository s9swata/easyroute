import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: text("id").primaryKey(),
  secretHash: text("secret_hash").notNull(),
  userId: text("user_id").notNull(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});
