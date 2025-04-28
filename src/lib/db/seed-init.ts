import seedDatabase from "./seed";

// Run the seeding process immediately
// This will be imported once during app startup
export async function initializeDatabase() {
  try {
    // Only seed in development mode
    if (process.env.NODE_ENV === "development") {
      await seedDatabase();
    }
  } catch (error) {
    console.error("Failed to seed database:", error);
  }
}

// Export a flag to check if seeding has already been attempted
let seedingAttempted = false;

export { seedingAttempted };
