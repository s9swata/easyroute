import { z } from "zod";

export const updateAvailabilityRequestSchema = z.object({
  available: z.boolean(),
});

export const stageTripRequestSchema = z.object({
  stage: z.enum(["started", "completed"]),
});

export const updateLocationRequestSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  tripId: z.number(),
});
