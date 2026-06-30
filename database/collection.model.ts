import { model, models, Schema } from "mongoose";

export interface ICollection {
  author: string;
  question: string;
  questionTitle?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CollectionSchema = new Schema<ICollection>(
  {
    author: {
      type: String,
      required: true,
      index: true,
    },
    question: {
      type: String,
      required: true,
      index: true,
    },
    questionTitle: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

CollectionSchema.index({ author: 1, question: 1 }, { unique: true });

const Collection =
  models.Collection ||
  model<ICollection>("Collection", CollectionSchema);

export default Collection;