import { z } from "zod";
import { tripStatusSchema } from "./trips";

export const allocateDriverRequestSchema = z.object({
  driverId: z.number(),
  vehicleId: z.number().optional(),
});

export const adminTripQuerySchema = z.object({
  status: tripStatusSchema.optional(),
  source: z.enum(["roster", "adhoc"]).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const resolveDisputeRequestSchema = z.object({
  resolution: z.string().min(1),
});
