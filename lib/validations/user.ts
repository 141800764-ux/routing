import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().min(2),
  username: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6).optional(),
  image: z.string().optional(),
});

export type UserSchemaType =
  z.infer<typeof UserSchema>;