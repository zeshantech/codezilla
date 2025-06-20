import { ISchema } from "./index";
import { ProgrammingLanguageEnum } from "./enums";

export type BadgeLevelType = "bronze" | "silver" | "gold" | "platinum";
export type ExperienceLevelType = "beginner" | "intermediate" | "advanced" | "expert";
export type ThemeType = "light" | "dark" | "system";

export interface IUser extends ISchema {
  auth0Id: string;
  firstName: string;
  lastName?: string;
  email: string;
  avatarUrl: string;
  bio: string;
}

export interface IProfile extends ISchema {
  completedProblems: number;
  completedCollections: number;
  streak: number;
  points: number;
}

export interface IGetProfileOutput {
  profile: IProfile & IUser;
  settings: ISettings;
  badges: IBadge[];
  certificates: ICertificate[];
}

export interface IGetStatsOutput {
  difficultyStats: IDifficultyStats;
  activityStats: IActivityStat[];
  skillStats: ISkillStat[];
  languageStats: ILanguageStat[];
}

export interface IDifficultyStats {
  easy: {
    solved: number;
    total: number;
    percentage: number;
  };
  medium: {
    solved: number;
    total: number;
    percentage: number;
  };
  hard: {
    solved: number;
    total: number;
    percentage: number;
  };
}

export interface ILanguageStat {
  language: ProgrammingLanguageEnum;
  problemsSolved: number;
  percentage: number;
  experienceLevel: ExperienceLevelType;
}

export interface IActivityStat {
  from: Date;
  to: Date;
  problemsSolved: number;
  submissions: number;
  week: string;
}

export interface IBadge extends ISchema {
  name: string;
  description: string;
  imageUrl: string;
  level: BadgeLevelType;
}

export interface ICertificate extends ISchema {
  name: string;
  description: string;
  imageUrl: string;
  expiresAt?: string;
  credentialId: string;
  credentialUrl: string;
}

export interface ISettings {
  notifications: {
    email: boolean;
    browser: boolean;
    mobile: boolean;
  };
  appearance: {
    theme: ThemeType;
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

export interface ISkillStat {
  categoryId: string;
  categoryName: string;
  problemsSolved: number;
  totalProblems: number;
  percentage: number;
}

// APIs inputs
export interface IUpdateProfileInput {
  firstName: string;
  lastName?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface IUpdateAppearanceInput {
  theme: ThemeType;
  codeFont: string;
  fontSize: number;
}

export interface IUpdatePreferencesInput {
  defaultLanguage: ProgrammingLanguageEnum;
  defaultTabSize: number;
  autosave: boolean;
}

export interface IUpdateNotificationsInput {
  email: boolean;
  browser: boolean;
  mobile: boolean;
}

export interface IUpdatePrivacyInput {
  showActivity: boolean;
  showSolutions: boolean;
  showProfile: boolean;
}
