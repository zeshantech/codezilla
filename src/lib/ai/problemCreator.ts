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
  const {
    difficulty,
    complexity,
    topics,
    customPrompt,
    exampleCount,
    timeLimit,
    memoryLimit,
  } = input;

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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/ai/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
        }),
      }
    );

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
    title: "Find Maximum Number",
    category: topic || "Basic Algorithms",
    description: `
<p>Write a function that takes an array of integers and returns the maximum value found in the array. If the array is empty, return null or an appropriate value based on the language.</p>

<h3>Input Format</h3>
<ul>
  <li>An array of integers</li>
</ul>

<h3>Output Format</h3>
<ul>
  <li>An integer representing the maximum value in the array</li>
</ul>

<h3>Constraints</h3>
<ul>
  <li>Array length will be between 1 and 10^5 (1 ≤ array.length ≤ 10^5)</li>
  <li>Array elements will be between -10^9 and 10^9 (-10^9 ≤ array[i] ≤ 10^9)</li>
</ul>
    `,
    examples: [
      {
        input: "[3, 7, 2, 9, 1]",
        output: "9",
        explanation: "9 is the largest number in the array.",
      },
      {
        input: "[-5, -2, -10, -1]",
        output: "-1",
        explanation:
          "-1 is the largest number in the array of negative integers.",
      },
      {
        input: "[42]",
        output: "42",
        explanation:
          "In an array with only one element, that element is the maximum.",
      },
    ],
    testCases: [
      {
        input: "[3, 7, 2, 9, 1]",
        expectedOutput: "9",
      },
      {
        input: "[-5, -2, -10, -1]",
        expectedOutput: "-1",
      },
      {
        input: "[42]",
        expectedOutput: "42",
      },
      {
        input: "[100, 100, 100]",
        expectedOutput: "100",
      },
      {
        input: "[0, 5, 9, 8, -10, -20, 15, 7]",
        expectedOutput: "15",
        isHidden: true,
      },
    ],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums - Array of integers
 * @return {number} - The maximum value in the array
 */
function findMaximum(nums) {
  // Write your code here
  
}`,
      python: `class Solution:
    def find_maximum(self, nums: list[int]) -> int:
        # Write your code here
        pass`,
      java: `class Solution {
    public int findMaximum(int[] nums) {
        // Write your code here
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int findMaximum(std::vector<int>& nums) {
        // Write your code here
        return 0;
    }
};`,
    },
    solution: {
      javascript: `function findMaximum(nums) {
  if (nums.length === 0) return null;
  return Math.max(...nums);
}`,
      python: `class Solution:
    def find_maximum(self, nums: list[int]) -> int:
        if not nums:
            return None
        return max(nums)`,
      java: `class Solution {
    public int findMaximum(int[] nums) {
        if (nums.length == 0) return Integer.MIN_VALUE;
        int max = nums[0];
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] > max) {
                max = nums[i];
            }
        }
        return max;
    }
}`,
      cpp: `class Solution {
public:
    int findMaximum(std::vector<int>& nums) {
        if (nums.empty()) return INT_MIN;
        return *std::max_element(nums.begin(), nums.end());
    }
};`,
    },
    tags: ["arrays", "beginner", "basic"],
  };
}
