import { useQuery } from "@tanstack/react-query";
import { ExperienceLevelType, IActivityStat, IGetProfileOutput, IGetStatsOutput, ILanguageStat, ISkillStat } from "@/types/profile";
import { ProgrammingLanguageEnum } from "@/types/enums";
import { useUser } from "@auth0/nextjs-auth0";
import { User } from "@auth0/nextjs-auth0/types";

const GET_MOCK_PROFILE_OUTPUT = (user: User): IGetProfileOutput => {
  if (!user) {
    throw new Error("User not found");
  }

  return {
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
        imageUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRf0gaVwscBNGuFtdm04hhfeJP40--fGT-7wZmMHmmx4qJKCTFm",
        level: "bronze",
        createdAt: new Date(),
      },
      {
        id: "badge-2",
        name: "Streak Master",
        description: "Maintained a 5-day streak",
        imageUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRf0gaVwscBNGuFtdm04hhfeJP40--fGT-7wZmMHmmx4qJKCTFm",
        level: "silver",
        createdAt: new Date(),
      },
      {
        id: "badge-3",
        name: "JavaScript Guru",
        description: "Solved 5 problems in JavaScript",
        imageUrl: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRf0gaVwscBNGuFtdm04hhfeJP40--fGT-7wZmMHmmx4qJKCTFm",
        level: "bronze",
        createdAt: new Date(),
      },
    ],
    certificates: [
      {
        id: "cert-1",
        name: "Data Structures & Algorithms",
        description: "Completed the Data Structures & Algorithms course",
        imageUrl: "https://www.w3schools.com/dsa/img_cert_dsa.jpg",
        credentialId: "DSA-123456",
        credentialUrl: "https://example.com/certificates/DSA-123456",
        createdAt: new Date(),
      },
    ],
    profile: {
      id: crypto.randomUUID(),
      auth0Id: user.sub,
      completedCollections: 10,
      completedProblems: 100,
      streak: 10,
      points: 1000,
      createdAt: new Date(),
      firstName: user.given_name || "",
      lastName: user.family_name || "",
      email: user.email || "",
      avatarUrl: user.picture || "",
      bio: "Software Engineer",
    },
  };
};

const generateActivityStats = (): IActivityStat[] => {
  return Array.from({ length: 10 }, (_, i) => ({
    week: `Week ${i + 1}`,
    problemsSolved: Math.floor(Math.random() * 5),
    submissions: Math.floor(Math.random() * 10) + 5,
    from: new Date(new Date().setDate(new Date().getDate() - 7 * (i + 1))),
    to: new Date(new Date().setDate(new Date().getDate() - 7 * i)),
  }));
};

const generateSkillStats = (): ISkillStat[] => {
  return Array.from({ length: 10 }, (_, i) => ({
    categoryId: `category-${i + 1}`,
    categoryName: `Category ${i + 1}`,
    problemsSolved: Math.floor(Math.random() * 10),
    totalProblems: 100,
    percentage: Math.floor(Math.random() * 100),
  }));
};

const generateLanguageStats = (): ILanguageStat[] => {
  return Array.from({ length: 4 }, (_, i) => ({
    language: Object.values(ProgrammingLanguageEnum)[i] as ProgrammingLanguageEnum,
    problemsSolved: Math.floor(Math.random() * 10),
    percentage: Math.floor(Math.random() * 100),
    experienceLevel: ["beginner", "intermediate", "advanced", "expert"][Math.floor(Math.random() * 4)] as ExperienceLevelType,
  }));
};

const MOCK_STATS_OUTPUT: IGetStatsOutput = {
  difficultyStats: {
    easy: {
      percentage: 10,
      solved: 10,
      total: 100,
    },
    medium: {
      percentage: 20,
      solved: 20,
      total: 100,
    },
    hard: {
      percentage: 30,
      solved: 30,
      total: 100,
    },
  },
  activityStats: generateActivityStats(),
  skillStats: generateSkillStats(),
  languageStats: generateLanguageStats(),
};

export const useGetProfile = () => {
  const { user } = useUser();

  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return GET_MOCK_PROFILE_OUTPUT(user!);
    },
    staleTime: 1000 * 60 * 300,
    enabled: !!user,
  });
};

export const useGetStats = () => {
  const { user } = useUser();

  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return MOCK_STATS_OUTPUT;
    },
    staleTime: 1000 * 60 * 300,
    enabled: !!user,
  });
};
