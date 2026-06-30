import { z } from "zod";

export const SigninWithOAuthSchema = z.object({
  provider: z.string().min(1, "Provider is required"),

  providerAccountId: z
    .string()
    .min(1, "Provider Account ID is required"),

  user: z.object({
    name: z.string().min(1, "Name is required"),

    username: z
      .string()
      .min(1, "Username is required"),

    email: z
      .string()
      .email("Invalid email"),

    image: z.string().optional(),
  }),
});

export type SigninWithOAuthParams =
  z.infer<typeof SigninWithOAuthSchema>;