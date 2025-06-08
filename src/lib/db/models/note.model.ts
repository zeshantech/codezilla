import { Schema, Document, models, Model, model } from "mongoose";
import { INote } from "@/types/notes";
import toJSON from "@/lib/plugins/toJSON";

export interface NoteDocument extends INote, Omit<Document, "id"> {}

const NoteSchema = new Schema<INote>(
  {
    user: {
      type: String,
      required: true,
      index: true,
    },
    problem: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
      ref: "Problem",
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

NoteSchema.index({ user: 1, problem: 1 });
NoteSchema.plugin(toJSON);

export const Note: Model<INote> =
  models?.Note || model<INote>("Note", NoteSchema);
