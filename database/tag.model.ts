import { Schema, model, models, Types } from "mongoose";

export interface ITag {
  name: string;
  description?: string;
  slug: string;
  questions?: Types.ObjectId[];
  followers?: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

const TagSchema = new Schema<ITag>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
    },

    /* OPTIONAL
       Only store references if you REALLY need them.
       Usually querying from Question model is better.
    */
    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
      },
    ],

    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

/* FAST SEARCHING */
TagSchema.index({ name: "text" });

const Tag = models.Tag || model<ITag>("Tag", TagSchema);

export default Tag;