import { z } from "zod";

export const createRosterBookingRequestSchema = z.object({
  pickupLocationId: z.number().optional(),
  dropoffLocationId: z.number().optional(),
  shiftScheduleId: z.number(),
  daysOfWeek: z.number().int().min(0).max(127),
  effectiveFrom: z.string(),
  effectiveUntil: z.string().optional(),
});

export const rosterBookingSchema = z.object({
  id: z.number(),
  employeeId: z.number(),
  pickupLocationId: z.number().nullable(),
  dropoffLocationId: z.number().nullable(),
  shiftScheduleId: z.number(),
  daysOfWeek: z.number(),
  effectiveFrom: z.string(),
  effectiveUntil: z.string().nullable(),
  status: z.string(),
});

export const rosterBookingListResponseSchema = z.object({
  items: z.array(rosterBookingSchema),
});
