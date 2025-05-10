import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CURRENT_USER } from "@/data/mock/users";
import { PROBLEMS } from "@/data/mock/problems";
import { CATEGORIES } from "@/data/mock/categories";
import { toast } from "sonner";
import {
  UserProfile,
  UserProfileSettings,
  SkillStat,
  ProblemsByCategory,
  ProblemStatusCount,
  ActivityRecord,
} from "@/types/profile";
import { ICategory, IProblem, ProgrammingLanguageEnum } from "@/types";

// Mock data for user profile
const MOCK_PROFILE = {
  ...CURRENT_USER,
  settings: {
    notifications: {
      email: true,
      browser: true,
      mobile: false,
    },
    appearance: {
      theme: "system",
      codeFont: "Fira Code",
      fontSize: 14,
    },
    preferences: {
      defaultLanguage: ProgrammingLanguageEnum.JAVASCRIPT,
      defaultTabSize: 2,
      autosave: true,
    },
    privacy: {
      showActivity: true,
      showSolutions: false,
      showProfile: true,
    },
  },
  badges: [
    {
      id: "badge-1",
      name: "Problem Solver",
      description: "Solved 10 problems",
      imageUrl:
        "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRf0gaVwscBNGuFtdm04hhfeJP40--fGT-7wZmMHmmx4qJKCTFm",
      earnedAt: "2023-02-15T00:00:00Z",
      level: "bronze",
    },
    {
      id: "badge-2",
      name: "Streak Master",
      description: "Maintained a 5-day streak",
      imageUrl:
        "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRf0gaVwscBNGuFtdm04hhfeJP40--fGT-7wZmMHmmx4qJKCTFm",
      earnedAt: "2023-03-10T00:00:00Z",
      level: "silver",
    },
    {
      id: "badge-3",
      name: "JavaScript Guru",
      description: "Solved 5 problems in JavaScript",
      imageUrl:
        "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRf0gaVwscBNGuFtdm04hhfeJP40--fGT-7wZmMHmmx4qJKCTFm",
      earnedAt: "2023-02-20T00:00:00Z",
      level: "bronze",
    },
  ],
  certificates: [
    {
      id: "cert-1",
      name: "Data Structures & Algorithms",
      description: "Completed the Data Structures & Algorithms course",
      imageUrl: "https://www.w3schools.com/dsa/img_cert_dsa.jpg",
      earnedAt: "2023-04-10T00:00:00Z",
      credentialId: "DSA-123456",
      credentialUrl: "https://example.com/certificates/DSA-123456",
    },
  ],
  languageStats: {
    javascript: {
      language:ProgrammingLanguageEnum.JAVASCRIPT,
      problemsSolved: 8,
      percentage: 70,
      experienceLevel: "Intermediate",
    },
    python: {
      language: ProgrammingLanguageEnum.PYTHON,
      problemsSolved: 3,
      percentage: 20,
      experienceLevel: "Beginner",
    },
    java: {
      language:ProgrammingLanguageEnum.JAVA,
      problemsSolved: 1,
      percentage: 5,
      experienceLevel: "Beginner",
    },
    cpp: {
      language: ProgrammingLanguageEnum.CPP,
      problemsSolved: 0,
      percentage: 0,
      experienceLevel: "Beginner",
    },
  },
  activityHistory: generateYearOfActivityData(),
};

// Generate a year of activity data
function generateYearOfActivityData(): ActivityRecord[] {
  const activityData: ActivityRecord[] = [];
  const today = new Date();

  // Generate data for the past 365 days
  for (let i = 0; i < 365; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);

    // Generate random activity data with some patterns
    let problemsSolved = 0;
    let submissions = 0;

    // Higher activity on weekends
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    // Create streaks and patterns
    const randomFactor = Math.random();

    if (randomFactor > 0.6 || isWeekend) {
      // Active day
      problemsSolved = Math.floor(Math.random() * 3) + (isWeekend ? 1 : 0);
      submissions = problemsSolved + Math.floor(Math.random() * 3);
    } else if (randomFactor > 0.3) {
      // Light activity day
      problemsSolved = Math.floor(Math.random() * 2);
      submissions = problemsSolved + Math.floor(Math.random() * 2);
    }

    // Add some streaks (consecutive days with activity)
    if (i % 7 < 5 && i < 30) {
      // Recent streak
      problemsSolved = Math.max(1, problemsSolved);
      submissions = Math.max(problemsSolved + 1, submissions);
    }

    // Create some hot periods (more intense activity)
    if ((i > 40 && i < 60) || (i > 150 && i < 160) || (i > 250 && i < 260)) {
      problemsSolved = Math.floor(Math.random() * 4) + 1;
      submissions = problemsSolved + Math.floor(Math.random() * 4) + 1;
    }

    activityData.push({
      date: date.toISOString().split("T")[0],
      problemsSolved,
      submissions,
    });
  }

  return activityData;
}

// API simulation functions

// Fetch user profile
const fetchUserProfile = async (): Promise<UserProfile> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_PROFILE as any;
};

// Update user profile
const updateUserProfile = async (_: Partial<UserProfile>): Promise<boolean> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  // In a real app, this would call an API endpoint to update the user profile
  return true;
};

// Update user settings
const updateUserSettings = async (
  _: Partial<UserProfileSettings>
): Promise<boolean> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));
  // In a real app, this would call an API endpoint to update settings
  return true;
};

// Calculate skills stats based on categories and problems
const calculateSkillStats = (
  problems: IProblem[],
  categories: ICategory[],
  userProgress: any // TODO: UserProfile["problemsProgress"]
): SkillStat[] => {
  const stats: SkillStat[] = [];

  categories.forEach((category) => {
    const categoryProblems = problems.filter(
      (p) => p.category === category.name
    );
    const solvedProblems = categoryProblems.filter(
      (p) => userProgress[p.id]?.status === "solved"
    ).length;

    stats.push({
      categoryId: category.id,
      categoryName: category.name,
      problemsSolved: solvedProblems,
      totalProblems: categoryProblems.length,
      percentage:
        categoryProblems.length > 0
          ? Math.round((solvedProblems / categoryProblems.length) * 100)
          : 0,
    });
  });

  // Sort by percentage in descending order
  return stats.sort((a, b) => b.percentage - a.percentage);
};

// Get problems grouped by category with status counts
const getProblemsByCategory = (
  problems: IProblem[],
  categories: ICategory[],
  userProgress: any // TODO: UserProfile["problemsProgress"]
): ProblemsByCategory[] => {
  return categories.map((category) => {
    const categoryProblems = problems.filter(
      (p) => p.category === category.name
    );

    // Count problems by status
    const statusCount: ProblemStatusCount = {
      solved: 0,
      attempted: 0,
      notStarted: 0,
      total: categoryProblems.length,
    };

    categoryProblems.forEach((problem) => {
      const progress = userProgress[problem.id];
      if (!progress) {
        statusCount.notStarted++;
      } else if (progress.status === "solved") {
        statusCount.solved++;
      } else {
        statusCount.attempted++;
      }
    });

    return {
      categoryId: category.id,
      categoryName: category.name,
      problems: categoryProblems,
      problemStatusCount: statusCount,
    };
  });
};

export function useProfile() {
  const queryClient = useQueryClient();

  // Fetch user profile
  const useUserProfile = () => {
    return useQuery({
      queryKey: ["profile"],
      queryFn: fetchUserProfile,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  // Update user profile
  const useUpdateProfile = () => {
    return useMutation({
      mutationFn: updateUserProfile,
      onSuccess: () => {
        // Invalidate profile query to refetch updated data
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        toast.success("Profile updated successfully!");
      },
      onError: () => {
        toast.error("Failed to update profile");
      },
    });
  };

  // Update user settings
  const useUpdateSettings = () => {
    return useMutation({
      mutationFn: updateUserSettings,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["profile"] });
        toast.success("Settings updated successfully!");
      },
      onError: () => {
        toast.error("Failed to update settings");
      },
    });
  };

  // Get skill stats
  const getSkillStats = useCallback((limit?: number) => {
    const stats = calculateSkillStats(
      PROBLEMS,
      CATEGORIES,
      MOCK_PROFILE.badges
    );
    return limit ? stats.slice(0, limit) : stats;
  }, []);

  // Get problems by category with status
  const getProblemsByCategoryWithStatus = useCallback(() => {
    return getProblemsByCategory(PROBLEMS, CATEGORIES, MOCK_PROFILE.badges);
  }, []);

  // Get activity history for the last N days
  const getActivityHistory = useCallback((days: number = 30) => {
    // Get the requested number of days, but return them in reverse order (newest first)
    // so that newer dates appear first in charts and displays
    return [...MOCK_PROFILE.activityHistory]
      .slice(0, days)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, []);

  // Get language statistics
  const getLanguageStats = useCallback(() => {
    return MOCK_PROFILE.languageStats;
  }, []);

  // Get badges
  const getBadges = useCallback(() => {
    return MOCK_PROFILE.badges;
  }, []);

  // Get certificates
  const getCertificates = useCallback(() => {
    return MOCK_PROFILE.certificates;
  }, []);

  const profileQuery = useUserProfile();
  const updateProfileMutation = useUpdateProfile();
  const updateSettingsMutation = useUpdateSettings();

  return {
    useUserProfile,
    useUpdateProfile,
    useUpdateSettings,

    profile: profileQuery.data,
    isProfileLoading: profileQuery.isLoading,
    isProfileError: profileQuery.isError,

    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,

    updateSettings: updateSettingsMutation.mutateAsync,
    isUpdatingSettings: updateSettingsMutation.isPending,

    getSkillStats,
    getProblemsByCategoryWithStatus,
    getActivityHistory,
    getLanguageStats,
    getBadges,
    getCertificates,
  };
}

export default useProfile;
