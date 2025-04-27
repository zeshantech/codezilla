import { useAuth } from "@/contexts/AuthContext";

export const useAuthenticatedFetch = () => {
  const { token } = useAuth();

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    if (!token) {
      throw new Error("No authentication token available");
    }

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "An error occurred during the API request");
    }

    return response.json();
  };

  return { fetchWithAuth };
};
