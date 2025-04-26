"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { EditorLayoutProvider } from "@/providers/EditorLayoutProvider";

const queryClient = new QueryClient();

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <EditorLayoutProvider>{children}</EditorLayoutProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
