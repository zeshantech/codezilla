import { Schema, Document, Model, models, model } from "mongoose";
import { IProblem, IExample, ITestCase, DifficultyEnum } from "@/types";
import toJSON from "@/lib/plugins/toJSON";

export interface ProblemDocument extends IProblem, Omit<Document, "id"> {}

const ExampleSchema = new Schema<IExample>(
  {
    input: { type: String, required: true },
    output: { type: String, required: true },
    explanation: { type: String, required: true },
  },
  { _id: false }
);

const TestCaseSchema = new Schema<ITestCase>(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false },
  },
  { _id: false }
);

const ProblemSchema: Schema<IProblem> = new Schema<IProblem>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    difficulty: {
      type: String,
      enum: Object.values(DifficultyEnum),
      required: true,
    },
    category: { type: String, required: true },
    description: { type: String, required: true },
    constraints: { type: [String], required: true },
    examples: { type: [ExampleSchema], required: true },
    testCases: { type: [TestCaseSchema], required: true },
    starterCode: { type: Map, of: String, required: true },
    solution: { type: Map, of: String },
    popularity: { type: Number, required: true },
    completionCount: { type: Number, required: true },
    createdBy: { type: String },
    isFeatured: { type: Boolean, default: false },
    tags: { type: [String], required: true },
  },
  {
    timestamps: true,
  }
);

ProblemSchema.plugin(toJSON);

export const Problem: Model<IProblem> =
  models?.Problem || model<IProblem>("Problem", ProblemSchema);
