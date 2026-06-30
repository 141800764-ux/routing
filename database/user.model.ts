import mongoose, { Schema, model, models } from "mongoose";

export interface IUser {
  name: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
  passwordHash?: string;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    bio: {
      type: String,
    },

    image: {
      type: String,
      default: "",
    },

    location: {
      type: String,
    },

    portfolio: {
      type: String,
    },

    reputation: {
      type: Number,
      default: 0,
    },

    passwordHash: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const User =
  models.User || model<IUser>("User", UserSchema);

export default User;