"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import MoodToogle from "@/components/ui/mood";

export default function Appbar() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedName = sessionStorage.getItem("fullName") || "";
    const storedEmail = sessionStorage.getItem("email") || "";
    setFullName(storedName);
    setEmail(storedEmail);
  }, []);

  return (
    <header className="flex items-center justify-between px-6 py-5 border-b bg-white dark:bg-[#0F0F0F] border-gray-100 dark:border-[#2E2E2E] sticky top-0 z-40">
      <div>
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-100">
          Admin Portal
        </h2>
        <p className="text-[#666666] text-sm">
          Monitor and manage your customer and worker’s activities at a glance
        </p>
      </div>

      <div className="flex items-center gap-4">
        <MoodToogle />
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1E1E1E]"
        >
          <Bell className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 rounded-full px-2.5 py-1 border border-gray-100 dark:border-[#2E2E2E] cursor-pointer">
          <div className="hidden md:block text-sm">
            <p className="font-semibold text-gray-800 dark:text-gray-100">
              {fullName || "Admin"}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              {email || "No email"}
            </p>
          </div>
          <Avatar>
            <AvatarImage src="/avatar.jpg" alt={fullName} />
            <AvatarFallback>
              {fullName
                ? fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "AD"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
