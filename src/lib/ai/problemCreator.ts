import { IProblemCreateInput } from "@/types";
import React from "react";

export function aiProblemCreator(input: IProblemCreateInput) {
  const {
    difficulty,
    complexity,
    topics,
    customPrompt,
    exampleCount,
    timeLimit,
    memoryLimit,
  } = input;

  return {
    title: "Sum Two Numbers",
    category: topics?.[0] || "Basic Algorithms",
    description: `
## Sum Two Numbers

You are given two integers, a and b. Your task is to write a function that returns the sum of these two numbers.

### Problem Description

Write a function that takes two integer parameters and returns their sum.

### Input Format
- Two integers a and b

### Output Format
- An integer representing the sum of a and b

### Constraints
- ${-Math.pow(10, 9)} ≤ a, b ≤ ${Math.pow(10, 9)}
    `,
    constraints: [`-${Math.pow(10, 9)} ≤ a, b ≤ ${Math.pow(10, 9)}`],
    examples: [
      {
        input: "a = 3, b = 5",
        output: "8",
        explanation: "The sum of 3 and 5 is 8.",
      },
      {
        input: "a = -2, b = 7",
        output: "5",
        explanation: "The sum of -2 and 7 is 5.",
      },
      {
        input: "a = 0, b = 0",
        output: "0",
        explanation: "The sum of 0 and 0 is 0.",
      },
    ],
    testCases: [
      {
        input: "3, 5",
        expectedOutput: "8",
      },
      {
        input: "-2, 7",
        expectedOutput: "5",
      },
      {
        input: "0, 0",
        expectedOutput: "0",
      },
      {
        input: "1000, 1000",
        expectedOutput: "2000",
      },
      {
        input: "-5, -7",
        expectedOutput: "-12",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `/**
 * @param {number} a - The first integer
 * @param {number} b - The second integer
 * @return {number} - The sum of a and b
 */
function sumTwoNumbers(a, b) {
  // Write your code here
  
}`,
      python: `class Solution:
    def sum_two_numbers(self, a: int, b: int) -> int:
        # Write your code here
        pass`,
      java: `class Solution {
    public int sumTwoNumbers(int a, int b) {
        // Write your code here
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int sumTwoNumbers(int a, int b) {
        // Write your code here
        return 0;
    }
};`,
    },
    solution: {
      javascript: `function sumTwoNumbers(a, b) {
  return a + b;
}`,
      python: `class Solution:
    def sum_two_numbers(self, a: int, b: int) -> int:
        return a + b`,
      java: `class Solution {
    public int sumTwoNumbers(int a, int b) {
        return a + b;
    }
}`,
      cpp: `class Solution {
public:
    int sumTwoNumbers(int a, int b) {
        return a + b;
    }
};`,
    },
    tags: ["math", "beginner", "basic"],
  };
}
