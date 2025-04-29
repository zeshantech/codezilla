"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { EditorLayoutProvider } from "@/providers/EditorLayoutProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";

const queryClient = new QueryClient();

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <Toaster richColors />
          <EditorLayoutProvider>{children}</EditorLayoutProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
