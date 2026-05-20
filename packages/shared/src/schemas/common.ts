import { z } from "zod";

export const userRoleSchema = z.enum(["employee", "driver", "admin"]);

export const errorResponseSchema = z.object({
  error: z.string(),
  code: z.string(),
  requestId: z.string(),
});

export const successResponseSchema = z.object({
  success: z.literal(true),
});

export const cursorPaginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
