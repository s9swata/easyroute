import { z } from "zod";

export const savedLocationTypeSchema = z.enum(["home", "work", "other"]);

export const createSavedLocationRequestSchema = z.object({
  name: z.string().min(1).max(255),
  address: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
  type: savedLocationTypeSchema.optional(),
});

export const updateSavedLocationRequestSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  address: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  type: savedLocationTypeSchema.optional(),
});

export const savedLocationSchema = z.object({
  id: z.number(),
  employeeId: z.number().nullable(),
  name: z.string(),
  address: z.string().nullable(),
  location: z.object({ x: z.number(), y: z.number() }),
  type: savedLocationTypeSchema,
});

export const savedLocationListResponseSchema = z.object({
  items: z.array(savedLocationSchema),
});
