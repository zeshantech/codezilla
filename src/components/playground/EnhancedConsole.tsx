import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock, Trash2, Download, Clipboard, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "../ui/emptyState";
import { SpinnerBox } from "../ui/spinner";
import { useCodeEditorContext } from "@/contexts/CodeEditorContext";

export function EnhancedConsole() {
  const { executionResult, isExecutingCode, clearExecutionResult, isRunningTestCases } = useCodeEditorContext();

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

  const renderConsoleOutput = () => {
    if (!executionResult) return null;

    return (
      <div className="font-mono text-sm p-4 overflow-auto h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge variant={executionResult.status === "running" ? "outline" : executionResult.status} className="capitalize">
              {executionResult.status === "success" ? <Check /> : executionResult.status === "error" ? <X /> : <Clock />}
              {executionResult.status}
            </Badge>
            {executionResult.executionTime !== undefined && (
              <Badge variant="outline">
                <Clock />
                {executionResult.executionTime} ms
              </Badge>
            )}
            {executionResult.memoryUsed !== undefined && <Badge variant="outline">{executionResult.memoryUsed} KB</Badge>}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon-sm" title="Copy Output" onClick={() => copyToClipboard(executionResult.output.join("\n"))}>
              <Clipboard />
            </Button>
            <Button variant="ghost" size="icon-sm" title="Save Output" onClick={() => saveAsFile(executionResult.output.join("\n"), "txt")}>
              <Download />
            </Button>
            <Button variant="ghost" size="icon-sm" title="Clear Console" onClick={clearExecutionResult}>
              <Trash2 />
            </Button>
          </div>
        </div>

        <Separator className="my-2" />

        {executionResult.error ? (
          <div className="text-error whitespace-pre-wrap overflow-x-auto">{executionResult.error}</div>
        ) : (
          <div className="whitespace-pre-wrap overflow-x-auto">{executionResult.output.length > 0 ? executionResult.output.map((line, idx) => <div key={idx}>{line}</div>) : <div className="text-muted-foreground italic">No output generated</div>}</div>
        )}
      </div>
    );
  };

  const renderTestResults = () => {
    if (!executionResult || !executionResult.testResults || executionResult.testResults.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-muted-foreground">No test results available</p>
          </div>
        </div>
      );
    }

    const passedTests = executionResult.testResults.filter((test) => test.passed).length;
    const totalTests = executionResult.testResults.length;

    return (
      <div className="p-4 overflow-auto max-h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge variant={passedTests === totalTests ? "success" : "warning"}>
              {passedTests === totalTests ? <Check /> : <AlertTriangle />}
              {passedTests} / {totalTests} Tests Passed
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          {executionResult.testResults.map((test, index) => (
            <div key={index} className={`border rounded-md p-3 ${test.passed ? "border-success/30" : "border-error/30"}`}>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={test.passed ? "success" : "error"}>
                  {test.passed ? <Check /> : <X />}
                  Test Case {index + 1}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Input:</div>
                  <pre className="bg-muted/30 p-2 rounded text-xs overflow-auto">{test.input}</pre>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Expected Output:</div>
                  <pre className="bg-muted/30 p-2 rounded text-xs overflow-auto">{test.expectedOutput}</pre>
                </div>
              </div>

              {!test.passed && (
                <div className="mt-3">
                  <div className="text-xs text-muted-foreground mb-1">Your Output:</div>
                  <pre className="bg-muted/30 p-2 rounded text-xs overflow-auto">{test.actualOutput}</pre>
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col p-1">
        <TabsList className="w-full">
          <TabsTrigger value="output">Console Output</TabsTrigger>
          <TabsTrigger value="tests">
            Test Results
            {executionResult?.testResults && (
              <Badge variant={executionResult.allTestsPassed ? "success" : "error"} className="ml-2">
                {executionResult.testResults.filter((t) => t.passed).length}/{executionResult.testResults.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 border rounded-md overflow-auto">
          {isExecutingCode || isRunningTestCases ? (
            <SpinnerBox>Executing code, please wait...</SpinnerBox>
          ) : !executionResult ? (
            <EmptyState icon={<AlertTriangle />} title="No output to display" description="Run your code to see the output here." />
          ) : (
            <>
              {activeTab === "output" && renderConsoleOutput()}
              {activeTab === "tests" && renderTestResults()}
            </>
          )}
        </div>
      </Tabs>
    </div>
  );
}

export default EnhancedConsole;
