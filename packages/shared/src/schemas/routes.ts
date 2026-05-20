import { z } from "zod";

export const pointSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const routeSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  startPoint: pointSchema,
  endPoint: pointSchema,
  isActive: z.boolean(),
});

export const routeListResponseSchema = z.object({
  items: z.array(routeSchema),
});

export const routeStopSchema = z.object({
  id: z.number(),
  routeId: z.number(),
  name: z.string(),
  address: z.string().nullable(),
  location: pointSchema,
  sequence: z.number(),
  estimatedMinutesFromPrev: z.number().nullable(),
});

export const routeStopsResponseSchema = z.object({
  stops: z.array(routeStopSchema),
});
