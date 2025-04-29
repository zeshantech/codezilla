import { Schema, Document, Model, models, model } from "mongoose";
import { DifficultyEnum, ICollection } from "@/types";
import toJSON from "@/lib/plugins/toJSON";

export interface CollectionDocument extends ICollection, Omit<Document, "id"> {}

const CollectionSchema: Schema<ICollection> = new Schema<ICollection>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    problems: [{ type: Schema.Types.ObjectId, ref: "Problem", default: [] }],
    createdBy: { type: String },
    isPublic: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    completionCount: { type: Number, default: 0 },
    difficulty: {
      type: String,
      enum: Object.values(DifficultyEnum),
      default: DifficultyEnum.MIXED,
    },
    tags: { type: [String], default: [] },
  },
  {
    timestamps: true,
  }
);

CollectionSchema.plugin(toJSON);

export const Collection: Model<ICollection> = models?.Collection || model<ICollection>("Collection", CollectionSchema);
