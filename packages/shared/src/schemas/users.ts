import { z } from "zod";

export const updateProfileRequestSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  phone: z.string().max(20).optional(),
  push_token: z.string().max(500).optional(),
});
