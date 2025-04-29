import dbConnect from "../db/connection";
import { User } from "../db/models/user.model";
import { IUser, IUserProfileUpdate, IUserProblemProgress } from "@/types";

// Fetch current user
export async function fetchCurrentUser(userId: string): Promise<IUser | null> {
  await dbConnect();

  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

// Update user profile
export async function updateUserProfile(userId: string, profileUpdate: IUserProfileUpdate): Promise<IUser | null> {
  await dbConnect();

  try {
    const user = await User.findByIdAndUpdate(userId, { ...profileUpdate }, { new: true, runValidators: true });

    return user;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return null;
  }
}

// Get user's problem progress
export async function getUserProblemProgress(userId: string, problemId: string): Promise<IUserProblemProgress | null> {
  await dbConnect();

  try {
    const user = await User.findById(userId);
    if (!user) return null;

    const progress = user.problemsProgress.get(problemId);
    return progress || null;
  } catch (error) {
    console.error("Error fetching user problem progress:", error);
    return null;
  }
}

// Update user's problem progress
export async function updateUserProblemProgress(userId: string, problemId: string, progress: Partial<IUserProblemProgress>): Promise<boolean> {
  await dbConnect();

  try {
    const user = await User.findById(userId);
    if (!user) return false;

    // Get current progress or create new one
    const currentProgress = user.problemsProgress.get(problemId) || {
      problemId,
      status: "not_started",
      submissions: 0,
    };

    // Update with new values
    const updatedProgress = {
      ...currentProgress,
      ...progress,
      // Always update lastSubmissionDate if submissions change
      lastSubmissionDate: progress.submissions !== currentProgress.submissions ? new Date().toISOString() : currentProgress.lastSubmissionDate || new Date().toISOString(),
    };

    // Set the updated progress
    user.problemsProgress.set(problemId, updatedProgress);

    // If problem is solved, increment completedProblems count if not already counted
    if (progress.status === "solved" && currentProgress.status !== "solved") {
      user.completedProblems += 1;
    }

    await user.save();
    return true;
  } catch (error) {
    console.error("Error updating user problem progress:", error);
    return false;
  }
}

// Create a new user (for auth sign up)
export async function createUser(userData: Omit<IUser, "id">): Promise<IUser> {
  await dbConnect();

  const newUser = new User({
    ...userData,
    problemsProgress: new Map(),
    completedProblems: 0,
    completedCollections: 0,
    createdProblems: 0,
    createdCollections: 0,
    streak: 0,
    points: 0,
    joinedDate: new Date().toISOString(),
  });

  await newUser.save();
  return newUser;
}
