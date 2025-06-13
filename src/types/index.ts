export interface ISchema {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
}

export type SortOption = "popularity" | "newest" | "title" | "difficulty" | "completion_rate";

export interface IError {
  message: string;
  statusCode: number;
  errors: string[];
}
