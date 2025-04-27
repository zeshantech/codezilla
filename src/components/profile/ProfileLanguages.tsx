"use client";

import { LanguageStat } from "@/types/profile";
import { ProgrammingLanguage } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeIcon, CheckIcon, BarChart3 } from "lucide-react";
import { useMemo } from "react";

// Language icons and colors
const languageIcons: Record<ProgrammingLanguage, React.ReactNode> = {
  javascript: (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z" />
      <path d="M17.452 15.688c.708.991.36 1.881.18 2.116-.18.236-1.171.59-1.891.044-.78-.6-.972-1.381-1.135-2.088-.18-.708-.252-1.377-.252-1.377h-2.116s.18 2.044.54 3.329c.36 1.285 1.171 2.332 2.305 2.692 1.134.359 2.774.072 3.581-.991.807-1.063 1.242-2.629 1.242-4.592 0-1.963-.252-3.907-.252-3.907h-2.124c-.001 0-.001 3.818-.078 4.774z" />
    </svg>
  ),
  python: (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0C5.372 0 5.954 2.648 5.954 2.648L5.984 5.37h6.099v.863H3.723S0 5.873 0 12c0 6.127 3.249 5.910 3.249 5.910h1.937v-2.842S5.041 12 8.277 12h5.717s3.045.07 3.045-2.945V3.470S17.708 0 12 0zm-1.997 1.558c.608 0 1.101.493 1.101 1.102 0 .608-.493 1.102-1.101 1.102-.609 0-1.102-.494-1.102-1.102 0-.609.493-1.102 1.102-1.102z" />
      <path d="M12 24c6.628 0 6.046-2.648 6.046-2.648l-.03-2.722h-6.099v-.863h8.36S24 18.127 24 12c0-6.127-3.249-5.910-3.249-5.910h-1.937v2.842S18.959 12 15.723 12H10.006s-3.045-.07-3.045 2.945v5.585S6.292 24 12 24zm1.997-1.558c-.608 0-1.101-.493-1.101-1.102 0-.608.493-1.102 1.101-1.102.609 0 1.102.494 1.102 1.102 0 .609-.493 1.102-1.102 1.102z" />
    </svg>
  ),
  java: (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149M8.276 15.933s-1.028.761.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218M13.116 11.475c1.158 1.333-.304 2.533-.304 2.533s2.939-1.518 1.589-3.418c-1.261-1.772-2.228-2.652 3.007-5.688 0-.001-8.216 2.051-4.292 6.573M19.33 20.504s.679.559-.747.991c-2.712.822-11.288 1.069-13.669.033-.856-.373.75-.89 1.254-.998.527-.114.828-.93.828-.93-952.5-671 1.398-2.178-2.336-3.251 12.659 4.464 18.756 3.377 14.67 4.155M9.292 13.21s-2.606.619-923.624c0 0-.251-.384.546-.514 3.224-.529 8.412-.569 10.314.014.7.803-1.968.984-1.968.984l-.377.189M16.717 17.962c3.267-1.699 1.758-3.334 1.758-3.334-.446 1.254-1.736 1.664-2.799 2.011-.983.317-2.259.47-2.259.47l.055.305s4.062-.203 6.934-1.004c-.486 1.112 1.236 2.651-3.689 1.552M14.148 0s1.909 1.909-1.808 4.843c-2.993 2.356-.682 3.699-.001 5.233-1.745-1.573-3.027-2.957-2.166-4.246 1.266-1.893 4.771-2.813 3.975-5.83M9.653 29.893c3.138.201 7.956-.111 8.067-1.592 0 0-.219.561-2.591.997-2.679.491-5.995.434-7.961.119 0 0 .403.335 2.485.476" />
    </svg>
  ),
  cpp: (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.394 6c-.167-.29-.398-.543-.652-.69L12.926.22c-.509-.294-1.34-.294-1.848 0L2.26 5.31c-.508.293-.923 1.013-.923 1.6v10.18c0 .294.104.62.271.91.167.29.398.543.652.69l8.816 5.09c.508.293 1.34.293 1.848 0l8.816-5.09c.254-.147.485-.4.652-.69.167-.29.27-.616.27-.91V6.91c.003-.294-.1-.62-.268-.91zM12 19.11c-3.92 0-7.109-3.19-7.109-7.109 0-3.92 3.19-7.109 7.109-7.109a7.133 7.133 0 016.156 3.552l-3.076 1.78a3.567 3.567 0 00-3.08-1.78A3.56 3.56 0 008.444 12 3.56 3.56 0 0012 15.555a3.57 3.57 0 003.08-1.778l3.078 1.78A7.135 7.135 0 0112 19.11zm7.11-6.715h-.79v.79h-.79v-.79h-.79v-.79h.79v-.79h.79v.79h.79zm2.962 0h-.79v.79h-.79v-.79h-.79v-.79h.79v-.79h.79v.79h.79z"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  ),
};

const languageColors: Record<ProgrammingLanguage, string> = {
  javascript: "bg-yellow-400 text-black",
  python: "bg-blue-500 text-white",
  java: "bg-orange-500 text-white",
  cpp: "bg-blue-600 text-white",
};

interface ProfileLanguagesProps {
  languageStats: Record<ProgrammingLanguage, LanguageStat>;
}

export function ProfileLanguages({ languageStats }: ProfileLanguagesProps) {
  const languages = useMemo(() => {
    return Object.values(languageStats).sort(
      (a, b) => b.percentage - a.percentage
    );
  }, [languageStats]);

  const totalSolved = useMemo(() => {
    return languages.reduce((total, lang) => total + lang.problemsSolved, 0);
  }, [languages]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Programming Languages</CardTitle>
          <CardDescription>
            Languages you've used to solve problems
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {languages.map((language) => (
              <div key={language.language} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded-md ${
                        languageColors[language.language]
                      }`}
                    >
                      {languageIcons[language.language]}
                    </div>
                    <div>
                      <div className="font-medium capitalize">
                        {language.language}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {language.experienceLevel}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    {language.problemsSolved} problems
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Proficiency</span>
                    <span>{language.percentage}%</span>
                  </div>
                  <Progress value={language.percentage} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Language Distribution</CardTitle>
          <CardDescription>
            Percentage breakdown of your solved problems by language
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center">
            <div className="relative h-40 w-40">
              <svg
                className="h-full w-full"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
              >
                {languages.map((language, i) => {
                  const percentage =
                    totalSolved > 0
                      ? (language.problemsSolved / totalSolved) * 100
                      : 0;
                  // Calculate the pie chart segments
                  let cumulativePercentage = 0;
                  for (let j = 0; j < i; j++) {
                    cumulativePercentage +=
                      (languages[j].problemsSolved / totalSolved) * 100;
                  }
                  const startAngle = (cumulativePercentage / 100) * 360;
                  const endAngle = startAngle + (percentage / 100) * 360;

                  // Convert angles to radians for calculation
                  const startRad = (startAngle - 90) * (Math.PI / 180);
                  const endRad = (endAngle - 90) * (Math.PI / 180);

                  // Calculate the path
                  const x1 = 50 + 40 * Math.cos(startRad);
                  const y1 = 50 + 40 * Math.sin(startRad);
                  const x2 = 50 + 40 * Math.cos(endRad);
                  const y2 = 50 + 40 * Math.sin(endRad);

                  // Determine if the arc is large (> 180 degrees)
                  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

                  // Create the SVG path
                  const path = `
                    M 50 50
                    L ${x1} ${y1}
                    A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}
                    Z
                  `;

                  // Get color from language
                  const color = getLanguageColor(language.language);

                  return (
                    <path
                      key={language.language}
                      d={path}
                      fill={color}
                      stroke="hsl(var(--background))"
                      strokeWidth="1"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-bold">{totalSolved}</span>
                <span className="text-xs">Problems</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {languages.map((language) => (
              <div
                key={language.language}
                className="flex items-center gap-1.5"
              >
                <div
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: getLanguageColor(language.language),
                  }}
                />
                <span className="text-xs capitalize">{language.language}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper to get language color
function getLanguageColor(language: ProgrammingLanguage): string {
  switch (language) {
    case "javascript":
      return "#F7DF1E";
    case "python":
      return "#3776AB";
    case "java":
      return "#007396";
    case "cpp":
      return "#00599C";
    default:
      return "#888888";
  }
}
