"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Selector } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckIcon, SaveIcon } from "lucide-react";
import { useUserProfileStore } from "@/store/useUserProfileStore";
import { IUpdateAppearanceInput, IUpdateNotificationsInput, IUpdatePreferencesInput, IUpdatePrivacyInput, IUpdateProfileInput } from "@/types/profile";
import { ProgrammingLanguageEnum } from "@/types/enums";

// Profile form schema
const profileFormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  bio: z.string().optional(),
  avatarUrl: z.string().optional(),
});

// Appearance form schema
const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  codeFont: z.string(),
  fontSize: z.coerce.number().min(12).max(24),
});

// Preferences form schema
const preferencesFormSchema = z.object({
  defaultLanguage: z.nativeEnum(ProgrammingLanguageEnum),
  defaultTabSize: z.coerce.number().min(2).max(8),
  autosave: z.boolean(),
});

// Notifications form schema
const notificationsFormSchema = z.object({
  email: z.boolean(),
  browser: z.boolean(),
  mobile: z.boolean(),
});

// Privacy form schema
const privacyFormSchema = z.object({
  showActivity: z.boolean(),
  showSolutions: z.boolean(),
  showProfile: z.boolean(),
});

export function ProfileSettings() {
  const [activeTab, setActiveTab] = useState("profile");

  const profile = useUserProfileStore((state) => state.profile);
  const settings = useUserProfileStore((state) => state.settings);
  const updateAppearance = useUserProfileStore((state) => state.updateAppearance);
  const updatePreferences = useUserProfileStore((state) => state.updatePreferences);
  const updateProfile = useUserProfileStore((state) => state.updateProfile);
  const updateNotifications = useUserProfileStore((state) => state.updateNotifications);
  const updatePrivacy = useUserProfileStore((state) => state.updatePrivacy);
  const isSuccessUpdatePrivacy = useUserProfileStore((state) => state.isSuccessUpdatePrivacy);
  const isSaving = useUserProfileStore((state) => state.isSaving);

  const profileForm = useForm<IUpdateProfileInput>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      bio: profile?.bio ?? "",
      avatarUrl: profile?.avatarUrl ?? "",
    },
  });

  const appearanceForm = useForm<IUpdateAppearanceInput>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme: settings?.appearance.theme ?? "light",
      codeFont: settings?.appearance.codeFont ?? "Fira Code",
      fontSize: settings?.appearance.fontSize ?? 14,
    },
  });

  const preferencesForm = useForm<IUpdatePreferencesInput>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: {
      defaultLanguage: settings?.preferences.defaultLanguage ?? ProgrammingLanguageEnum.JAVASCRIPT,
      defaultTabSize: settings?.preferences.defaultTabSize ?? 2,
      autosave: settings?.preferences.autosave ?? false,
    },
  });

  const notificationsForm = useForm<IUpdateNotificationsInput>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      email: settings?.notifications.email ?? false,
      browser: settings?.notifications.browser ?? false,
      mobile: settings?.notifications.mobile ?? false,
    },
  });

  const privacyForm = useForm<IUpdatePrivacyInput>({
    resolver: zodResolver(privacyFormSchema),
    defaultValues: {
      showActivity: settings?.privacy.showActivity ?? false,
      showSolutions: settings?.privacy.showSolutions ?? false,
      showProfile: settings?.privacy.showProfile ?? false,
    },
  });

  // Submit handlers for each form
  const onProfileSubmit = async (data: IUpdateProfileInput) => {
    try {
      await updateProfile(data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const onAppearanceSubmit = async (data: IUpdateAppearanceInput) => {
    try {
      await updateAppearance(data);
    } catch (error) {
      console.error("Error updating appearance settings:", error);
    }
  };

  const onPreferencesSubmit = async (data: IUpdatePreferencesInput) => {
    try {
      await updatePreferences(data);
    } catch (error) {
      console.error("Error updating preferences:", error);
    }
  };

  const onNotificationsSubmit = async (data: IUpdateNotificationsInput) => {
    try {
      await updateNotifications(data);
    } catch (error) {
      console.error("Error updating notification settings:", error);
    }
  };

  const onPrivacySubmit = async (data: IUpdatePrivacyInput) => {
    try {
      await updatePrivacy(data);
    } catch (error) {
      console.error("Error updating privacy settings:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and public profile</CardDescription>
            </CardHeader>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profileForm.watch("avatarUrl") || undefined} alt={profileForm.watch("firstName")} />
                    <AvatarFallback>
                      {profileForm
                        .watch("firstName")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="space-y-2">
                      <label htmlFor="avatarUrl" className="text-sm font-medium">
                        Avatar URL
                      </label>
                      <Input id="avatarUrl" placeholder="https://example.com/avatar.jpg" {...profileForm.register("avatarUrl")} value={profileForm.watch("avatarUrl") || ""} />
                      <p className="text-sm text-muted-foreground">Enter a URL for your profile picture</p>
                      {profileForm.formState.errors.avatarUrl && <p className="text-sm text-destructive">{profileForm.formState.errors.avatarUrl.message}</p>}
                    </div>
                  </div>
                </div>

                <Input id="firstName" placeholder="Your first name" error={profileForm.formState.errors.firstName?.message} {...profileForm.register("firstName")} label="First Name" info="This is your public display name" />
                <Input id="lastName" placeholder="Your last name" error={profileForm.formState.errors.lastName?.message} {...profileForm.register("lastName")} label="Last Name" info="This is your public display name" />

                <Input id="email" readOnly placeholder="your.email@example.com" type="email" label="Email" info="This email will be used for account recovery and notifications \n (cannot be changed)" />

                <Textarea id="bio" label="Bio" info="This will be displayed on your public profile" placeholder="Tell us a bit about yourself" className="min-h-24 resize-none" error={profileForm.formState.errors.bio?.message} {...profileForm.register("bio")} />
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">
                  Last updated:{" "}
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <Button type="submit" loading={isSaving}>
                  <SaveIcon /> Save Changes
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize how the application looks to you</CardDescription>
            </CardHeader>
            <form onSubmit={appearanceForm.handleSubmit(onAppearanceSubmit)} className="space-y-6">
              <CardContent className="space-y-6">
                <Selector
                  options={[
                    { label: "Light", value: "light" },
                    { label: "Dark", value: "dark" },
                    { label: "System", value: "system" },
                  ]}
                  onChange={(value) => appearanceForm.setValue("theme", value as "light" | "dark" | "system")}
                  defaultValue={appearanceForm.watch("theme")}
                  label="Theme"
                  info="Choose your preferred color theme"
                  error={appearanceForm.formState.errors.theme?.message}
                />

                <Selector
                  options={[
                    { label: "Fira Code", value: "Fira Code" },
                    { label: "JetBrains Mono", value: "JetBrains Mono" },
                    { label: "Menlo", value: "Menlo" },
                    { label: "Monaco", value: "Monaco" },
                    { label: "Consolas", value: "Consolas" },
                  ]}
                  onChange={(value) => appearanceForm.setValue("codeFont", value)}
                  defaultValue={appearanceForm.watch("codeFont")}
                  label="Code Font"
                  info="Font used in code editors"
                  error={appearanceForm.formState.errors.codeFont?.message}
                />

                <Input
                  id="fontSize"
                  type="number"
                  min="12"
                  max="24"
                  {...appearanceForm.register("fontSize", {
                    valueAsNumber: true,
                  })}
                  label="Font Size"
                  info="Size of text in the code editor (12-24)"
                  error={appearanceForm.formState.errors.fontSize?.message}
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" loading={isSaving}>
                  <SaveIcon /> Save Changes
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Coding Preferences</CardTitle>
              <CardDescription>Configure your default coding settings</CardDescription>
            </CardHeader>
            <form onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)} className="space-y-6">
              <CardContent className="space-y-6">
                <Selector
                  options={Object.values(ProgrammingLanguageEnum).map((language) => ({ label: language, value: language }))}
                  onChange={(value) => preferencesForm.setValue("defaultLanguage", value)}
                  defaultValue={preferencesForm.watch("defaultLanguage")}
                  label="Default Language"
                  info="Your preferred programming language"
                  error={preferencesForm.formState.errors.defaultLanguage?.message}
                />

                <Selector
                  options={[
                    { label: "2 spaces", value: "2" },
                    { label: "4 spaces", value: "4" },
                    { label: "8 spaces", value: "8" },
                  ]}
                  onChange={(value) => preferencesForm.setValue("defaultTabSize", parseInt(value))}
                  defaultValue={preferencesForm.watch("defaultTabSize").toString()}
                  label="Tab Size"
                  info="Number of spaces for each tab"
                  error={preferencesForm.formState.errors.defaultTabSize?.message}
                />

                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <label className="text-base font-medium">Autosave</label>
                    <p className="text-sm text-muted-foreground">Automatically save your code as you type</p>
                  </div>
                  <Switch checked={preferencesForm.watch("autosave")} onCheckedChange={(checked) => preferencesForm.setValue("autosave", checked)} />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" loading={isSaving}>
                  <SaveIcon /> Save Changes
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when you receive notifications</CardDescription>
            </CardHeader>
            <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-6">
              <CardContent className="space-y-6">
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <label className="text-base font-medium">Email Notifications</label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch checked={notificationsForm.watch("email")} onCheckedChange={(checked) => notificationsForm.setValue("email", checked)} />
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <label className="text-base font-medium">Browser Notifications</label>
                    <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
                  </div>
                  <Switch checked={notificationsForm.watch("browser")} onCheckedChange={(checked) => notificationsForm.setValue("browser", checked)} />
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <label className="text-base font-medium">Mobile Notifications</label>
                    <p className="text-sm text-muted-foreground">Receive notifications on your mobile device</p>
                  </div>
                  <Switch checked={notificationsForm.watch("mobile")} onCheckedChange={(checked) => notificationsForm.setValue("mobile", checked)} />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" loading={isSaving}>
                  <SaveIcon /> Save Changes
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Control what information is visible to other users</CardDescription>
            </CardHeader>
            <form onSubmit={privacyForm.handleSubmit(onPrivacySubmit)} className="space-y-6">
              <CardContent className="space-y-6">
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <label className="text-base font-medium">Activity</label>
                    <p className="text-sm text-muted-foreground">Show your activity in the public feed</p>
                  </div>
                  <Switch checked={privacyForm.watch("showActivity")} onCheckedChange={(checked) => privacyForm.setValue("showActivity", checked)} />
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <label className="text-base font-medium">Solutions</label>
                    <p className="text-sm text-muted-foreground">Make your solutions visible to other users</p>
                  </div>
                  <Switch checked={privacyForm.watch("showSolutions")} onCheckedChange={(checked) => privacyForm.setValue("showSolutions", checked)} />
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <label className="text-base font-medium">Public Profile</label>
                    <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
                  </div>
                  <Switch checked={privacyForm.watch("showProfile")} onCheckedChange={(checked) => privacyForm.setValue("showProfile", checked)} />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" loading={isSaving}>
                  {isSuccessUpdatePrivacy ? (
                    <>
                      <CheckIcon /> Saved
                    </>
                  ) : (
                    <>
                      <SaveIcon /> Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
