import dbConnect from "./connection";
import { initializeDatabase } from "./seed-init";

// Initialize the database connection and seeding
export async function initDB() {
  // Establish connection
  await dbConnect();

  // Seed the database if needed
  await initializeDatabase();

  console.log("Database initialized successfully");
}

export default initDB;
