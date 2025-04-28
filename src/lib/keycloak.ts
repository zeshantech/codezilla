import Keycloak, { IProfile } from "keycloak-js";

let keycloakInstance: Keycloak | null = null;

export const initKeycloak = (): Keycloak => {
  if (keycloakInstance) return keycloakInstance;

  keycloakInstance = new Keycloak({
    url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || "",
    realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "",
    clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "",
  });

  return keycloakInstance;
};

export const getKeycloakInstance = (): Keycloak | null => {
  return keycloakInstance;
};

export const logout = () => {
  keycloakInstance?.logout();
};

export const login = (redirectUri?: string) => {
  keycloakInstance?.login({
    redirectUri: redirectUri ?? window.location.origin,
  });
};

export const getToken = (): string | undefined => {
  return keycloakInstance?.token;
};

export const isAuthenticated = (): boolean => {
  return !!keycloakInstance?.authenticated;
};

export const getProfile = async (): Promise<IProfile | undefined> => {
  try {
    if (!keycloakInstance?.authenticated) {
      return undefined;
    }
    return (await keycloakInstance.loadUserProfile()) as unknown as IProfile;
  } catch (error) {
    console.error("Failed to load user profile:", error);
    return undefined;
  }
};
