import { z } from "zod";

export const notificationSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  isRead: z.boolean(),
  createdAt: z.string(),
});

export const notificationListQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const notificationListResponseSchema = z.object({
  items: z.array(notificationSchema),
  nextCursor: z.string().optional(),
});
