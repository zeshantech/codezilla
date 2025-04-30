import { NextRequest, NextResponse } from "next/server";
import { Problem } from "@/lib/db/models/problem.model";
import dbConnect from "@/lib/db/connection";
import { ICodeExecutionResult, ProgrammingLanguageEnum } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { code, language, problemId, testCaseIds } = await req.json();

    // Validate required fields
    if (!code || !language || !problemId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Connect to database
    await dbConnect();

    // Get the problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    // Get test cases to run (either specified or all)
    const testCases = testCaseIds && testCaseIds.length > 0 ? problem.testCases.filter((_, index) => testCaseIds.includes(index)) : problem.testCases;

    // Simulate running test cases (in a real app, this would run in a secure environment)
    const testResults = simulateTestRun(code, language, testCases);

    // Calculate statistics
    const totalTestCases = testResults.length;
    const passedTestCases = testResults.filter((result) => result.passed).length;

    const result: ICodeExecutionResult = {
      status: "success",
      output: [`Running ${totalTestCases} test cases...`],
      testResults,
      executionTime: Math.floor(Math.random() * 50) + 10, // Simulate execution time (10-60ms)
      memoryUsed: Math.floor(Math.random() * 5) + 2, // Simulate memory usage (2-7MB)
      allTestsPassed: passedTestCases === totalTestCases,
    };

    // Add logs for each test case
    testResults.forEach((test, index) => {
      result.output.push(`Test Case ${index + 1}: ${test.passed ? "PASSED" : "FAILED"}`);
      if (!test.passed) {
        result.output.push(`  - Input: ${test.input}`);
        result.output.push(`  - Expected Output: ${test.expectedOutput}`);
        result.output.push(`  - Actual Output: ${test.actualOutput}`);
      }
    });

    // Summary log
    result.output.push(`\nSummary: ${passedTestCases}/${totalTestCases} test cases passed.`);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error running test cases:", error);
    return NextResponse.json(
      {
        status: "error",
        output: ["Error running test cases"],
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Function to simulate running test cases
// In a real app, this would use a secure execution environment
function simulateTestRun(code: string, language: ProgrammingLanguageEnum, testCases: any[]) {
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
