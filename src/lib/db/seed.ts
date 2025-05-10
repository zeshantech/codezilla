import dbConnect from "./connection";
import { User } from "./models/user.model";
import { Problem } from "./models/problem.model";
import { Collection } from "./models/collection.model";
import { PROBLEMS } from "@/data/mock/problems";
import { COLLECTIONS } from "@/data/mock/collections";
import { CURRENT_USER } from "@/data/mock/users";

/**
 * Seed the database with initial data
 */
export async function seedDatabase() {
  console.log("🌱 Seeding database...");

  await dbConnect();

  // Check if database is already seeded
  const problemCount = await Problem.countDocuments();
  const userCount = await User.countDocuments();
  const collectionCount = await Collection.countDocuments();

  if (problemCount > 0 && userCount > 0 && collectionCount > 0) {
    console.log("Database already seeded. Skipping.");
    return;
  }

  try {
    // Clear existing data
    await Problem.deleteMany({});
    await User.deleteMany({});
    await Collection.deleteMany({});

    console.log("Existing data cleared.");

    // Seed problems
    const problemDocs = PROBLEMS.map((problem) => {
      // Convert starter code and solutions to Maps
      const starterCodeMap = new Map();
      const solutionMap = new Map();

      if (problem.starterCode) {
        Object.entries(problem.starterCode).forEach(([lang, code]) => {
          starterCodeMap.set(lang, code);
        });
      }

      if (problem.solution) {
        Object.entries(problem.solution).forEach(([lang, code]) => {
          solutionMap.set(lang, code);
        });
      }

      return {
        ...problem,
        starterCode: starterCodeMap,
        solution: solutionMap,
      };
    });

    const insertedProblems = await Problem.insertMany(problemDocs);
    console.log(`${insertedProblems.length} problems seeded.`);

    // Seed user
    // Convert problemsProgress to a Map
    const progressMap = new Map();

    Object.entries(CURRENT_USER.problemsProgress).forEach(
      ([problemId, progress]) => {
        // Convert code to Map if exists
        if (progress.code) {
          const codeMap = new Map();
          Object.entries(progress.code).forEach(([lang, code]) => {
            codeMap.set(lang, code);
          });
          progress.code = codeMap as any;
        }

        progressMap.set(problemId, progress);
      }
    );

    const newUser = new User({
      ...CURRENT_USER,
      problemsProgress: progressMap,
    });

    await newUser.save();
    console.log("User seeded.");

    // Seed collections
    const collectionDocs = COLLECTIONS.map((collection) => ({
      ...collection,
      // Use the IDs of the inserted problems
      problemIds: collection.problems,
    }));

    const insertedCollections = await Collection.insertMany(collectionDocs);
    console.log(`${insertedCollections.length} collections seeded.`);

    console.log("🌱 Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

export default seedDatabase;
