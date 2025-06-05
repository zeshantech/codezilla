import {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Keyboard, Code, PaintBucket, RotateCcw } from "lucide-react";
import useEditorSettings, { EditorSettings } from "@/hooks/useEditorSettings";
import { cn, debounce } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

// Create a context to hold local settings that can be accessed by the editor
export interface LocalSettingsContextType {
  localSettings: EditorSettings | null;
}

// Default context value is null to indicate no local settings are available
export const LocalSettingsContext = createContext<LocalSettingsContextType>({
  localSettings: null,
});

export const useLocalSettings = () => useContext(LocalSettingsContext);

interface SettingItemProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

function SettingItem({
  label,
  description,
  children,
  className,
}: SettingItemProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-start justify-between gap-2 py-3",
        className
      )}
    >
      <div className="space-y-0.5">
        <Label className="text-sm font-medium">{label}</Label>
        {description && (
          <p className="text-[0.8rem] text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex w-full sm:w-[180px] items-center justify-start sm:justify-end">
        {children}
      </div>
    </div>
  );
}

export function SettingsDialog() {
  const [activeTab, setActiveTab] = useState("appearance");
  const [open, setOpen] = useState(false);
  const [localSettings, setLocalSettings] = useState<EditorSettings | null>(
    null
  );

  const { settings, updateSettings, resetSettings, isSaving, isLoaded } =
    useEditorSettings();

  // Set local settings when the actual settings load or change
  useEffect(() => {
    if (settings && isLoaded) {
      setLocalSettings(settings);
    }
  }, [settings, isLoaded]);

  // Create a debounced version of updateSettings
  const debouncedUpdateSettings = useCallback(
    debounce((newSettings: Partial<EditorSettings>) => {
      updateSettings(newSettings);
    }, 10000),
    [updateSettings]
  );

  // Handle local settings change
  const handleSettingChange = (newSettings: Partial<EditorSettings>) => {
    if (!localSettings) return;

    const updatedSettings = { ...localSettings, ...newSettings };
    setLocalSettings(updatedSettings);
    debouncedUpdateSettings(newSettings);
  };

  // Reset settings and close dialog
  const handleResetSettings = async () => {
    await resetSettings();
    setOpen(false);
  };

  if (!isLoaded || !localSettings) {
    return null;
  }

  return (
    <LocalSettingsContext.Provider value={{ localSettings }}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button variant="outline" size="icon-sm">
            <Settings />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] h-auto overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="size-5" />
              Editor Settings
            </DialogTitle>
            <DialogDescription>
              Customize your editor experience to match your workflow
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col md:flex-row md:gap-8">
            <div className="w-full md:w-auto mb-4 md:mb-0">
              <Tabs
                defaultValue="appearance"
                value={activeTab}
                onValueChange={setActiveTab}
                orientation="vertical"
                className="w-full"
              >
                <TabsList className="flex flex-row md:flex-col h-auto p-0 md:h-full bg-transparent overflow-x-auto md:overflow-x-visible">
                  <TabsTrigger
                    value="appearance"
                    className="flex items-center gap-2 w-full md:w-40 justify-start"
                  >
                    <PaintBucket className="shrink-0" />
                    <span className="truncate">Appearance</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="editor"
                    className="flex items-center gap-2 w-full md:w-40 justify-start"
                  >
                    <Code className="shrink-0" />
                    <span className="truncate">Editor</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="shortcuts"
                    className="flex items-center gap-2 w-full md:w-40 justify-start"
                  >
                    <Keyboard className="shrink-0" />
                    <span className="truncate">Shortcuts</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <Separator orientation="vertical" className="hidden md:block" />
            <Separator className="md:hidden my-2" />

            <div className="flex-1 min-h-[300px] md:min-h-[400px] overflow-y-auto">
              <Tabs value={activeTab} className="w-full">
                <TabsContent value="appearance" className="mt-0">
                  <div className="space-y-1">
                    <h3 className="font-medium text-sm">Display</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Customize how the editor looks
                    </p>
                  </div>

                  <div className="space-y-1">
                    <SettingItem
                      label="Theme"
                      description="Choose light or dark mode"
                    >
                      <Select
                        value={localSettings.theme}
                        onValueChange={(value) =>
                          handleSettingChange({
                            theme: value as "light" | "dark",
                          })
                        }
                      >
                        <SelectTrigger
                          id="theme"
                          className="w-full sm:w-[130px]"
                        >
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                    </SettingItem>

                    <Separator />

                    <SettingItem
                      label="Font Size"
                      description={`${localSettings.fontSize}px`}
                    >
                      <Slider
                        id="fontSize"
                        value={[localSettings.fontSize]}
                        min={10}
                        max={24}
                        step={1}
                        onValueChange={(value) =>
                          handleSettingChange({ fontSize: value[0] })
                        }
                        className="w-full sm:w-[130px]"
                      />
                    </SettingItem>

                    <Separator />

                    <SettingItem
                      label="Show Minimap"
                      description="Display code overview on the side"
                    >
                      <Switch
                        id="showMinimap"
                        checked={localSettings.showMinimap}
                        onCheckedChange={(checked) =>
                          handleSettingChange({ showMinimap: checked })
                        }
                      />
                    </SettingItem>

                    <Separator />

                    <SettingItem
                      label="Show Line Numbers"
                      description="Display line numbers in the gutter"
                    >
                      <Switch
                        id="showLineNumbers"
                        checked={localSettings.showLineNumbers}
                        onCheckedChange={(checked) =>
                          handleSettingChange({ showLineNumbers: checked })
                        }
                      />
                    </SettingItem>

                    <Separator />

                    <SettingItem
                      label="Word Wrap"
                      description="Wrap lines that exceed the width of the editor"
                    >
                      <Switch
                        id="wordWrap"
                        checked={localSettings.wordWrap}
                        onCheckedChange={(checked) =>
                          handleSettingChange({ wordWrap: checked })
                        }
                      />
                    </SettingItem>

                    <Separator />

                    <SettingItem
                      label="Font Ligatures"
                      description="Enable stylistic character combinations"
                    >
                      <Switch
                        id="enableLigatures"
                        checked={localSettings.enableLigatures}
                        onCheckedChange={(checked) =>
                          handleSettingChange({ enableLigatures: checked })
                        }
                      />
                    </SettingItem>
                  </div>
                </TabsContent>

                <TabsContent value="editor" className="mt-0">
                  <div className="space-y-1">
                    <h3 className="font-medium text-sm">Behavior</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Customize how the editor functions
                    </p>
                  </div>

                  <div className="space-y-1">
                    <SettingItem
                      label="Tab Size"
                      description={`${localSettings.tabSize} spaces`}
                    >
                      <Slider
                        id="tabSize"
                        value={[localSettings.tabSize]}
                        min={1}
                        max={8}
                        step={1}
                        onValueChange={(value) =>
                          handleSettingChange({ tabSize: value[0] })
                        }
                        className="w-full sm:w-[130px]"
                      />
                    </SettingItem>

                    <Separator />

                    <SettingItem
                      label="Indentation"
                      description="Choose between spaces and tabs"
                    >
                      <Select
                        value={
                          localSettings.indentUsingSpaces ? "spaces" : "tabs"
                        }
                        onValueChange={(value) =>
                          handleSettingChange({
                            indentUsingSpaces: value === "spaces",
                          })
                        }
                      >
                        <SelectTrigger
                          id="indentType"
                          className="w-full sm:w-[130px]"
                        >
                          <SelectValue placeholder="Indentation type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="spaces">Spaces</SelectItem>
                          <SelectItem value="tabs">Tabs</SelectItem>
                        </SelectContent>
                      </Select>
                    </SettingItem>

                    <Separator />

                    <SettingItem
                      label="Auto-Complete"
                      description="Show code suggestions as you type"
                    >
                      <Switch
                        id="autoComplete"
                        checked={localSettings.autoComplete}
                        onCheckedChange={(checked) =>
                          handleSettingChange({ autoComplete: checked })
                        }
                      />
                    </SettingItem>

                    <Separator />

                    <SettingItem
                      label="Format on Save"
                      description="Automatically format code when saving"
                    >
                      <Switch
                        id="formatOnSave"
                        checked={localSettings.formatOnSave}
                        onCheckedChange={(checked) =>
                          handleSettingChange({ formatOnSave: checked })
                        }
                      />
                    </SettingItem>

                    <Separator />

                    <SettingItem
                      label="Enable Snippets"
                      description="Use code snippets for common patterns"
                    >
                      <Switch
                        id="enableSnippets"
                        checked={localSettings.enableSnippets}
                        onCheckedChange={(checked) =>
                          handleSettingChange({ enableSnippets: checked })
                        }
                      />
                    </SettingItem>

                    <Separator />

                    <SettingItem
                      label="Highlight Active Line"
                      description="Highlight the current line during editing"
                    >
                      <Switch
                        id="highlightActiveLine"
                        checked={localSettings.highlightActiveLine}
                        onCheckedChange={(checked) =>
                          handleSettingChange({ highlightActiveLine: checked })
                        }
                      />
                    </SettingItem>

                    <Separator />

                    <SettingItem
                      label="Show Invisible Characters"
                      description="Display whitespace and other invisible characters"
                    >
                      <Switch
                        id="showInvisibles"
                        checked={localSettings.showInvisibles}
                        onCheckedChange={(checked) =>
                          handleSettingChange({ showInvisibles: checked })
                        }
                      />
                    </SettingItem>
                  </div>
                </TabsContent>

                <TabsContent value="shortcuts" className="mt-0">
                  <div className="space-y-1">
                    <h3 className="font-medium text-sm">Keyboard Shortcuts</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Enable or disable keyboard shortcuts
                    </p>
                  </div>

                  <div className="space-y-1">
                    <SettingItem label="Format Code" description="Ctrl+Alt+F">
                      <Switch
                        id="shortcutFormat"
                        checked={localSettings.keyboardShortcuts.format}
                        onCheckedChange={(checked) =>
                          handleSettingChange({
                            keyboardShortcuts: {
                              ...localSettings.keyboardShortcuts,
                              format: checked,
                            },
                          })
                        }
                      />
                    </SettingItem>

                    <Separator />

                    <SettingItem label="Save Code" description="Ctrl+S">
                      <Switch
                        id="shortcutSave"
                        checked={localSettings.keyboardShortcuts.save}
                        onCheckedChange={(checked) =>
                          handleSettingChange({
                            keyboardShortcuts: {
                              ...localSettings.keyboardShortcuts,
                              save: checked,
                            },
                          })
                        }
                      />
                    </SettingItem>

                    <Separator />

                    <SettingItem label="Run Code" description="Ctrl+Enter">
                      <Switch
                        id="shortcutRun"
                        checked={localSettings.keyboardShortcuts.run}
                        onCheckedChange={(checked) =>
                          handleSettingChange({
                            keyboardShortcuts: {
                              ...localSettings.keyboardShortcuts,
                              run: checked,
                            },
                          })
                        }
                      />
                    </SettingItem>

                    <Separator />

                    <SettingItem label="Reset Code" description="Alt+R">
                      <Switch
                        id="shortcutReset"
                        checked={localSettings.keyboardShortcuts.reset}
                        onCheckedChange={(checked) =>
                          handleSettingChange({
                            keyboardShortcuts: {
                              ...localSettings.keyboardShortcuts,
                              reset: checked,
                            },
                          })
                        }
                      />
                    </SettingItem>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleResetSettings}
              disabled={isSaving}
              className="w-full sm:w-auto"
            >
              <RotateCcw />
              Reset to Defaults
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </LocalSettingsContext.Provider>
  );
}

export default SettingsDialog;
