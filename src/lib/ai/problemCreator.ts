import { IProblemCreateInput } from "@/types";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
  });

  return result.toDataStreamResponse();
}

export async function aiProblemCreator(input: IProblemCreateInput) {
  const { difficulty, complexity, topics, customPrompt, exampleCount, timeLimit, memoryLimit } = input;

  // Construct the prompt for the AI
  const prompt = `Create a coding problem with the following specifications:
- Difficulty: ${difficulty || "medium"}
- Complexity: ${complexity || "medium"}
- Topics: ${topics?.join(", ") || "algorithms"}
- Number of examples: ${exampleCount || 3}
- Time limit: ${timeLimit || "standard"}
- Memory limit: ${memoryLimit || "standard"}
${customPrompt ? `\nAdditional requirements: ${customPrompt}` : ""}

Format the response as a JSON object with the following structure:
{
  "title": "Problem title",
  "category": "Main category",
  "description": "Full markdown description with problem statement, input/output format, and constraints",
  "constraints": ["constraint1", "constraint2"],
  "examples": [
    {"input": "example input", "output": "example output", "explanation": "explanation"}
  ],
  "testCases": [
    {"input": "test input", "expectedOutput": "expected output", "isHidden": false}
  ],
  "starterCode": {
    "javascript": "code here",
    "python": "code here",
    "java": "code here",
    "cpp": "code here"
  },
  "solution": {
    "javascript": "solution code",
    "python": "solution code",
    "java": "solution code",
    "cpp": "solution code"
  },
  "tags": ["tag1", "tag2"]
}`;

  try {
    // Call OpenAI API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Parse the AI response
    try {
      const problemData = JSON.parse(data.content);
      return problemData as any;
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return getFallbackProblem(topics?.[0]);
    }
  } catch (error) {
    console.error("Error generating problem with AI:", error);
    return getFallbackProblem(topics?.[0]);
  }
}

// Fallback problem in case AI generation fails
function getFallbackProblem(topic?: string) {
  return {
    title: "Sum Two Numbers",
    category: topic || "Basic Algorithms",
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
