import { Schema, Document, Model, models, model } from "mongoose";
import { ISubmission } from "@/types/submissions";
import toJSON from "@/lib/plugins/toJSON";
import { ProgrammingLanguageEnum, ResultStatusEnum } from "@/types/enums";
import { ITestResult } from "@/types/testCases";

const TestResultSchema = new Schema<ITestResult>(
  {
    passed: { type: Boolean, required: true },
    output: { type: String, required: true },
    testCase: { type: Schema.Types.ObjectId, ref: "TestCase", required: true },
    error: { type: String },
  },
  { _id: false }
);

export interface SubmissionDocument extends ISubmission, Omit<Document, "id"> {}

const SubmissionSchema = new Schema<ISubmission>(
  {
    user: { type: String, required: true },
    problem: { type: Schema.Types.ObjectId, ref: "Problem", required: true },
    code: { type: String, required: true },
    language: {
      type: String,
      enum: Object.values(ProgrammingLanguageEnum),
      required: true,
    },
    resultStatus: {
      type: String,
      enum: Object.values(ResultStatusEnum),
      required: true,
    },
    executionTime: { type: Number },
    memoryUsed: { type: Number },
    logs: { type: [String], default: [] },
    testResults: { type: [TestResultSchema], default: [] },
  },
  {
    timestamps: true,
  }
);

SubmissionSchema.index({ userId: 1, problemId: 1 });
SubmissionSchema.index({ problemId: 1 });
SubmissionSchema.index({ userId: 1 });
SubmissionSchema.index({ createdAt: -1 });

SubmissionSchema.plugin(toJSON);

export const Submission: Model<ISubmission> =
  models?.Submission || model<ISubmission>("Submission", SubmissionSchema);
