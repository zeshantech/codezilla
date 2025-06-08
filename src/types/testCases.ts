import { ISchema } from ".";
import { ProgrammingLanguageEnum, ResultStatusEnum } from "./enums";
import { IProblem } from "./problems";

export interface ITestCase extends ISchema {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  problem: string | IProblem;
}

export interface ITestCaseSaveInput {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface ITestResult {
  passed: boolean;
  output: string;
  error?: string;
  testCase: string | ITestCase;
}

export interface IRunTestCasesInput {
  code: string;
  language: ProgrammingLanguageEnum;
  problemId: string;
  testCaseIdz?: string[];
}

export interface IRunTestCasesOutput {
  status: ResultStatusEnum;
  error?: string;
  executionTime: number;
  memoryUsed: number;
  failedTestCase?: ITestCase;
}

export interface ICodeExecutionInput {
  code: string;
  language: ProgrammingLanguageEnum;
}

export interface ICodeExecutionOutput {
  status: "success" | "error";
  output: string[];
  error?: string;
  executionTime?: number;
  memoryUsed?: number;
}
