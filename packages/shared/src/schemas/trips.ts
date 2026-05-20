import { z } from "zod";

export const tripStatusSchema = z.enum(["scheduled", "ongoing", "cancelled"]);

export const tripSchema = z.object({
  id: z.number(),
  routeId: z.number().nullable(),
  driverId: z.number().nullable(),
  vehicleId: z.number().nullable(),
  scheduledDate: z.string(),
  status: tripStatusSchema,
  source: z.enum(["roster", "adhoc"]),
  sourceId: z.string().nullable(),
});

export const tripPassengerSchema = z.object({
  employeeId: z.number(),
  stopId: z.number().nullable(),
  boardedAt: z.string().nullable(),
  droppedAt: z.string().nullable(),
});

export const tripDetailSchema = tripSchema.extend({
  passengers: z.array(tripPassengerSchema),
});

export const tripListQuerySchema = z.object({
  status: tripStatusSchema.optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const cancelTripRequestSchema = z.object({
  reason: z.string().optional(),
});

export const rateTripRequestSchema = z.object({
  score: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export const tripListResponseSchema = z.object({
  items: z.array(tripSchema),
  nextCursor: z.string().optional(),
});
