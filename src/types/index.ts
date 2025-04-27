import { LucideIcon } from "lucide-react";

export type Difficulty = "Easy" | "Medium" | "Hard";

export type ProgrammingLanguage = "javascript" | "python" | "java" | "cpp";

export interface Example {
  input: string;
  output: string;
  explanation: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: Difficulty;
  category: string;
  description: string;
  constraints: string[];
  examples: Example[];
  testCases: TestCase[];
  starterCode: Record<ProgrammingLanguage, string>;
  solution?: Record<ProgrammingLanguage, string>;
  popularity: number;
  completionCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  isFeatured?: boolean;
  tags: string[];
}

export interface ProblemStats {
  attempted: number;
  solved: number;
  submissions: number;
  successRate: number;
  averageAttempts: number;
  averageTime: number;
}

export interface Category {
  id: string;
  name: string;
  count: number;
  icon: LucideIcon;
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  description: string;
  problemIds: string[];
  problems?: Problem[];
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  isFeatured?: boolean;
  completionCount: number;
  difficulty?: Difficulty;
  tags: string[];
}

export interface UserProblemProgress {
  problemId: string;
  status: "attempted" | "solved" | "not_started";
  submissions: number;
  lastSubmissionDate?: string;
  timeTaken?: number;
  code?: Record<ProgrammingLanguage, string>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  joinedDate: string;
  problemsProgress: Record<string, UserProblemProgress>;
  completedProblems: number;
  completedCollections: number;
  createdProblems: number;
  createdCollections: number;
  streak: number;
  points: number;
}

export interface CodeExecutionRequest {
  code: string;
  language: ProgrammingLanguage;
  problemId?: string;
}

export interface CodeExecutionResult {
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

export interface EditorConfig {
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

export interface ProblemFilters {
  search?: string;
  categories?: string[];
  difficulties?: Difficulty[];
  tags?: string[];
  status?: ("attempted" | "solved" | "not_started")[];
  sortBy?: SortOption;
}

export interface CollectionFilters {
  search?: string;
  tags?: string[];
  createdBy?: string;
  featured?: boolean;
  sortBy?: SortOption;
}

// User profile/settings types
export interface UserSettings {
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

export interface UserProfileUpdate {
  name?: string;
  bio?: string;
  avatarUrl?: string;
  email?: string;
}

export interface UserStats {
  totalPoints: number;
  rank: number;
  completedProblems: number;
  completedCollections: number;
  streak: number;
  joinedDate: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatarUrl: string;
  joinedDate: string;
  settings: UserSettings;
}
