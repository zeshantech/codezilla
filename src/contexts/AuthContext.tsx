import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Keycloak, { KeycloakProfile } from "keycloak-js";
import { initKeycloak, login, logout, getProfile } from "@/lib/keycloak";
import { noop } from "@/lib/utils";

type AuthContextType = {
  keycloak: Keycloak | null;
  authenticated: boolean;
  token: string | undefined;
  profile: KeycloakProfile | undefined;
  loading: boolean;
  login: (redirectUri?: string) => void;
  logout: () => void;
};

const defaultValue: AuthContextType = {
  keycloak: null,
  authenticated: false,
  token: undefined,
  profile: undefined,
  loading: true,
  login: noop,
  logout,
};

const AuthContext = createContext<AuthContextType>(defaultValue);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [profile, setProfile] = useState<KeycloakProfile | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      if (authenticated && keycloak) {
        const userProfile = await getProfile();
        setProfile(userProfile);
      } else {
        setProfile(undefined);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setProfile(undefined);
    }
  };

  // Refresh profile when authentication state changes
  useEffect(() => {
    if (!loading) {
      fetchUserProfile();
    }
  }, [authenticated, loading]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const keycloak = initKeycloak();

        await keycloak.init({
          onLoad: "check-sso",
          silentCheckSsoRedirectUri:
            window.location.origin + "/silent-check-sso.html",
          checkLoginIframe: false,
        });

        setKeycloak(keycloak);
        setAuthenticated(keycloak.authenticated || false);
        setToken(keycloak.token);

        keycloak.onTokenExpired = () => {
          keycloak
            .updateToken(30)
            .then((refreshed) => {
              if (refreshed) {
                setToken(keycloak.token);
              }
            })
            .catch(() => {
              logout();
            });
        };

        // Add event listeners for auth state changes
        keycloak.onAuthSuccess = () => {
          setAuthenticated(true);
          setToken(keycloak.token);
        };

        keycloak.onAuthLogout = () => {
          setAuthenticated(false);
          setToken(undefined);
          setProfile(undefined);
        };
      } catch (error) {
        console.error("Failed to initialize Keycloak", error);
      } finally {
        setLoading(false);
      }
    };

    // Only initialize in browser environment
    if (typeof window !== "undefined") {
      initAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const value = {
    keycloak,
    authenticated,
    token,
    profile,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
