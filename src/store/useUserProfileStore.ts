import { create } from "zustand";
import { useEffect } from "react";
import { useGetProfile, useGetStats } from "@/hooks/useProfile";
import { IGetProfileOutput, IGetStatsOutput, IUpdateAppearanceInput, IUpdateNotificationsInput, IUpdatePreferencesInput, IUpdatePrivacyInput, IUpdateProfileInput, IUser } from "@/types/profile";
import { noop } from "@/lib/utils";

interface IUserProfile {
  // Profile Data
  profile: IGetProfileOutput["profile"] | null;
  settings: IGetProfileOutput["settings"] | null;
  badges: IGetProfileOutput["badges"] | null;
  certificates: IGetProfileOutput["certificates"] | null;
  isLoadingGetProfile: boolean;
  isErrorGetProfile: boolean;
  errorGetProfile: Error | null;
  isSuccessGetProfile: boolean;

  // Stats Data
  difficultyStats: IGetStatsOutput["difficultyStats"] | null;
  activityStats: IGetStatsOutput["activityStats"] | null;
  skillStats: IGetStatsOutput["skillStats"] | null;
  languageStats: IGetStatsOutput["languageStats"] | null;
  isLoadingGetStats: boolean;
  isErrorGetStats: boolean;
  errorGetStats: Error | null;
  isSuccessGetStats: boolean;

  // Actions
  updateSettings: (settings: IGetProfileOutput["settings"]) => void;
  updateSettingsResult: IGetProfileOutput["settings"] | null;
  isLoadingUpdateSettings: boolean;
  isErrorUpdateSettings: boolean;
  errorUpdateSettings: Error | null;
  isSuccessUpdateSettings: boolean;

  // executeCodeResult: ICodeExecutionOutput | null;
  // executeCode: () => void;
  // isExecutingCode: boolean;
  // isSuccessExecutingCode: boolean;
  // isErrorExecutingCode: boolean;
  // errorExecutingCode: string | null;
  // clearExecutionResult: () => void;

  updateAppearance: (appearance: IUpdateAppearanceInput) => void;
  updateAppearanceResult: IGetProfileOutput["settings"]["appearance"] | null;
  isPendingUpdateAppearance: boolean;
  isErrorUpdateAppearance: boolean;
  errorUpdateAppearance: Error | null;
  isSuccessUpdateAppearance: boolean;

  updateNotifications: (notifications: IUpdateNotificationsInput) => void;
  updateNotificationsResult: IGetProfileOutput["settings"]["notifications"] | null;
  isPendingUpdateNotifications: boolean;
  isErrorUpdateNotifications: boolean;
  errorUpdateNotifications: Error | null;
  isSuccessUpdateNotifications: boolean;

  updatePreferences: (preferences: IUpdatePreferencesInput) => void;
  updatePreferencesResult: IGetProfileOutput["settings"]["preferences"] | null;
  isPendingUpdatePreferences: boolean;
  isErrorUpdatePreferences: boolean;
  errorUpdatePreferences: Error | null;
  isSuccessUpdatePreferences: boolean;

  updatePrivacy: (privacy: IUpdatePrivacyInput) => void;
  updatePrivacyResult: IGetProfileOutput["settings"]["privacy"] | null;
  isPendingUpdatePrivacy: boolean;
  isErrorUpdatePrivacy: boolean;
  errorUpdatePrivacy: Error | null;
  isSuccessUpdatePrivacy: boolean;

  updateProfile: (profile: IUpdateProfileInput) => void;
  updateProfileResult: IGetProfileOutput["profile"] | null;
  isPendingUpdateProfile: boolean;
  isErrorUpdateProfile: boolean;
  errorUpdateProfile: Error | null;
  isSuccessUpdateProfile: boolean;

  // rest
  isSaving: boolean;
}

// Create the store without implementing the functions yet
export const useUserProfileStore = create<IUserProfile>((set, get) => ({
  profile: null,
  settings: null,
  badges: null,
  certificates: null,
  isLoadingGetProfile: false,
  isErrorGetProfile: false,
  errorGetProfile: null,
  isSuccessGetProfile: false,

  difficultyStats: null,
  activityStats: null,
  skillStats: null,
  languageStats: null,
  isLoadingGetStats: false,
  isErrorGetStats: false,
  errorGetStats: null,
  isSuccessGetStats: false,

  updateSettings: noop,
  updateSettingsResult: null,
  isLoadingUpdateSettings: false,
  isErrorUpdateSettings: false,
  errorUpdateSettings: null,
  isSuccessUpdateSettings: false,

  updateAppearance: noop,
  updateAppearanceResult: null,
  isPendingUpdateAppearance: false,
  isErrorUpdateAppearance: false,
  errorUpdateAppearance: null,
  isSuccessUpdateAppearance: false,

  updateNotifications: noop,
  updateNotificationsResult: null,
  isPendingUpdateNotifications: false,
  isErrorUpdateNotifications: false,
  errorUpdateNotifications: null,
  isSuccessUpdateNotifications: false,

  updatePreferences: noop,
  updatePreferencesResult: null,
  isPendingUpdatePreferences: false,
  isErrorUpdatePreferences: false,
  errorUpdatePreferences: null,
  isSuccessUpdatePreferences: false,

  updatePrivacy: noop,
  updatePrivacyResult: null,
  isPendingUpdatePrivacy: false,
  isErrorUpdatePrivacy: false,
  errorUpdatePrivacy: null,
  isSuccessUpdatePrivacy: false,

  updateProfile: noop,
  updateProfileResult: null,
  isPendingUpdateProfile: false,
  isErrorUpdateProfile: false,
  errorUpdateProfile: null,
  isSuccessUpdateProfile: false,

  isSaving: false,
}));

// Hook to initialize the store with profile and stats data
export function useInitializeUserProfile() {
  const getProfileQuery = useGetProfile();
  const getStatsQuery = useGetStats();

  useEffect(() => {
    useUserProfileStore.setState({
      profile: getProfileQuery.data?.profile || null,
      settings: getProfileQuery.data?.settings || null,
      badges: getProfileQuery.data?.badges || null,
      certificates: getProfileQuery.data?.certificates || null,
      isLoadingGetProfile: getProfileQuery.isPending,
      isErrorGetProfile: getProfileQuery.isError,
      errorGetProfile: getProfileQuery.error || null,
      isSuccessGetProfile: getProfileQuery.isSuccess,
    });
  }, [getProfileQuery.data, getProfileQuery.isPending, getProfileQuery.isSuccess, getProfileQuery.isError, getProfileQuery.error]);

  useEffect(() => {
    useUserProfileStore.setState({
      difficultyStats: getStatsQuery.data?.difficultyStats || null,
      activityStats: getStatsQuery.data?.activityStats || null,
      skillStats: getStatsQuery.data?.skillStats || null,
      languageStats: getStatsQuery.data?.languageStats || null,
      isLoadingGetStats: getStatsQuery.isPending,
      isErrorGetStats: getStatsQuery.isError,
      errorGetStats: getStatsQuery.error || null,
      isSuccessGetStats: getStatsQuery.isSuccess,
    });
  }, [getStatsQuery.data, getStatsQuery.isPending, getStatsQuery.isSuccess, getStatsQuery.isError, getStatsQuery.error]);
}
