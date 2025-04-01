import { z } from "zod";

export const AddressSchema = z.object({
  id: z.number().int(),
  userId: z.number().int(),
  latitude: z.string(),
  longitude: z.string(),
  name: z.string().optional(),
  address: z.string(),
  type: z.enum(["home", "work", "other"]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type Address = z.infer<typeof AddressSchema>;
