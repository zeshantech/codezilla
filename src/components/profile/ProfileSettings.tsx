"use client";

import { useState } from "react";
import { UserProfile, UserProfileSettings } from "@/types/profile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  Selector,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckIcon, SaveIcon } from "lucide-react";

// Profile form schema
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
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
  defaultLanguage: z.enum(["javascript", "python", "java", "cpp"]),
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

interface ProfileSettingsProps {
  user: UserProfile;
  settings: UserProfileSettings;
  onUpdateProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  onUpdateSettings: (
    settings: Partial<UserProfileSettings>
  ) => Promise<boolean>;
}

export function ProfileSettings({
  user,
  settings,
  onUpdateProfile,
  onUpdateSettings,
}: ProfileSettingsProps) {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);
  const [appearanceUpdateSuccess, setAppearanceUpdateSuccess] = useState(false);
  const [preferencesUpdateSuccess, setPreferencesUpdateSuccess] =
    useState(false);
  const [notificationsUpdateSuccess, setNotificationsUpdateSuccess] =
    useState(false);
  const [privacyUpdateSuccess, setPrivacyUpdateSuccess] = useState(false);

  // Initialize forms with current data
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      bio: user.bio || "",
      avatarUrl: user.avatarUrl || "",
    },
  });

  const appearanceForm = useForm<z.infer<typeof appearanceFormSchema>>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme: settings.appearance.theme,
      codeFont: settings.appearance.codeFont,
      fontSize: settings.appearance.fontSize,
    },
  });

  const preferencesForm = useForm<z.infer<typeof preferencesFormSchema>>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: {
      defaultLanguage: settings.preferences.defaultLanguage,
      defaultTabSize: settings.preferences.defaultTabSize,
      autosave: settings.preferences.autosave,
    },
  });

  const notificationsForm = useForm<z.infer<typeof notificationsFormSchema>>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      email: settings.notifications.email,
      browser: settings.notifications.browser,
      mobile: settings.notifications.mobile,
    },
  });

  const privacyForm = useForm<z.infer<typeof privacyFormSchema>>({
    resolver: zodResolver(privacyFormSchema),
    defaultValues: {
      showActivity: settings.privacy.showActivity,
      showSolutions: settings.privacy.showSolutions,
      showProfile: settings.privacy.showProfile,
    },
  });

  // Submit handlers for each form
  const onProfileSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    setIsSaving(true);
    setProfileUpdateSuccess(false);

    try {
      const success = await onUpdateProfile(data);
      if (success) {
        setProfileUpdateSuccess(true);
        setTimeout(() => setProfileUpdateSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const onAppearanceSubmit = async (
    data: z.infer<typeof appearanceFormSchema>
  ) => {
    setIsSaving(true);
    setAppearanceUpdateSuccess(false);

    try {
      const success = await onUpdateSettings({
        appearance: data,
      });

      if (success) {
        setAppearanceUpdateSuccess(true);
        setTimeout(() => setAppearanceUpdateSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error updating appearance settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const onPreferencesSubmit = async (
    data: z.infer<typeof preferencesFormSchema>
  ) => {
    setIsSaving(true);
    setPreferencesUpdateSuccess(false);

    try {
      const success = await onUpdateSettings({
        preferences: data,
      });

      if (success) {
        setPreferencesUpdateSuccess(true);
        setTimeout(() => setPreferencesUpdateSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error updating preferences:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const onNotificationsSubmit = async (
    data: z.infer<typeof notificationsFormSchema>
  ) => {
    setIsSaving(true);
    setNotificationsUpdateSuccess(false);

    try {
      const success = await onUpdateSettings({
        notifications: data,
      });

      if (success) {
        setNotificationsUpdateSuccess(true);
        setTimeout(() => setNotificationsUpdateSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error updating notification settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const onPrivacySubmit = async (data: z.infer<typeof privacyFormSchema>) => {
    setIsSaving(true);
    setPrivacyUpdateSuccess(false);

    try {
      const success = await onUpdateSettings({
        privacy: data,
      });

      if (success) {
        setPrivacyUpdateSuccess(true);
        setTimeout(() => setPrivacyUpdateSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error updating privacy settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
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
              <CardDescription>
                Update your personal information and public profile
              </CardDescription>
            </CardHeader>
            <form
              onSubmit={profileForm.handleSubmit(onProfileSubmit)}
              className="space-y-6"
            >
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <Avatar className="w-20 h-20">
                    <AvatarImage
                      src={profileForm.watch("avatarUrl") || undefined}
                      alt={profileForm.watch("name")}
                    />
                    <AvatarFallback>
                      {profileForm
                        .watch("name")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="space-y-2">
                      <label
                        htmlFor="avatarUrl"
                        className="text-sm font-medium"
                      >
                        Avatar URL
                      </label>
                      <Input
                        id="avatarUrl"
                        placeholder="https://example.com/avatar.jpg"
                        {...profileForm.register("avatarUrl")}
                        value={profileForm.watch("avatarUrl") || ""}
                      />
                      <p className="text-sm text-muted-foreground">
                        Enter a URL for your profile picture
                      </p>
                      {profileForm.formState.errors.avatarUrl && (
                        <p className="text-sm text-destructive">
                          {profileForm.formState.errors.avatarUrl.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Input
                  id="name"
                  placeholder="Your name"
                  error={profileForm.formState.errors.name?.message}
                  {...profileForm.register("name")}
                  label="Name"
                  info="This is your public display name"
                />

                <Input
                  id="email"
                  placeholder="your.email@example.com"
                  type="email"
                  error={profileForm.formState.errors.email?.message}
                  {...profileForm.register("email")}
                  label="Email"
                  info="This email will be used for notifications and account recovery"
                />

                <Textarea
                  id="bio"
                  label="Bio"
                  info="This will be displayed on your public profile"
                  placeholder="Tell us a bit about yourself"
                  className="min-h-24 resize-none"
                  error={profileForm.formState.errors.bio?.message}
                  {...profileForm.register("bio")}
                />
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
              <CardDescription>
                Customize how the application looks to you
              </CardDescription>
            </CardHeader>
            <form
              onSubmit={appearanceForm.handleSubmit(onAppearanceSubmit)}
              className="space-y-6"
            >
              <CardContent className="space-y-6">
                <Selector
                  options={[
                    { label: "Light", value: "light" },
                    { label: "Dark", value: "dark" },
                    { label: "System", value: "system" },
                  ]}
                  onChange={(value) =>
                    appearanceForm.setValue(
                      "theme",
                      value as "light" | "dark" | "system"
                    )
                  }
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
                  onChange={(value) =>
                    appearanceForm.setValue("codeFont", value)
                  }
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
              <CardDescription>
                Configure your default coding settings
              </CardDescription>
            </CardHeader>
            <form
              onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)}
              className="space-y-6"
            >
              <CardContent className="space-y-6">
                <Selector
                  options={[
                    { label: "JavaScript", value: "javascript" },
                    { label: "Python", value: "python" },
                    { label: "Java", value: "java" },
                    { label: "C++", value: "cpp" },
                  ]}
                  onChange={(value) =>
                    preferencesForm.setValue(
                      "defaultLanguage",
                      value as "javascript" | "python" | "java" | "cpp"
                    )
                  }
                  defaultValue={preferencesForm.watch("defaultLanguage")}
                  label="Default Language"
                  info="Your preferred programming language"
                  error={
                    preferencesForm.formState.errors.defaultLanguage?.message
                  }
                />

                <Selector
                  options={[
                    { label: "2 spaces", value: "2" },
                    { label: "4 spaces", value: "4" },
                    { label: "8 spaces", value: "8" },
                  ]}
                  onChange={(value) =>
                    preferencesForm.setValue("defaultTabSize", parseInt(value))
                  }
                  defaultValue={preferencesForm
                    .watch("defaultTabSize")
                    .toString()}
                  label="Tab Size"
                  info="Number of spaces for each tab"
                  error={
                    preferencesForm.formState.errors.defaultTabSize?.message
                  }
                />

                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <label className="text-base font-medium">Autosave</label>
                    <p className="text-sm text-muted-foreground">
                      Automatically save your code as you type
                    </p>
                  </div>
                  <Switch
                    checked={preferencesForm.watch("autosave")}
                    onCheckedChange={(checked) =>
                      preferencesForm.setValue("autosave", checked)
                    }
                  />
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
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <form
              onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)}
              className="space-y-6"
            >
              <CardContent className="space-y-6">
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <label className="text-base font-medium">
                      Email Notifications
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={notificationsForm.watch("email")}
                    onCheckedChange={(checked) =>
                      notificationsForm.setValue("email", checked)
                    }
                  />
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <label className="text-base font-medium">
                      Browser Notifications
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications in your browser
                    </p>
                  </div>
                  <Switch
                    checked={notificationsForm.watch("browser")}
                    onCheckedChange={(checked) =>
                      notificationsForm.setValue("browser", checked)
                    }
                  />
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <label className="text-base font-medium">
                      Mobile Notifications
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications on your mobile device
                    </p>
                  </div>
                  <Switch
                    checked={notificationsForm.watch("mobile")}
                    onCheckedChange={(checked) =>
                      notificationsForm.setValue("mobile", checked)
                    }
                  />
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
              <CardDescription>
                Control what information is visible to other users
              </CardDescription>
            </CardHeader>
            <form
              onSubmit={privacyForm.handleSubmit(onPrivacySubmit)}
              className="space-y-6"
            >
              <CardContent className="space-y-6">
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <label className="text-base font-medium">Activity</label>
                    <p className="text-sm text-muted-foreground">
                      Show your activity in the public feed
                    </p>
                  </div>
                  <Switch
                    checked={privacyForm.watch("showActivity")}
                    onCheckedChange={(checked) =>
                      privacyForm.setValue("showActivity", checked)
                    }
                  />
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <label className="text-base font-medium">Solutions</label>
                    <p className="text-sm text-muted-foreground">
                      Make your solutions visible to other users
                    </p>
                  </div>
                  <Switch
                    checked={privacyForm.watch("showSolutions")}
                    onCheckedChange={(checked) =>
                      privacyForm.setValue("showSolutions", checked)
                    }
                  />
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <label className="text-base font-medium">
                      Public Profile
                    </label>
                    <p className="text-sm text-muted-foreground">
                      Make your profile visible to other users
                    </p>
                  </div>
                  <Switch
                    checked={privacyForm.watch("showProfile")}
                    onCheckedChange={(checked) =>
                      privacyForm.setValue("showProfile", checked)
                    }
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" loading={isSaving}>
                  {privacyUpdateSuccess ? (
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
