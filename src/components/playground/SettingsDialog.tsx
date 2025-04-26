import { useState } from "react";
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
import {
  Settings,
  MonitorSmartphone,
  Keyboard,
  Code,
  PaintBucket,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import useEditorSettings, { EditorSettings } from "@/hooks/useEditorSettings";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface SettingsDialogProps {
  settings: EditorSettings;
  onUpdateSettings: (settings: Partial<EditorSettings>) => void;
  onResetSettings: () => void;
}

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

  const {
    settings,
    updateSettings: onUpdateSettings,
    resetSettings: onResetSettings,
  } = useEditorSettings();

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" size="icon-sm">
          <Settings />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] h-auto overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="size-5" />
            Editor Settings
          </DialogTitle>
          <DialogDescription>
            Customize your editor experience to match your workflow
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row md:gap-8 mt-3">
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
                      value={settings.theme}
                      onValueChange={(value) =>
                        onUpdateSettings({ theme: value as "light" | "dark" })
                      }
                    >
                      <SelectTrigger id="theme" className="w-full sm:w-[130px]">
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
                    description={`${settings.fontSize}px`}
                  >
                    <Slider
                      id="fontSize"
                      value={[settings.fontSize]}
                      min={10}
                      max={24}
                      step={1}
                      onValueChange={(value) =>
                        onUpdateSettings({ fontSize: value[0] })
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
                      checked={settings.showMinimap}
                      onCheckedChange={(checked) =>
                        onUpdateSettings({ showMinimap: checked })
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
                      checked={settings.showLineNumbers}
                      onCheckedChange={(checked) =>
                        onUpdateSettings({ showLineNumbers: checked })
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
                      checked={settings.wordWrap}
                      onCheckedChange={(checked) =>
                        onUpdateSettings({ wordWrap: checked })
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
                      checked={settings.enableLigatures}
                      onCheckedChange={(checked) =>
                        onUpdateSettings({ enableLigatures: checked })
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
                    description={`${settings.tabSize} spaces`}
                  >
                    <Slider
                      id="tabSize"
                      value={[settings.tabSize]}
                      min={1}
                      max={8}
                      step={1}
                      onValueChange={(value) =>
                        onUpdateSettings({ tabSize: value[0] })
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
                      value={settings.indentUsingSpaces ? "spaces" : "tabs"}
                      onValueChange={(value) =>
                        onUpdateSettings({
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
                      checked={settings.autoComplete}
                      onCheckedChange={(checked) =>
                        onUpdateSettings({ autoComplete: checked })
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
                      checked={settings.formatOnSave}
                      onCheckedChange={(checked) =>
                        onUpdateSettings({ formatOnSave: checked })
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
                      checked={settings.enableSnippets}
                      onCheckedChange={(checked) =>
                        onUpdateSettings({ enableSnippets: checked })
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
                      checked={settings.highlightActiveLine}
                      onCheckedChange={(checked) =>
                        onUpdateSettings({ highlightActiveLine: checked })
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
                      checked={settings.showInvisibles}
                      onCheckedChange={(checked) =>
                        onUpdateSettings({ showInvisibles: checked })
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
                      checked={settings.keyboardShortcuts.format}
                      onCheckedChange={(checked) =>
                        onUpdateSettings({
                          keyboardShortcuts: {
                            ...settings.keyboardShortcuts,
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
                      checked={settings.keyboardShortcuts.save}
                      onCheckedChange={(checked) =>
                        onUpdateSettings({
                          keyboardShortcuts: {
                            ...settings.keyboardShortcuts,
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
                      checked={settings.keyboardShortcuts.run}
                      onCheckedChange={(checked) =>
                        onUpdateSettings({
                          keyboardShortcuts: {
                            ...settings.keyboardShortcuts,
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
                      checked={settings.keyboardShortcuts.reset}
                      onCheckedChange={(checked) =>
                        onUpdateSettings({
                          keyboardShortcuts: {
                            ...settings.keyboardShortcuts,
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

        <DialogFooter className="flex-col sm:flex-row gap-2 mt-6">
          <Button
            variant="outline"
            onClick={onResetSettings}
            className="w-full sm:w-auto"
          >
            <RotateCcw className="mr-2 size-4" />
            Reset to Defaults
          </Button>
          <Button type="submit" className="w-full sm:w-auto">
            <CheckCircle2 className="mr-2 size-4" />
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsDialog;
