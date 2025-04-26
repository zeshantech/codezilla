"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Code, Lightbulb, BookOpen, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CreateProblemDialog } from "@/components/dialogs/CreateProblemDialog";
import { CreateCollectionDialog } from "@/components/dialogs/CreateCollectionDialog";
import { useTheme } from "next-themes";

export function AppHeader() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Check if the current path matches a given path
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-6">
          <span className="font-bold text-xl">LogicLab</span>
        </Link>

        {/* Main navbar - desktop */}
        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          <Link
            href="/"
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
              isActive("/")
                ? "font-medium text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Code className="size-4" />
            Playground
          </Link>
          <Link
            href="/problems"
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
              isActive("/problems")
                ? "font-medium text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="size-4" />
            Problems
          </Link>
          <Link
            href="/collections"
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
              isActive("/collections")
                ? "font-medium text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Lightbulb className="size-4" />
            Collections
          </Link>
        </nav>

        {/* Right side items - search + create + user */}
        <div className="flex items-center ml-auto gap-2">
          <Button variant="outline">Login</Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
