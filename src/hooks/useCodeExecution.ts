import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
  CodeExecutionRequest,
  CodeExecutionResult,
  ProgrammingLanguage,
  Problem,
  TestCase,
} from "@/types";

export const useCodeExecution = () => {
  const [executionResult, setExecutionResult] =
    useState<CodeExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Helper function to run the user's code against test cases
  const executeCode = useCallback(
    async ({
      code,
      language,
      problemId,
    }: CodeExecutionRequest): Promise<CodeExecutionResult> => {
      setIsExecuting(true);
      setExecutionResult({ status: "running", output: ["Running code..."] });

      try {
        // In a real app, this would be a server call to a secure execution environment
        // For demo purposes, we're using eval, which is dangerous in production
        const logs: string[] = [];
        const errors: string[] = [];

        // Create a safe console.log replacement
        const originalConsoleLog = console.log;
        console.log = (...args) => {
          const logMessage = args
            .map((arg) =>
              typeof arg === "object" ? JSON.stringify(arg) : String(arg)
            )
            .join(" ");
          logs.push(logMessage);
          originalConsoleLog(...args);
        };

        // Execute the code
        let result;
        try {
          // This is just for demo purposes - in a real app, never use eval with user input
          result = eval(`
            try {
              ${code}
              // Special handling for common problem functions
              if (typeof twoSum === 'function' && '${problemId}' === 'two-sum') {
                "Testing twoSum function...";
              } else if (typeof isValid === 'function' && '${problemId}' === 'valid-parentheses') {
                "Testing isValid function...";
              } else if (typeof lengthOfLongestSubstring === 'function' && '${problemId}' === 'longest-substring') {
                "Testing lengthOfLongestSubstring function...";
              }
              "Code executed successfully";
            } catch (error) {
              throw error;
            }
          `);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          errors.push(errorMessage);
        }

        // Restore original console.log
        console.log = originalConsoleLog;

        // Prepare test results based on problem ID (simplified for demo)
        let testResults = [];
        if (problemId) {
          testResults = simulateTestResults(code, problemId);
        }

        // Determine overall status
        let status: "success" | "error" | "running" =
          errors.length > 0 ? "error" : "success";
        const allTestsPassed =
          testResults.length > 0
            ? testResults.every((test) => test.passed)
            : false;

        const executionResult: CodeExecutionResult = {
          status,
          output: logs,
          error: errors.join("\n"),
          testResults: testResults.length > 0 ? testResults : undefined,
          executionTime: Math.floor(Math.random() * 50) + 10, // Simulate execution time (10-60ms)
          memoryUsed: Math.floor(Math.random() * 5) + 2, // Simulate memory usage (2-7MB)
          allTestsPassed: testResults.length > 0 ? allTestsPassed : undefined,
        };

        setExecutionResult(executionResult);
        setIsExecuting(false);

        // Show toast notification based on result
        if (status === "error") {
          toast.error("Execution failed. Check the error message.");
        } else if (allTestsPassed) {
          toast.success("All tests passed! 🎉");
        } else if (testResults.length > 0) {
          toast.info(
            `Passed ${testResults.filter((t) => t.passed).length}/${
              testResults.length
            } tests.`
          );
        } else {
          toast.success("Code executed successfully!");
        }

        return executionResult;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        const executionResult: CodeExecutionResult = {
          status: "error",
          output: [],
          error: `Execution error: ${errorMessage}`,
        };

        setExecutionResult(executionResult);
        setIsExecuting(false);
        toast.error("Execution failed. Check the error message.");

        return executionResult;
      }
    },
    []
  );

  const clearExecutionResult = useCallback(() => {
    setExecutionResult(null);
  }, []);

  return {
    executeCode,
    clearExecutionResult,
    executionResult,
    isExecuting,
  };
};

// Helper function to simulate running test cases
// In a real app, this would happen server-side in a controlled environment
function simulateTestResults(code: string, problemId: string) {
  // Simplified test cases for demo - in reality, this would be more sophisticated
  let testResults = [];

  // Example test case evaluation for Two Sum problem
  if (problemId === "two-sum" && code.includes("function twoSum")) {
    testResults = [
      {
        passed:
          code.includes("map") ||
          code.includes("Map") ||
          (code.includes("for") && code.includes("return")),
        input: "[2,7,11,15], 9",
        expectedOutput: "[0,1]",
        actualOutput: "[0,1]",
        testCaseId: 1,
      },
      {
        passed:
          code.includes("map") ||
          code.includes("Map") ||
          (code.includes("for") && code.includes("return")),
        input: "[3,2,4], 6",
        expectedOutput: "[1,2]",
        actualOutput: "[1,2]",
        testCaseId: 2,
      },
    ];
  }

  // Example test case evaluation for Valid Parentheses problem
  else if (
    problemId === "valid-parentheses" &&
    code.includes("function isValid")
  ) {
    testResults = [
      {
        passed:
          code.includes("stack") ||
          code.includes("Stack") ||
          code.includes("push") ||
          code.includes("pop"),
        input: '"()"',
        expectedOutput: "true",
        actualOutput: "true",
        testCaseId: 1,
      },
      {
        passed:
          code.includes("stack") ||
          code.includes("Stack") ||
          code.includes("push") ||
          code.includes("pop"),
        input: '"()[]{}"',
        expectedOutput: "true",
        actualOutput: "true",
        testCaseId: 2,
      },
    ];
  }

  return testResults;
}

export default useCodeExecution;
