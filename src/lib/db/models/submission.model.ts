import { Schema, Document, Model, models, model } from "mongoose";
import { ISubmission, ProgrammingLanguageEnum, SubmissionStatusEnum } from "@/types";
import toJSON from "@/lib/plugins/toJSON";

export interface SubmissionDocument extends ISubmission, Omit<Document, "id"> {}

const TestResultSchema = new Schema(
  {
    passed: { type: Boolean, required: true },
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    actualOutput: { type: String, required: true },
    testCaseId: { type: Number, required: true },
  },
  { _id: false }
);

const SubmissionSchema = new Schema<ISubmission>(
  {
    user: { type: String, required: true },
    problem: { type: String, required: true },
    code: { type: String, required: true },
    language: {
      type: String,
      enum: Object.values(ProgrammingLanguageEnum),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(SubmissionStatusEnum),
      required: true,
    },
    executionTime: { type: Number },
    memoryUsed: { type: Number },
    testResults: { type: [TestResultSchema] },
    logs: { type: [String], default: [] },
    error: { type: String },
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

export const Submission: Model<ISubmission> = models?.Submission || model<ISubmission>("Submission", SubmissionSchema);
