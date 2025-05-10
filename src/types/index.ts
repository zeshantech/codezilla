import { LucideIcon } from "lucide-react";

export enum DifficultyEnum {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
  MIXED = "mixed",
}

export enum ProgrammingLanguageEnum {
  JAVASCRIPT = "javascript",
  PYTHON = "python",
  JAVA = "java",
  CPP = "cpp",
}

export enum SubmissionStatusEnum {
  ATTEMPTED = "attempted",
  SOLVED = "solved",
  FAILED = "failed",
}

export interface ISchema {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface IExample {
  input: string;
  output: string;
  explanation: string;
}

export interface ITestCase {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface IProblem extends ISchema {
  title: string;
  slug: string;
  difficulty: DifficultyEnum;
  category: string;
  description: string;
  constraints: string[];
  examples: IExample[];
  testCases: ITestCase[];
  starterCode: Record<ProgrammingLanguageEnum, string>;
  solution?: Record<ProgrammingLanguageEnum, string>;
  popularity: number;
  completionCount: number;
  createdBy?: string;
  isFeatured?: boolean;
  tags: string[];
}

export interface IProblemStats {
  attempted: number;
  solved: number;
  submissions: number;
  successRate: number;
  averageAttempts: number;
  averageTime: number;
}

export interface ICategory {
  id: string;
  name: string;
  count: number;
  icon: LucideIcon;
}

export interface ICollection extends ISchema {
  title: string;
  slug: string;
  description: string;
  problems?: string[] | IProblem[];
  createdBy?: string;
  isPublic: boolean;
  isFeatured?: boolean;
  completionCount: number;
  difficulty?: DifficultyEnum;
  tags: string[];
}

export interface IUserProblemProgress {
  problem: string;
  status: "attempted" | "solved" | "not_started";
  submissions: number;
  lastSubmissionDate?: string;
  timeTaken?: number;
  code?: Record<ProgrammingLanguageEnum, string>;
}

export interface IUser extends ISchema {
  problemsProgress: Record<string, IUserProblemProgress>;
  completedProblems: number;
  completedCollections: number;
  createdProblems: number;
  createdCollections: number;
  streak: number;
  points: number;
}

export interface IEditorConfig {
  theme: "light" | "dark";
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  showLineNumbers: boolean;
  showMinimap: boolean;
  autoComplete: boolean;
  formatOnSave: boolean;
}

export type SortOption = "popularity" | "newest" | "title" | "difficulty" | "completion_rate";

export interface IProblemFilters {
  search?: string;
  categories?: string[];
  difficulties?: DifficultyEnum[];
  tags?: string[];
  collectionSlug?: string;
  status?: ("attempted" | "solved" | "not_started")[];
  sortBy?: SortOption;
}

export interface ICollectionFilters {
  search?: string;
  tags?: string[];
  featured?: boolean;
  sortBy?: SortOption;
  myCollections?: boolean;
}

// User profile/settings types
export interface IUserSettings {
  notifications: {
    email: boolean;
    browser: boolean;
    mobile: boolean;
  };
  appearance: {
    theme: "light" | "dark" | "system";
    codeFont: string;
    fontSize: number;
  };
  preferences: {
    defaultLanguage: ProgrammingLanguageEnum;
    defaultTabSize: number;
    autosave: boolean;
  };
  privacy: {
    showActivity: boolean;
    showSolutions: boolean;
    showProfile: boolean;
  };
}

export interface IUserProfileUpdate {
  name?: string;
  bio?: string;
  avatarUrl?: string;
  email?: string;
}

export interface IUserStats {
  totalPoints: number;
  rank: number;
  completedProblems: number;
  completedCollections: number;
  streak: number;
  joinedDate: string;
}

export interface IUserProfile {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
  joinedDate: string;
  settings: IUserSettings;
}

export interface IProblemCreateInput {
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
  constraints: string[];
  examples: IExample[];
  testCases: ITestCase[];
  starterCode: Record<ProgrammingLanguageEnum, string>;
  solution: Record<ProgrammingLanguageEnum, string>;
  tags: string[];
}

export interface ICollectionCreateInput {
  title: string;
  description?: string;
  problems: string[];
  isPublic: boolean;
  difficulty?: DifficultyEnum;
  tags: string[];
}

export interface IError {
  message: string;
  statusCode: number;
  errors: string[];
}

export interface ISubmission extends ISchema {
  user: string;
  problem: string;
  code: string;
  language: ProgrammingLanguageEnum;
  status: SubmissionStatusEnum;
  executionTime?: number;
  memoryUsed?: number;
  testResults?: ITestResult[];
  logs: string[];
  error?: string;
}

export interface ITestResult {
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  testCaseId: number;
}

export interface ICodeExecutionRequest {
  code: string;
  language: ProgrammingLanguageEnum;
}

export interface IRunTestRequest extends ICodeExecutionRequest {
  problemId: string;
  testCaseIdz?: number[];
}

export interface ICodeExecutionResult {
  status: "success" | "error" | "running";
  output: string[];
  error?: string;
  executionTime?: number;
  memoryUsed?: number;
}

export interface IRunTestsResult extends ICodeExecutionResult {
  testResults?: ITestResult[];
  allTestsPassed?: boolean;
}
