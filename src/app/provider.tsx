"use client";

import { ThemeProvider } from "next-themes";
import { EditorLayoutProvider } from "@/providers/EditorLayoutProvider";
import { Toaster } from "@/components/ui/sonner";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import { useInitializeUserProfile } from "@/store/useUserProfileStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <InitializeUserProfile />
        <EditorLayoutProvider>
          <AppHeader />
          {children}
          <AppFooter />
        </EditorLayoutProvider>
        <Toaster richColors />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

function InitializeUserProfile() {
  useInitializeUserProfile();

  return null;
}
