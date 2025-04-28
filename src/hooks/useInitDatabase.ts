import { useEffect } from "react";

/**
 * Hook to initialize database on client side
 *
 * This is mainly used to ensure database initialization runs once
 * when the app starts on the client side
 */
export function useInitDatabase() {
  useEffect(() => {
    // This code only runs on the client
    const initDB = async () => {
      try {
        // Dynamically import to avoid server-side execution issues
        const { default: dbInit } = await import("@/lib/db/init");
        await dbInit();
      } catch (error) {
        console.error("Failed to initialize database:", error);
      }
    };

    // Only run in development mode
    if (process.env.NODE_ENV === "development") {
      initDB();
    }
  }, []);
}

export default useInitDatabase;
