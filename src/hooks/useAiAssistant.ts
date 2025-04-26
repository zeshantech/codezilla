import { useState, useCallback } from "react";
import { ProgrammingLanguage, Problem } from "@/types";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

interface AiAssistantState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

// Mock implementation for the AI assistant
export function useAiAssistant(problem?: Problem | null) {
  const [state, setState] = useState<AiAssistantState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  // Initialize the chat with context about the problem
  const initializeChat = useCallback(() => {
    if (!problem) return;

    const systemMessage: Message = {
      id: "system-1",
      role: "system",
      content: `You are an AI programming assistant helping with the problem: "${problem.title}". 
      The problem description is: "${problem.description}". 
      You should provide hints, explanations, and guidance without directly solving the entire problem for the user.`,
      timestamp: new Date().toISOString(),
    };

    setState({
      messages: [systemMessage],
      isLoading: false,
      error: null,
    });
  }, [problem]);

  // Send a message to the AI assistant
  const sendMessage = useCallback(
    async (content: string, code?: string, language?: ProgrammingLanguage) => {
      // Create the user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: code
          ? `${content}\n\nHere is my code in ${
              language || "JavaScript"
            }:\n\`\`\`\n${code}\n\`\`\``
          : content,
        timestamp: new Date().toISOString(),
      };

      // Update state with the user message and set loading to true
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        isLoading: true,
        error: null,
      }));

      try {
        // In a real implementation, this would call an AI API
        // For now, we'll use a mock implementation with some predefined responses

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        let responseContent = "";

        // Very simple mock responses based on keywords in the message
        if (content.toLowerCase().includes("hint")) {
          responseContent =
            "Try breaking down the problem into smaller steps. Consider the edge cases in your solution.";
        } else if (content.toLowerCase().includes("error")) {
          responseContent =
            "Check your syntax and make sure all variables are properly defined before use. Look for missing brackets or semicolons.";
        } else if (content.toLowerCase().includes("optimize")) {
          responseContent =
            "You might improve performance by using a more efficient data structure. Consider using a hash map to reduce the time complexity.";
        } else if (content.toLowerCase().includes("test")) {
          responseContent =
            "Try testing your code with different inputs, including edge cases like empty arrays, very large numbers, or negative values.";
        } else if (code) {
          responseContent =
            "I've reviewed your code. Consider handling edge cases better and adding more comments to explain your approach.";
        } else {
          responseContent =
            "I'm here to help! What specific aspect of the problem are you struggling with?";
        }

        // Create the assistant message
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: responseContent,
          timestamp: new Date().toISOString(),
        };

        // Update state with the assistant message and set loading to false
        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, assistantMessage],
          isLoading: false,
        }));

        return assistantMessage;
      } catch (error) {
        // Handle errors
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Failed to get response from AI. Please try again.",
        }));
        return null;
      }
    },
    []
  );

  // Clear the chat history
  const clearChat = useCallback(() => {
    setState({
      messages: [],
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    initializeChat,
    sendMessage,
    clearChat,
  };
}

export default useAiAssistant;
