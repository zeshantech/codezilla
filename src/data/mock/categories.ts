import { Category } from "@/types";
import {
  Brain,
  Code,
  CodeSquare,
  Cpu,
  Database,
  Folder,
  GitGraph,
  Binary,
  FileSearch,
  Network,
  SquareStack,
  Hash,
} from "lucide-react";

export const CATEGORIES: Category[] = [
  {
    id: "arrays",
    name: "Arrays",
    count: 84,
    icon: Cpu,
  },
  {
    id: "strings",
    name: "Strings",
    count: 67,
    icon: Code,
  },
  {
    id: "dynamic-programming",
    name: "Dynamic Programming",
    count: 45,
    icon: Brain,
  },
  {
    id: "math",
    name: "Math",
    count: 38,
    icon: CodeSquare,
  },
  {
    id: "trees",
    name: "Trees",
    count: 32,
    icon: GitGraph,
  },
  {
    id: "graphs",
    name: "Graphs",
    count: 29,
    icon: Network,
  },
  {
    id: "binary-search",
    name: "Binary Search",
    count: 24,
    icon: Binary,
  },
  {
    id: "database",
    name: "Database",
    count: 21,
    icon: Database,
  },
  {
    id: "sorting",
    name: "Sorting",
    count: 19,
    icon: FileSearch,
  },
  {
    id: "stacks",
    name: "Stacks",
    count: 16,
    icon: SquareStack,
  },
  {
    id: "hash-tables",
    name: "Hash Tables",
    count: 27,
    icon: Hash,
  },
  {
    id: "recursion",
    name: "Recursion",
    count: 18,
    icon: Folder,
  },
];
