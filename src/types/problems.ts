import { ISchema, SortOption } from ".";
import { DifficultyEnum, ProgrammingLanguageEnum } from "./enums";
import { ITestCaseSaveInput } from "./testCases";

export interface IExample {
  input: string;
  output: string;
  explanation: string;
}

export interface IProblemFilters {
  search?: string;
  categories?: string[];
  difficulties?: DifficultyEnum[];
  tags?: string[];
  collectionSlug?: string;
  status?: ("attempted" | "solved" | "not_started")[];
  sortBy?: SortOption;
}

export interface IProblem extends ISchema {
  title: string;
  slug: string;
  difficulty: DifficultyEnum;
  category: string;
  description: string;
  examples: IExample[];
  starterCode: Record<ProgrammingLanguageEnum, string>;
  solution?: Record<ProgrammingLanguageEnum, string>;
  isPublic: boolean;
  popularity: number;
  completionCount: number;
  createdBy?: string;
  isFeatured?: boolean;
  tags: string[];
}

export interface IAiProblemCreateInput {
  difficulty: DifficultyEnum;
  complexity: number;
  topics: string[];
  customPrompt?: string;
  exampleCount: number;
  timeLimit: number;
  memoryLimit: number;
}

export interface IProblemSaveInput {
  title: string;
  difficulty: DifficultyEnum;
  category: string;
  description: string;
  examples: IExample[];
  testCases: ITestCaseSaveInput[];
  starterCode: Record<ProgrammingLanguageEnum, string>;
  solution: Record<ProgrammingLanguageEnum, string>;
  tags: string[];
}
