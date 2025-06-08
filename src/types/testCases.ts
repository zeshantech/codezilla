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
  testCaseIdz: string[];
}

export interface ISubmitCodeInput {
  code: string;
  language: ProgrammingLanguageEnum;
  problemId: string;
}

export interface IRunTestCasesOutput {
  status: ResultStatusEnum;
  error?: string;
  failedTestCase?: ITestCase;
  passedCount: number;
  totalCount: number;
  logs: string[];
  testResults: {
    passed: boolean;
    output: string;
    input: string;
    expectedOutput: string;
  }[];
}

export interface ISubmitCodeOutput {
  status: ResultStatusEnum;
  executionTime: number;
  memoryUsed: number;
  error?: string;
  failedTestCase?: ITestCase;
  passedCount: number;
  totalCount: number;
  logs: string[];
}

export interface ICodeExecutionInput {
  code: string;
  language: ProgrammingLanguageEnum;
}

export interface ICodeExecutionOutput {
  status: ResultStatusEnum;
  logs: string[];
  error?: string;
}
