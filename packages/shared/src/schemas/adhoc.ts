import { z } from "zod";

export const adhocTripStatusSchema = z.enum([
  "requested",
  "allocated",
  "completed",
  "cancelled",
]);

export const createAdhocTripRequestSchema = z.object({
  pickupLocation: z.object({ lat: z.number(), lng: z.number() }),
  dropoffLocation: z.object({ lat: z.number(), lng: z.number() }),
  scheduledDate: z.string(),
  scheduledTime: z.string(),
});

export const adhocTripSchema = z.object({
  id: z.number(),
  employeeId: z.number(),
  tripId: z.number().nullable(),
  pickupLocation: z.object({ lat: z.number(), lng: z.number() }),
  dropoffLocation: z.object({ lat: z.number(), lng: z.number() }),
  scheduledDate: z.string(),
  scheduledTime: z.string(),
  status: adhocTripStatusSchema,
});

export const adhocTripListQuerySchema = z.object({
  status: adhocTripStatusSchema.optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const verifyOtpRequestSchema = z.object({
  type: z.enum(["login", "logout"]),
  otp: z.string().length(6),
});

export const adhocTripListResponseSchema = z.object({
  items: z.array(adhocTripSchema),
  nextCursor: z.string().optional(),
});
