import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock, Trash2, Download, Clipboard, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "../ui/emptyState";
import { SpinnerBox } from "../ui/spinner";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { ResultStatusEnum } from "@/types/enums";

export function EnhancedConsole() {
  const isExecutingCode = useCodeEditorStore((state) => state.isExecutingCode);
  const executeCodeResult = useCodeEditorStore((state) => state.executeCodeResult);
  const runTestCasesResult = useCodeEditorStore((state) => state.runTestCasesResult);
  const isRunningTestCases = useCodeEditorStore((state) => state.isRunningTestCases);
  const clearExecutionResult = useCodeEditorStore((state) => state.clearExecutionResult);

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
    if (!executeCodeResult?.logs?.length) {
      return <EmptyState icon={<AlertTriangle />} title="No output to display" description="Run your code to see the output here." />;
    }

    return (
      <div className="font-mono text-sm p-4 overflow-auto h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge variant={executeCodeResult.status === ResultStatusEnum.SUCCESS ? "success" : executeCodeResult.status === ResultStatusEnum.FAILED ? "error" : "outline"} className="capitalize">
              {executeCodeResult.status === ResultStatusEnum.SUCCESS ? <Check /> : executeCodeResult.status === ResultStatusEnum.FAILED ? <X /> : <Clock />}
              {executeCodeResult.status}
            </Badge>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" size="icon-sm" title="Copy Output" onClick={() => copyToClipboard(executeCodeResult.logs.join("\n"))}>
              <Clipboard />
            </Button>
            <Button variant="ghost" size="icon-sm" title="Save Output" onClick={() => saveAsFile(executeCodeResult.logs.join("\n"), "txt")}>
              <Download />
            </Button>
            <Button variant="ghost" size="icon-sm" title="Clear Console" onClick={clearExecutionResult}>
              <Trash2 />
            </Button>
          </div>
        </div>

        <Separator className="my-2" />

        {executeCodeResult.error ? (
          <div className="text-error whitespace-pre-wrap overflow-x-auto">{executeCodeResult.error}</div>
        ) : (
          <div className="whitespace-pre-wrap overflow-x-auto">
            {executeCodeResult.logs.length > 0 ? executeCodeResult.logs.map((line, idx) => <div key={idx}>{line}</div>) : <div className="text-muted-foreground italic">No output generated</div>}
          </div>
        )}
      </div>
    );
  };

  const renderTestResults = () => {
    if (!runTestCasesResult?.testResults?.length) {
      return <EmptyState icon={<AlertTriangle />} title="No test results to display" description="Run your code to see the test results here." />;
    }

    const passedTests = runTestCasesResult.passedCount;
    const totalTests = runTestCasesResult.totalCount;

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
          {runTestCasesResult.testResults.map((test, index) => (
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
                  <pre className="bg-muted/30 p-2 rounded text-xs overflow-auto">{test.output}</pre>
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
            {runTestCasesResult?.passedCount && (
              <Badge variant={runTestCasesResult.status === ResultStatusEnum.SUCCESS ? "success" : "error"} className="ml-2">
                {runTestCasesResult.passedCount}/{runTestCasesResult.totalCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 border rounded-md overflow-auto">
          {isExecutingCode || isRunningTestCases ? (
            <SpinnerBox>Executing code, please wait...</SpinnerBox>
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
