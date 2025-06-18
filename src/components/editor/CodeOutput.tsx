"use client";

import { Check, Clock, X, TerminalSquare, AlertTriangle, Cpu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ICodeExecutionOutput, IRunTestCasesOutput } from "@/types/testCases";

interface CodeOutputProps {
  result: ICodeExecutionOutput | null;
  isExecuting: boolean;
}

export function CodeOutput({ result, isExecuting }: CodeOutputProps) {
  if (isExecuting) {
    return (
      <Card className="border-yellow-500/20">
        <CardHeader className="py-3 bg-yellow-500/5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-yellow-500 flex items-center">
              <Clock className="h-4 w-4 mr-2 animate-pulse" />
              Executing code...
            </CardTitle>
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-200">
              Running
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-3 pb-3">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-2 py-1">
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="border-muted rounded-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TerminalSquare className="h-4 w-4" />
            Code Output
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-3 pb-3 text-muted-foreground text-sm">Run your code to see output.</CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-${result.status === "success" ? "green" : "destructive"}-500/20 rounded-none`}>
      <CardHeader className={`bg-${result.status === "success" ? "green" : "destructive"}-500/5`}>
        <div className="flex items-center justify-between">
          <CardTitle className={`text-${result.status === "success" ? "success" : "error"} flex items-center`}>
            {result.status === "success" ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Code executed successfully
              </>
            ) : (
              <>
                <X className="h-4 w-4 mr-2" />
                Execution failed
              </>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-3 pb-3">
        {result.logs.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-medium text-muted-foreground mb-1">Console Output:</div>
            <div className="bg-muted/30 p-3 rounded-md font-mono text-xs whitespace-pre-wrap overflow-auto max-h-40">
              {result.logs.map((line, i) => (
                <div key={i} className="whitespace-pre-line">
                  {line}
                </div>
              ))}
            </div>
          </div>
        )}

        {result.error && (
          <div className="mb-4">
            <div className="text-xs font-medium text-destructive mb-1 flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Error:
            </div>
            <div className="bg-destructive/10 text-destructive p-3 rounded-md font-mono text-xs whitespace-pre-wrap overflow-auto max-h-40">{result.error}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CodeOutput;
