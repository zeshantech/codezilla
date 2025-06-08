import toJSON from "@/lib/plugins/toJSON";
import { ITestCase, ITestResult } from "@/types/testCases";
import { Model, model, models, Schema } from "mongoose";

export interface TestCaseDocument extends ITestCase, Omit<Document, "id"> {}

const TestCaseSchema: Schema<ITestCase> = new Schema<ITestCase>(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false },
    problem: { type: Schema.Types.ObjectId, ref: "Problem", required: true },
  },
  {
    timestamps: true,
  }
);

TestCaseSchema.plugin(toJSON);

export const TestCase: Model<ITestCase> =
  models?.TestCase || model<ITestCase>("TestCase", TestCaseSchema);
