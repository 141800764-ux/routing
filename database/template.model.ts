import { Schema, model, models } from "mongoose";
/**
 * Generic template interface
 * Replace fields depending on your model
 */
export interface ITemplate {
  // example fields
  name: string;
  description?: string;

  // relationships
  userId?: Types.ObjectId;
}

/**
 * Schema
 */
const TemplateSchema = new Schema<ITemplate>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Prevent model overwrite in Next.js hot reload
 */
const Template =
  models.Template || model<ITemplate>("Template", TemplateSchema);

export default Template;