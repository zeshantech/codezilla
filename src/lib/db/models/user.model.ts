import { Schema, Document, Model, model, models } from "mongoose";
import toJSON from "@/lib/plugins/toJSON";
import { IUser } from "@/types/profile";

export interface UserDocument extends IUser, Omit<Document, "id"> {}

const UserSchema = new Schema<IUser>(
  {
    // TODO: will check - like it could be an array
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(toJSON);

export const User: Model<IUser> = models?.User || model<IUser>("User", UserSchema);
