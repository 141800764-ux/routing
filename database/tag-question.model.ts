import { model, models, Schema, Types } from "mongoose";

export interface ITagQuestion {
  tag: Types.ObjectId;
  question: Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}

const TagQuestionSchema = new Schema<ITagQuestion>(
  {
    tag: {
      type: Schema.Types.ObjectId,
      ref: "Tag",
      required: true,
      index: true,
    },

    question: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/* PREVENT DUPLICATE TAG-QUESTION PAIRS */
TagQuestionSchema.index(
  { tag: 1, question: 1 },
  { unique: true }
);

/* FAST FILTERING */
TagQuestionSchema.index({ tag: 1 });
TagQuestionSchema.index({ question: 1 });

const TagQuestion =
  models.TagQuestion ||
  model<ITagQuestion>("TagQuestion", TagQuestionSchema);

export default TagQuestion;