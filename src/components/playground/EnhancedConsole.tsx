import { useState } from "react";
import { CodeExecutionResult } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  Clock,
  Trash2,
  RefreshCw,
  Download,
  Clipboard,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

interface EnhancedConsoleProps {
  result: CodeExecutionResult | null;
  isExecuting: boolean;
  onClear: () => void;
}

export function EnhancedConsole({
  result,
  isExecuting,
  onClear,
}: EnhancedConsoleProps) {
  const [activeTab, setActiveTab] = useState("output");

  // Copy output to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success("Copied to clipboard");
      },
      (err) => {
        toast.error("Failed to copy to clipboard");
        console.error("Could not copy text: ", err);
      }
    );
  };

  // Save output as file
  const saveAsFile = (content: string, fileType: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `output.${fileType}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Output saved as file");
  };

  // Render loading state
  const renderLoading = () => (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-sm text-muted-foreground">
          Executing code, please wait...
        </p>
      </div>
    </div>
  );

  // Render empty state
  const renderEmpty = () => (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center text-center max-w-md">
        <AlertTriangle className="h-8 w-8 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No output to display</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Run your code to see the output here. The console will display logs,
          errors, and test results.
        </p>
      </div>
    </div>
  );

  // Render console output
  const renderConsoleOutput = () => {
    if (!result) return null;

    return (
      <div className="font-mono text-sm p-4 overflow-auto max-h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={
                result.status === "success"
                  ? "bg-green-500/10 text-green-600 border-green-200"
                  : result.status === "error"
                  ? "bg-red-500/10 text-red-600 border-red-200"
                  : "bg-yellow-500/10 text-yellow-600 border-yellow-200"
              }
            >
              {result.status === "success" ? (
                <Check className="mr-1 h-3 w-3" />
              ) : result.status === "error" ? (
                <X className="mr-1 h-3 w-3" />
              ) : (
                <Clock className="mr-1 h-3 w-3" />
              )}
              {result.status === "success"
                ? "Success"
                : result.status === "error"
                ? "Error"
                : "Running"}
            </Badge>
            {result.executionTime !== undefined && (
              <Badge variant="outline" className="bg-muted/50">
                <Clock className="mr-1 h-3 w-3" />
                {result.executionTime} ms
              </Badge>
            )}
            {result.memoryUsed !== undefined && (
              <Badge variant="outline" className="bg-muted/50">
                {result.memoryUsed} KB
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              title="Copy Output"
              onClick={() => copyToClipboard(result.output.join("\n"))}
            >
              <Clipboard className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Save Output"
              onClick={() => saveAsFile(result.output.join("\n"), "txt")}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Clear Console"
              onClick={onClear}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator className="my-2" />

        {result.error ? (
          <div className="text-red-500 whitespace-pre-wrap overflow-x-auto">
            {result.error}
          </div>
        ) : (
          <div className="whitespace-pre-wrap overflow-x-auto">
            {result.output.length > 0 ? (
              result.output.map((line, idx) => <div key={idx}>{line}</div>)
            ) : (
              <div className="text-muted-foreground italic">
                No output generated
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Render test results
  const renderTestResults = () => {
    if (!result || !result.testResults || result.testResults.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-muted-foreground">No test results available</p>
          </div>
        </div>
      );
    }

    const passedTests = result.testResults.filter((test) => test.passed).length;
    const totalTests = result.testResults.length;

    return (
      <div className="p-4 overflow-auto max-h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={
                passedTests === totalTests
                  ? "bg-green-500/10 text-green-600 border-green-200"
                  : "bg-yellow-500/10 text-yellow-600 border-yellow-200"
              }
            >
              {passedTests === totalTests ? (
                <Check className="mr-1 h-3 w-3" />
              ) : (
                <AlertTriangle className="mr-1 h-3 w-3" />
              )}
              {passedTests} / {totalTests} Tests Passed
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          {result.testResults.map((test, index) => (
            <div
              key={index}
              className={`border rounded-md p-3 ${
                test.passed
                  ? "border-green-200 bg-green-50 dark:bg-green-950/10"
                  : "border-red-200 bg-red-50 dark:bg-red-950/10"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className={
                    test.passed
                      ? "bg-green-500/10 text-green-600 border-green-200"
                      : "bg-red-500/10 text-red-600 border-red-200"
                  }
                >
                  {test.passed ? (
                    <Check className="mr-1 h-3 w-3" />
                  ) : (
                    <X className="mr-1 h-3 w-3" />
                  )}
                  Test Case {index + 1}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Input:
                  </div>
                  <pre className="bg-muted/30 p-2 rounded text-xs overflow-auto">
                    {test.input}
                  </pre>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Expected Output:
                  </div>
                  <pre className="bg-muted/30 p-2 rounded text-xs overflow-auto">
                    {test.expectedOutput}
                  </pre>
                </div>
              </div>

              {!test.passed && (
                <div className="mt-3">
                  <div className="text-xs text-muted-foreground mb-1">
                    Your Output:
                  </div>
                  <pre className="bg-muted/30 p-2 rounded text-xs overflow-auto">
                    {test.actualOutput}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col"
      >
        <TabsList className="mb-1">
          <TabsTrigger value="output">Console Output</TabsTrigger>
          <TabsTrigger value="tests">
            Test Results
            {result?.testResults && (
              <Badge
                variant="outline"
                className={`ml-2 ${
                  result.allTestsPassed
                    ? "bg-green-500/10 text-green-600 border-green-200"
                    : "bg-red-500/10 text-red-600 border-red-200"
                }`}
              >
                {result.testResults.filter((t) => t.passed).length}/
                {result.testResults.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 border rounded-md overflow-hidden">
          {isExecuting ? (
            renderLoading()
          ) : !result ? (
            renderEmpty()
          ) : (
            <>
              <TabsContent
                value="output"
                className="h-full m-0 outline-none overflow-auto"
              >
                {renderConsoleOutput()}
              </TabsContent>
              <TabsContent
                value="tests"
                className="h-full m-0 outline-none overflow-auto"
              >
                {renderTestResults()}
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>
    </div>
  );
}

export default EnhancedConsole;
