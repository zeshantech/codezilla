"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Keycloak from "keycloak-js";
import { noop } from "@/lib/utils";
import { toast } from "sonner";

type AuthContextType = {
  keycloak: Keycloak | null;
  authenticated: boolean;
  token: string | undefined;
  loading: boolean;
  login: (redirectUri?: string) => void;
  logout: () => void;
};

const defaultValue: AuthContextType = {
  keycloak: null,
  authenticated: false,
  token: undefined,
  loading: true,
  login: noop,
  logout: noop,
};

const AuthContext = createContext<AuthContextType>(defaultValue);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const keycloak = new Keycloak({
          url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || "",
          realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "",
          clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "",
        });

        await keycloak.init({
          pkceMethod: "S256",
          silentCheckSsoRedirectUri: window.location.origin + "/public/silent-check-sso.html",
        });

        setKeycloak(keycloak);

        keycloak.onAuthSuccess = () => {
          console.log("onAuthSuccess");
        };

        keycloak.onAuthLogout = () => {
          console.log("onAuthLogout");
        };
      } catch (error) {
        toast.error("Failed to initialize Auth", {
          description: error instanceof Error ? error.message : "Unknown error",
        });
      }
    };

    if (typeof window !== "undefined") {
      initAuth();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        keycloak,
        authenticated: keycloak?.authenticated || false,
        token: keycloak?.token,
        loading: false,
        login: (redirectUri?: string) => keycloak?.login({ redirectUri }),
        logout: () => keycloak?.logout(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
