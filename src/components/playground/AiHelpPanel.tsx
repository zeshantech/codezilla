import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Send, RefreshCw, Trash2, Copy, Bot, User, Code } from "lucide-react";
import { useAiAssistant } from "@/hooks/useAiAssistant";
import { Problem, ProgrammingLanguage } from "@/types";
import { toast } from "sonner";

interface AiHelpPanelProps {
  problem?: Problem | null;
  code?: string;
  language?: ProgrammingLanguage;
}

export function AiHelpPanel({ problem, code, language }: AiHelpPanelProps) {
  const { messages, isLoading, error, initializeChat, sendMessage, clearChat } =
    useAiAssistant(problem);

  const [prompt, setPrompt] = useState("");
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize the chat when problem changes
  useEffect(() => {
    initializeChat();
  }, [problem, initializeChat]);

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async () => {
    if (prompt.trim()) {
      await sendMessage(prompt.trim(), code, language);
      setPrompt("");
      // Focus the textarea again
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  // Handle Enter key to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Copy code snippet to clipboard
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

  // Simple markdown-like processing for code blocks
  const renderMessageContent = (content: string) => {
    return (
      <div className="whitespace-pre-wrap">
        {content.split("```").map((part, index) => {
          // Every odd index is a code block
          if (index % 2 === 1) {
            return (
              <div key={index} className="relative group my-2">
                <pre className="bg-muted/50 p-2 rounded-md overflow-x-auto">
                  <code className="text-xs">{part.trim()}</code>
                </pre>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => copyToClipboard(part.trim())}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            );
          }

          // Replace inline code
          const inlineCodeRegex = /`([^`]+)`/g;
          const textWithInlineCode = part.split(inlineCodeRegex);

          return (
            <span key={index}>
              {textWithInlineCode.map((text, i) => {
                // Every odd index is inline code
                if (i % 2 === 1) {
                  return (
                    <code key={i} className="bg-muted/50 px-1 py-0.5 rounded">
                      {text}
                    </code>
                  );
                }
                return <span key={i}>{text}</span>;
              })}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-2 border-b">
        <h3 className="text-sm font-medium">AI Assistant</h3>
        <Button
          variant="ghost"
          size="icon"
          title="Clear conversation"
          onClick={clearChat}
        >
          <Trash2 />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <Bot className="h-8 w-8 text-muted-foreground mb-3" />
              <h3 className="text-md font-medium mb-1">
                AI Programming Assistant
              </h3>
              <p className="text-sm text-muted-foreground max-w-64">
                Ask questions about the problem or get help with your code
              </p>
            </div>
          ) : (
            messages
              .filter((msg) => msg.role !== "system")
              .map((message) => (
                <div key={message.id} className="flex gap-3">
                  <div className="shrink-0 mt-0.5">
                    {message.role === "user" ? (
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-1">
                      {message.role === "user" ? "You" : "AI Assistant"}
                    </div>
                    <div className="text-sm prose prose-sm dark:prose-invert max-w-full">
                      {renderMessageContent(message.content)}
                    </div>
                  </div>
                </div>
              ))
          )}
          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
              {error}
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={initializeChat}
              >
                Retry
              </Button>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>
      </ScrollArea>

      <Separator />

      <div className="p-3">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about the problem or your code..."
            className="min-h-[80px] pr-10"
            disabled={isLoading}
          />
          <div className="absolute bottom-2 right-2">
            <Button
              size="icon"
              type="submit"
              disabled={isLoading || !prompt.trim()}
              onClick={handleSendMessage}
              className="h-8 w-8"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Shift + Enter for new line</span>
          {code && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs gap-1"
              onClick={() =>
                sendMessage(
                  "Help me understand and improve this code",
                  code,
                  language
                )
              }
            >
              <Code className="h-3 w-3" />
              Get help with my code
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AiHelpPanel;
