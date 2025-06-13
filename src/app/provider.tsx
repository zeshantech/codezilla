"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { EditorLayoutProvider } from "@/providers/EditorLayoutProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import Keycloak from "keycloak-js";

const queryClient = new QueryClient();

const keycloak = new Keycloak({
  url: "http://localhost:8080",
  realm: "techyst",
  clientId: "codezilla",
});

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <EditorLayoutProvider>{children}</EditorLayoutProvider>
        </AuthProvider>
        <Toaster richColors />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
