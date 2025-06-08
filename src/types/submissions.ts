import { ISchema } from ".";
import { ProgrammingLanguageEnum, ResultStatusEnum } from "./enums";
import { IProblem } from "./problems";
import { ITestResult } from "./testCases";

export interface ISubmission extends ISchema {
  user: string;
  problem: string | IProblem;
  code: string;
  language: ProgrammingLanguageEnum;
  resultStatus: ResultStatusEnum;
  executionTime?: number;
  memoryUsed?: number;
  logs: string[];
  testResults: ITestResult[];
}

export interface ICreateSubmissionInput {
  problemId: string;
  code: string;
  language: ProgrammingLanguageEnum;
  resultStatus: ResultStatusEnum;
  executionTime?: number;
  memoryUsed?: number;
  logs: string[];
  testResults: ITestResult[];
}
