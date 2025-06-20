import { IAiProblemCreateInput, IProblemSaveInput } from "@/types/problems";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({
  apiKey: "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",
});

export const maxDuration = 30;

export async function aiProblemCreator(input: IAiProblemCreateInput) {
  const { difficulty, complexity, topics, customPrompt, exampleCount, timeLimit, memoryLimit } = input;

  const result = await generateText({
    model: openai("gpt-4o"),
    system: `You are a coding problem creator. You are given a set of specifications and you need to create a coding problem that matches the specifications and don't include any other text or comments in your response because it will be parsed as a json object`,
    prompt: `Create a coding problem with the following specifications:
    
    Difficulty: ${difficulty}
    Complexity: ${complexity}%
    Topics: ${topics.join(", ")}
    ${customPrompt ? `Custom Prompt: ${customPrompt}` : ""}
    ${timeLimit ? `Time Limit: ${timeLimit}` : ""}
    ${memoryLimit ? `Memory Limit: ${memoryLimit}` : ""}

    and return the problem in the following format:
    {
    title: "{{a friendly title of problem}}",
    category: "{{a simple category for the problem}}",
    description: "{{Description of the problem in embedded html format}}",
    examples: [
      // Add ${exampleCount ? (exampleCount > 6 ? 6 : exampleCount) : 3} examples
      {
        input: "{{example input}}",
        output: "{{example output}}",
        explanation: "{{explanation why this is the correct output}}",
      },
    ],
    testCases: [
      // Add 50 to 80 test cases and make 3 of them hidden false (add all please dont add just comment)
      {
        input: "{{test case input}}",
        expectedOutput: "{{test case output}}",
        isHidden: "{{true or false}}",
      },
    ],
    starterCode: {
      javascript: "{{starter code in javascript}}",
      python: "{{starter code in python}}",
      java: "{{starter code in java}}",
      cpp: "{{starter code in cpp}}",
    },
    solution: {
      javascript: "{{time and space frindly solution in javascript}}",
      python: "{{time and space frindly solution in python}}",
      java: "{{time and space frindly solution in java}}",
      cpp: "{{time and space frindly solution in cpp}}",
    },
    tags: ["{{3, 5 tags for the problem so user can filter by them}}"],
  }
    `,
  });

  console.log(typeof result.text);

  const json = JSON.parse(result.text);

  console.log(json);

  return JSON.parse(JSON.stringify(result.text)) as IProblemSaveInput;
}
