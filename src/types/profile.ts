import { IProblem, IUser, ProgrammingLanguageEnum } from "./index";

export interface UserProfile extends IUser {
  settings: UserProfileSettings;
  badges: UserBadge[];
  certificates: UserCertificate[];
  languageStats: Record<ProgrammingLanguageEnum, LanguageStat>;
  activityHistory: ActivityRecord[];
}

export interface UserProfileSettings {
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

export interface SkillStat {
  categoryId: string;
  categoryName: string;
  problemsSolved: number;
  totalProblems: number;
  percentage: number;
}

export interface LanguageStat {
  language: ProgrammingLanguageEnum;
  problemsSolved: number;
  percentage: number;
  experienceLevel: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

export interface ActivityRecord {
  date: string;
  problemsSolved: number;
  submissions: number;
}

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  earnedAt: string;
  level: "bronze" | "silver" | "gold" | "platinum";
}

export interface UserCertificate {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  earnedAt: string;
  expiresAt?: string;
  credentialId: string;
  credentialUrl: string;
}

export interface ProblemStatusCount {
  solved: number;
  attempted: number;
  notStarted: number;
  total: number;
}

export interface ProblemsByCategory {
  categoryId: string;
  categoryName: string;
  problems: IProblem[];
  problemStatusCount: ProblemStatusCount;
}

export interface ProfileContext {
  profile: UserProfile | null;
  isLoading: boolean;
  isError: boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  updateSettings: (settings: Partial<UserProfileSettings>) => Promise<boolean>;
}
