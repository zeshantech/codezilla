"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, Sun, Moon, Laptop } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";

export function AppFooter() {
  const { theme, setTheme } = useTheme();

  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4 md:h-16">
        <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
          <Link href="/" className="font-bold text-lg">
            LogicLab
          </Link>
          <Separator
            orientation="vertical"
            className="hidden md:inline-flex h-4"
          />
          <div className="text-center md:text-left text-muted-foreground">
            &copy; {new Date().getFullYear()} LogicLab. All rights reserved.
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
          <div className="rounded border overflow-hidden flex gap-1 mr-4">
            <Sun
              className={`p-1 ${theme === "light" ? "bg-muted" : ""}`}
              onClick={() => setTheme("light")}
            />
            <Moon
              className={`p-1 ${theme === "dark" ? "bg-muted" : ""}`}
              onClick={() => setTheme("dark")}
            />
            <Laptop
              className={`p-1 ${theme === "system" ? "bg-muted" : ""}`}
              onClick={() => setTheme("system")}
            />
          </div>
          <nav className="flex items-center space-x-4 text-muted-foreground">
            <Link href="/about" className="hover:text-foreground">
              About
            </Link>
            <Link href="/pricing" className="hover:text-foreground">
              Pricing
            </Link>
            <Link href="/blog" className="hover:text-foreground">
              Blog
            </Link>
            <Link href="/contact" className="hover:text-foreground">
              Contact
            </Link>
          </nav>
          <Separator
            orientation="vertical"
            className="hidden md:inline-flex h-4"
          />
          <div className="flex items-center space-x-3">
            <Link href="https://github.com" target="_blank">
              <Github className="size-5" />
            </Link>
            <Link href="https://twitter.com" target="_blank">
              <Twitter className="size-5" />
            </Link>
            <Link href="https://linkedin.com" target="_blank">
              <Linkedin className="size-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default AppFooter;
