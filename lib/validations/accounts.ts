import { z } from "zod";

export const AccountSchema = z.object({
  userId: z.string().optional(),

  name: z.string().min(1),

  image: z.string().optional(),

  password: z.string().optional(),

  provider: z.string().min(1),

  providerAccountId: z.string().min(1),

  username: z.string().optional(),
});

export type AccountSchemaType =
  z.infer<typeof AccountSchema>;