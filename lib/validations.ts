import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type UserSchemaType = z.infer<typeof UserSchema>;

export const QuestionSchema = z.object({
  title: z.string().min(5, { message: "Title is required." }),
  content: z.string().min(1, { message: "Content is required." }),
  tags: z
    .array(z.string().min(1, { message: "Tag is required." }))
    .min(1, { message: "At least one tag is required." })
    .max(3, { message: "Maximum 3 tags allowed." }),
});

export const AnswerSchema = z.object({
  content: z
    .string()
    .min(100, { message: "Answer must be at least 100 characters." }),
});

export const AskAnswerSchema = z.object({
  content: z.string().min(1, { message: "Answer is required." }),
});

export const PaginatedSearchParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  query: z.string().optional().default(""),
  filter: z.string().optional().default(""),
  sort: z.string().optional().default("newest"),
});

export const CreateVoteSchema = z.object({
  targetId: z.string().min(1, { message: "Target ID is required." }),
  targetType: z.enum(["question", "answer"], {
    message: "Invalid target type.",
  }),
  voteType: z.enum(["upvote", "downvote"], {
    message: "Invalid vote type.",
  }),
});

export const UpdateVoteCountSchema = CreateVoteSchema.extend({
  change: z.number().int().min(-1).max(1),
});

export const HasVotedSchema = CreateVoteSchema.pick({
  targetId: true,
  targetType: true,
});

export const CollectionBaseSchema = z.object({
  questionId: z.string().min(1, { message: "Question ID is required." }),
});

export const GetUserSchema = z.object({
  userId: z.string().min(1, {message: "User ID is required,"}),
});

export const GetUserQuestionsSchema = PaginatedSearchParamsSchema.extend({
  userId: z.string().min(1, { message: "User ID is required." }),
});