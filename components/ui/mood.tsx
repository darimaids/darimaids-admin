"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className="cursor-pointer flex items-center justify-center p-2 rounded-md bg-transparent hover:bg-gray-100 dark:hover:bg-[#1E1E1E] transition-colors">
          {theme === "dark" ? (
            <Moon className="h-[1.2rem] w-[1.2rem] text-gray-200" />
          ) : theme === "light" ? (
            <Sun className="h-[1.2rem] w-[1.2rem] text-gray-800" />
          ) : (
            <>
              {/* system default */}
              <Sun className="h-[1.2rem] w-[1.2rem] text-gray-800 dark:hidden" />
              <Moon className="h-[1.2rem] w-[1.2rem] hidden dark:block text-gray-200" />
            </>
          )}
          <span className="sr-only">Toggle theme</span>
        </span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
