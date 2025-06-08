import { ISchema, SortOption } from ".";
import { DifficultyEnum } from "./enums";
import { IProblem } from "./problems";

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

export interface ICollectionFilters {
  search?: string;
  tags?: string[];
  featured?: boolean;
  sortBy?: SortOption;
  myCollections?: boolean;
}

export interface ICollectionCreateInput {
  title: string;
  description?: string;
  problems: string[];
  isPublic: boolean;
  difficulty?: DifficultyEnum;
  tags: string[];
}
