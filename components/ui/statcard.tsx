"use client";

import Image from "next/image";
import React from "react";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStatCardProps {
  title: string;
  value?: string | number;
  iconSrc: string;
  growth?: string;
  iconBg: string;
  iconBorder: string;
  darkIconBg: string;
  darkIconBorder: string;
  isLoading?: boolean;
}

const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  title,
  value,
  iconSrc,
  growth,
  iconBg,
  iconBorder,
  darkIconBg,
  darkIconBorder,
  isLoading = false,
}) => {
  const { theme } = useTheme();

  // Handle loading skeleton
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#f6f2ff] dark:border-[#2E2E2E] p-4.5 space-y-3 transition min-h-[126px]">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="w-10 h-10 rounded-sm" />
        </div>
        <Skeleton className="h-3 w-32" />
      </div>
    );
  }

  // Determine color for growth
  const growthColor = growth?.startsWith("-")
    ? "text-red-500"
    : "text-[#059669]";

  // Determine icon background & border dynamically based on theme
  const currentBg = theme === "dark" ? darkIconBg : iconBg;
  const currentBorder = theme === "dark" ? darkIconBorder : iconBorder;

  return (
    <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#f6f2ff] dark:border-[#2E2E2E] flex flex-col justify-between h-full min-h-[126px] transition">
      <div className="border-b border-[#f6f2ff] dark:border-[#2E2E2E] py-4 rounded-t-xl flex justify-between items-center px-4.5">
        <div>
          <p className="text-[#666] dark:text-[#A3A3A3] text-sm">{title}</p>
          <h1 className="font-semibold text-2xl dark:text-white">
            {value ?? 0}
          </h1>
        </div>

        <div
          className="p-2 rounded-sm w-10 h-10 flex items-center justify-center border-[0.1px] transition"
          style={{
            backgroundColor: currentBg,
            borderColor: currentBorder,
          }}
        >
          <Image
            src={iconSrc}
            alt={`${title} icon`}
            width={28}
            height={28}
            className="dark:opacity-90"
          />
        </div>
      </div>

      <div className="px-4.5 h-full py-2.5">
        <p className="text-xs">
          <span className={growthColor}>{growth ?? "0%"}</span> from last week
        </p>
      </div>
    </div>
  );
};

export default DashboardStatCard;
