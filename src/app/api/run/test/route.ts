import { NextRequest } from "next/server";
import { Problem } from "@/lib/db/models/problem.model";
import { IRunTestsResult, ITestResult, ProgrammingLanguageEnum } from "@/types";
import { apiHandler } from "@/lib/errorHandler";
import { createValidator } from "@/lib/validator";
import { RunTestsSchema } from "../schemas";
import { NotFoundException } from "@/lib/exceptions";

const validateRunTests = createValidator(RunTestsSchema, "body");

export const POST = apiHandler(async (req: NextRequest) => {
  const validatedParams = await validateRunTests(req);

  const problem = await Problem.findById(validatedParams.problemId);
  if (!problem) {
    throw new NotFoundException("Problem not found");
  }

  const testCases = validatedParams.testCaseIdz?.length ? problem.testCases.filter((_, index) => validatedParams.testCaseIdz?.includes(index)) : problem.testCases;
  const testResults = simulateTestRun(validatedParams.code, validatedParams.language, testCases);

  const totalTestCases = testResults.length;
  const passedTestCases = testResults.filter((result) => result.passed).length;

  const result: IRunTestsResult = {
    status: "success",
    output: [`Running ${totalTestCases} test cases...`],
    testResults,
    executionTime: Math.floor(Math.random() * 50) + 10,
    memoryUsed: Math.floor(Math.random() * 5) + 2,
    allTestsPassed: passedTestCases === totalTestCases,
  };

  testResults.forEach((test, index) => {
    result.output.push(`Test Case ${index + 1}: ${test.passed ? "PASSED" : "FAILED"}`);
  });

  result.output.push(`\nSummary: ${passedTestCases}/${totalTestCases} test cases passed.`);

  return { data: result, status: 200 };
});

function simulateTestRun(code: string, language: ProgrammingLanguageEnum, testCases: any[]): ITestResult[] {
  const testResults = testCases.map((testCase, index) => {
    // Simplified test evaluation logic - in a real app, this would execute the code
    // against the test case in a secure environment

    // For demo purposes, we'll assume JavaScript evaluation
    let passed = false;
    let actualOutput = "";

    try {
      // Extract function name from code (very simplified)
      const functionNameMatch = code.match(/function\s+(\w+)/);
      const functionName = functionNameMatch ? functionNameMatch[1] : null;

      if (functionName) {
        // Very naive evaluation - in a real app, this would be much more sophisticated
        // This is just for demo purposes and shouldn't be used in production

        const evalCode = `
          ${code}
          ${functionName}(${testCase.input})
        `;

        // DANGER: eval is unsafe - this is only for demonstration
        // In a real app, use a sandbox environment
        try {
          actualOutput = String(eval(evalCode));

          // Compare with expected output (very basic comparison)
          passed = actualOutput.trim() === testCase.expectedOutput.trim();
        } catch (error) {
          actualOutput = `Error: ${error instanceof Error ? error.message : String(error)}`;
        }
      } else {
        actualOutput = "Could not determine function name";
      }
    } catch (error) {
      actualOutput = `Error: ${error instanceof Error ? error.message : String(error)}`;
    }

    return {
      passed,
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput,
      testCaseId: index,
    };
  });

  return testResults;
}
