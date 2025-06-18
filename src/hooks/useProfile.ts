import { useQuery } from "@tanstack/react-query";
import { ExperienceLevelType, IActivityStat, IGetProfileOutput, IGetStatsOutput, ILanguageStat, ISkillStat, IUser } from "@/types/profile";
import { ProgrammingLanguageEnum } from "@/types/enums";
import { useAuth } from "@/contexts/AuthContext";

const MOCK_USER: IUser = {
  id: "user-1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  avatarUrl: "https://example.com/avatar.jpg",
  bio: "I'm a software engineer",
  createdAt: new Date(),
};

const MOCK_PROFILE_OUTPUT: IGetProfileOutput = {
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
    id: "profile-1",
    completedCollections: 10,
    completedProblems: 100,
    streak: 10,
    points: 1000,
    createdAt: new Date(),
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    avatarUrl: "https://yt3.googleusercontent.com/qGrcViAdsmfdL8NhR03s6jZVi2AP4A03XeBFShu2M4Jd88k1fNXDnpMEmHU6CvNJuMyA2z1maA0=s900-c-k-c0x00ffffff-no-rj",
    bio: "Software Engineer",
  },
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

export const useGetUser = () => {
  const { authenticated } = useAuth();

  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return MOCK_USER;
    },
    staleTime: 1000 * 60 * 300,
    enabled: authenticated,
  });
};

export const useGetProfile = () => {
  const { authenticated } = useAuth();

  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return MOCK_PROFILE_OUTPUT;
    },
    staleTime: 1000 * 60 * 300,
    enabled: authenticated,
  });
};

export const useGetStats = () => {
  const { authenticated } = useAuth();

  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return MOCK_STATS_OUTPUT;
    },
    staleTime: 1000 * 60 * 300,
    enabled: authenticated,
  });
};
