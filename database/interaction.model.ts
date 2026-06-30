import { model, models, Schema, Types } from "mongoose";

export interface IInteraction {
  user: Types.ObjectId;

  action: string;

  actionId: Types.ObjectId;

  question?: Types.ObjectId;

  answer?: Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}

const InteractionSchema = new Schema<IInteraction>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    action: {
      type: String,
      enum: [
        "view",
        "upvote",
        "downvote",
        "bookmark",
        "ask_question",
        "answer_question",
      ],
      required: true,
      index: true,
    },

    actionId: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

/* FAST USER ACTIVITY QUERIES */
InteractionSchema.index({ user: 1, createdAt: -1 });

/* FAST QUESTION ANALYTICS */
InteractionSchema.index({ question: 1, action: 1 });

const Interaction =
  models.Interaction ||
  model<IInteraction>("Interaction", InteractionSchema);

export default Interaction;