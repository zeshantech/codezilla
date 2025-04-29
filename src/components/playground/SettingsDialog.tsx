import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Keyboard, Code, PaintBucket, RotateCcw, CheckCircle2 } from "lucide-react";
import useEditorSettings, { EditorSettings } from "@/hooks/useEditorSettings";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface SettingItemProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

function SettingItem({ label, description, children, className }: SettingItemProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row items-start justify-between gap-2 py-3", className)}>
      <div className="space-y-0.5">
        <Label className="text-sm font-medium">{label}</Label>
        {description && <p className="text-[0.8rem] text-muted-foreground">{description}</p>}
      </div>
      <div className="flex w-full sm:w-[180px] items-center justify-start sm:justify-end">{children}</div>
    </div>
  );
}

export function SettingsDialog() {
  const [activeTab, setActiveTab] = useState("appearance");
  const [open, setOpen] = useState(false);
  const [tempSettings, setTempSettings] = useState<Partial<EditorSettings>>({});

  const { settings, updateSettings, resetSettings, isSaving, isLoaded } = useEditorSettings();

  // Initialize temp settings when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setTempSettings({});
    }
    setOpen(open);
  };

  // Apply temporary settings to actual settings
  const handleApplyChanges = async () => {
    if (Object.keys(tempSettings).length > 0) {
      await updateSettings(tempSettings);
      setTempSettings({});
      setOpen(false);
    }
  };

  // Update temp settings (doesn't apply them yet)
  const handleUpdateTempSettings = (newSettings: Partial<EditorSettings>) => {
    setTempSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Reset settings and close dialog
  const handleResetSettings = async () => {
    await resetSettings();
    setTempSettings({});
    setOpen(false);
  };

  // Combine current settings with temp settings for preview
  const previewSettings = { ...settings, ...tempSettings };

  if (!isLoaded) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
          <DialogDescription>Customize your editor experience to match your workflow</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row md:gap-8">
          <div className="w-full md:w-auto mb-4 md:mb-0">
            <Tabs defaultValue="appearance" value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
              <TabsList className="flex flex-row md:flex-col h-auto p-0 md:h-full bg-transparent overflow-x-auto md:overflow-x-visible">
                <TabsTrigger value="appearance" className="flex items-center gap-2 w-full md:w-40 justify-start">
                  <PaintBucket className="shrink-0" />
                  <span className="truncate">Appearance</span>
                </TabsTrigger>
                <TabsTrigger value="editor" className="flex items-center gap-2 w-full md:w-40 justify-start">
                  <Code className="shrink-0" />
                  <span className="truncate">Editor</span>
                </TabsTrigger>
                <TabsTrigger value="shortcuts" className="flex items-center gap-2 w-full md:w-40 justify-start">
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
                  <p className="text-xs text-muted-foreground mb-4">Customize how the editor looks</p>
                </div>

                <div className="space-y-1">
                  <SettingItem label="Theme" description="Choose light or dark mode">
                    <Select value={previewSettings.theme} onValueChange={(value) => handleUpdateTempSettings({ theme: value as "light" | "dark" })}>
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

                  <SettingItem label="Font Size" description={`${previewSettings.fontSize}px`}>
                    <Slider id="fontSize" value={[previewSettings.fontSize]} min={10} max={24} step={1} onValueChange={(value) => handleUpdateTempSettings({ fontSize: value[0] })} className="w-full sm:w-[130px]" />
                  </SettingItem>

                  <Separator />

                  <SettingItem label="Show Minimap" description="Display code overview on the side">
                    <Switch id="showMinimap" checked={previewSettings.showMinimap} onCheckedChange={(checked) => handleUpdateTempSettings({ showMinimap: checked })} />
                  </SettingItem>

                  <Separator />

                  <SettingItem label="Show Line Numbers" description="Display line numbers in the gutter">
                    <Switch id="showLineNumbers" checked={previewSettings.showLineNumbers} onCheckedChange={(checked) => handleUpdateTempSettings({ showLineNumbers: checked })} />
                  </SettingItem>

                  <Separator />

                  <SettingItem label="Word Wrap" description="Wrap lines that exceed the width of the editor">
                    <Switch id="wordWrap" checked={previewSettings.wordWrap} onCheckedChange={(checked) => handleUpdateTempSettings({ wordWrap: checked })} />
                  </SettingItem>

                  <Separator />

                  <SettingItem label="Font Ligatures" description="Enable stylistic character combinations">
                    <Switch id="enableLigatures" checked={previewSettings.enableLigatures} onCheckedChange={(checked) => handleUpdateTempSettings({ enableLigatures: checked })} />
                  </SettingItem>
                </div>
              </TabsContent>

              <TabsContent value="editor" className="mt-0">
                <div className="space-y-1">
                  <h3 className="font-medium text-sm">Behavior</h3>
                  <p className="text-xs text-muted-foreground mb-4">Customize how the editor functions</p>
                </div>

                <div className="space-y-1">
                  <SettingItem label="Tab Size" description={`${previewSettings.tabSize} spaces`}>
                    <Slider id="tabSize" value={[previewSettings.tabSize]} min={1} max={8} step={1} onValueChange={(value) => handleUpdateTempSettings({ tabSize: value[0] })} className="w-full sm:w-[130px]" />
                  </SettingItem>

                  <Separator />

                  <SettingItem label="Indentation" description="Choose between spaces and tabs">
                    <Select
                      value={previewSettings.indentUsingSpaces ? "spaces" : "tabs"}
                      onValueChange={(value) =>
                        handleUpdateTempSettings({
                          indentUsingSpaces: value === "spaces",
                        })
                      }
                    >
                      <SelectTrigger id="indentType" className="w-full sm:w-[130px]">
                        <SelectValue placeholder="Indentation type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spaces">Spaces</SelectItem>
                        <SelectItem value="tabs">Tabs</SelectItem>
                      </SelectContent>
                    </Select>
                  </SettingItem>

                  <Separator />

                  <SettingItem label="Auto-Complete" description="Show code suggestions as you type">
                    <Switch id="autoComplete" checked={previewSettings.autoComplete} onCheckedChange={(checked) => handleUpdateTempSettings({ autoComplete: checked })} />
                  </SettingItem>

                  <Separator />

                  <SettingItem label="Format on Save" description="Automatically format code when saving">
                    <Switch id="formatOnSave" checked={previewSettings.formatOnSave} onCheckedChange={(checked) => handleUpdateTempSettings({ formatOnSave: checked })} />
                  </SettingItem>

                  <Separator />

                  <SettingItem label="Enable Snippets" description="Use code snippets for common patterns">
                    <Switch id="enableSnippets" checked={previewSettings.enableSnippets} onCheckedChange={(checked) => handleUpdateTempSettings({ enableSnippets: checked })} />
                  </SettingItem>

                  <Separator />

                  <SettingItem label="Highlight Active Line" description="Highlight the current line during editing">
                    <Switch id="highlightActiveLine" checked={previewSettings.highlightActiveLine} onCheckedChange={(checked) => handleUpdateTempSettings({ highlightActiveLine: checked })} />
                  </SettingItem>

                  <Separator />

                  <SettingItem label="Show Invisible Characters" description="Display whitespace and other invisible characters">
                    <Switch id="showInvisibles" checked={previewSettings.showInvisibles} onCheckedChange={(checked) => handleUpdateTempSettings({ showInvisibles: checked })} />
                  </SettingItem>
                </div>
              </TabsContent>

              <TabsContent value="shortcuts" className="mt-0">
                <div className="space-y-1">
                  <h3 className="font-medium text-sm">Keyboard Shortcuts</h3>
                  <p className="text-xs text-muted-foreground mb-4">Enable or disable keyboard shortcuts</p>
                </div>

                <div className="space-y-1">
                  <SettingItem label="Format Code" description="Ctrl+Alt+F">
                    <Switch
                      id="shortcutFormat"
                      checked={previewSettings.keyboardShortcuts.format}
                      onCheckedChange={(checked) =>
                        handleUpdateTempSettings({
                          keyboardShortcuts: {
                            ...previewSettings.keyboardShortcuts,
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
                      checked={previewSettings.keyboardShortcuts.save}
                      onCheckedChange={(checked) =>
                        handleUpdateTempSettings({
                          keyboardShortcuts: {
                            ...previewSettings.keyboardShortcuts,
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
                      checked={previewSettings.keyboardShortcuts.run}
                      onCheckedChange={(checked) =>
                        handleUpdateTempSettings({
                          keyboardShortcuts: {
                            ...previewSettings.keyboardShortcuts,
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
                      checked={previewSettings.keyboardShortcuts.reset}
                      onCheckedChange={(checked) =>
                        handleUpdateTempSettings({
                          keyboardShortcuts: {
                            ...previewSettings.keyboardShortcuts,
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
          <Button variant="outline" onClick={handleResetSettings} disabled={isSaving} className="w-full sm:w-auto">
            <RotateCcw />
            Reset to Defaults
          </Button>
          <Button onClick={handleApplyChanges} disabled={isSaving || Object.keys(tempSettings).length === 0} loading={isSaving} className="w-full sm:w-auto">
            <CheckCircle2 />
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsDialog;
