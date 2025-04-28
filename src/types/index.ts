import { LucideIcon } from "lucide-react";

export enum DifficultyEnum {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export type ProgrammingLanguage = "javascript" | "python" | "java" | "cpp";

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
  starterCode: Record<ProgrammingLanguage, string>;
  solution?: Record<ProgrammingLanguage, string>;
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
  code?: Record<ProgrammingLanguage, string>;
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

export interface ICodeExecutionRequest {
  code: string;
  language: ProgrammingLanguage;
  problemId?: string;
}

export interface ICodeExecutionResult {
  status: "success" | "error" | "running";
  output: string[];
  error?: string;
  testResults?: {
    passed: boolean;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    testCaseId: number;
  }[];
  executionTime?: number;
  memoryUsed?: number;
  allTestsPassed?: boolean;
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

export type SortOption =
  | "popularity"
  | "newest"
  | "title"
  | "difficulty"
  | "completion_rate";

export interface IProblemFilters {
  search?: string;
  categories?: string[];
  difficulties?: DifficultyEnum[];
  tags?: string[];
  status?: ("attempted" | "solved" | "not_started")[];
  sortBy?: SortOption;
}

export interface ICollectionFilters {
  search?: string;
  tags?: string[];
  createdBy?: string;
  featured?: boolean;
  sortBy?: SortOption;
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
    defaultLanguage: ProgrammingLanguage;
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
