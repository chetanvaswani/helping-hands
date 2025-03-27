import { z } from "zod";

export const UserSchema = z.object({
  id: z.number().int().optional(),
  name: z.string(),
  mobileNumber: z.string(),
  email: z.string().email().nullable(),
  referralCode: z.string().nullable(),
  credits: z.number().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Infer a TypeScript interface from the schema
export type User = z.infer<typeof UserSchema>;
