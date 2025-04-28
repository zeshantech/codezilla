import { Schema, Document, Model, model, models } from "mongoose";
import { IUser, IUserProblemProgress } from "@/types";
import toJSON from "@/lib/plugins/toJSON";

export interface UserDocument extends IUser, Omit<Document, "id"> {}

const UserProblemProgressSchema = new Schema<IUserProblemProgress>(
  {
    problem: { type: String, required: true },
    status: {
      type: String,
      enum: ["attempted", "solved", "not_started"],
      default: "not_started",
    },
    submissions: { type: Number, default: 0 },
    lastSubmissionDate: { type: String },
    timeTaken: { type: Number },
    code: { type: Map, of: String },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    // TODO: will check - like it could be an array
    problemsProgress: {
      type: Map,
      of: UserProblemProgressSchema,
      default: {},
    },
    completedProblems: { type: Number, default: 0 },
    completedCollections: { type: Number, default: 0 },
    createdProblems: { type: Number, default: 0 },
    createdCollections: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(toJSON);

export const User: Model<IUser> =
  models?.User || model<IUser>("User", UserSchema);
