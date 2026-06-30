import { model, models, Schema, Types } from "mongoose";

export interface IVote {
  author: Types.ObjectId;

  question?: Types.ObjectId;

  answer?: Types.ObjectId;

  type: string;

  createdAt?: Date;
  updatedAt?: Date;
}

const VoteSchema = new Schema<IVote>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    question: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      index: true,
    },

    answer: {
      type: Schema.Types.ObjectId,
      ref: "Answer",
      index: true,
    },

    type: {
      type: String,
      enum: ["upvote", "downvote"],
      required: true,
      default: "upvote",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/* PREVENT DUPLICATE QUESTION VOTES */
VoteSchema.index(
  { author: 1, question: 1 },
  {
    unique: true,
    partialFilterExpression: {
      question: { $exists: true },
    },
  }
);

/* PREVENT DUPLICATE ANSWER VOTES */
VoteSchema.index(
  { author: 1, answer: 1 },
  {
    unique: true,
    partialFilterExpression: {
      answer: { $exists: true },
    },
  }
);

const Vote =
  models.Vote || model<IVote>("Vote", VoteSchema);

export default Vote;