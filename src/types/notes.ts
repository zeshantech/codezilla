import { ISchema } from ".";
import { IProblem } from "./problems";

export interface INote extends ISchema {
  user: string;
  problem: string | IProblem;
  content: string;
}

export interface INoteCreateInput {
  content: string;
  problemId: string;
}

export interface INoteUpdateInput {
  noteId: string;
  content: string;
}
