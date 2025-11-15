"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Users, Calendar, DollarSign, LogOut, Menu, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import { useAdminStore } from "@/store/useAdminStore";

const navItems = [
  { name: "Home", icon: Home, href: "/dashboard/overview" },
  { name: "Bookings", icon: Calendar, href: "/dashboard/bookings" },
  { name: "Cleaners", icon: Users, href: "/dashboard/cleaners" },
  { name: "Disburements", icon: DollarSign, href: "/dashboard/disbursement" },
  { name: "Service Catalog", icon: List, href: "/dashboard/servicecatalog" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { clearAdmin } = useAdminStore();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.clear();
    clearAdmin();
    router.push("/");
  };

  const SidebarContent = () => (
    <nav className="flex flex-col gap-3 p-4 h-full w-full">
      <div className="flex items-center justify-center gap-2 mt-4 mb-6">
        <Image
          src="/darimaids_dashboard.svg"
          alt="Darimaids Logo"
          width={120}
          height={54}
        />
      </div>

      {navItems.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link key={item.name} href={item.href}>
            <Button
              variant={active ? "default" : "ghost"}
              className={`w-full justify-start gap-2 transition-colors py-4 ${
                active
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#1E1E1E]"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Button>
          </Link>
        );
      })}

      <Button
        onClick={handleLogout}
        variant="ghost"
        className="mt-auto text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 justify-start gap-2"
      >
        <LogOut size={18} />
        Logout
      </Button>
    </nav>
  );

  return (
    <>
      <aside className="hidden md:flex md:w-60 h-screen border-r bg-white dark:bg-[#0F0F0F] border-gray-100 dark:border-[#2E2E2E]">
        <SidebarContent />
      </aside>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="p-0 w-64 bg-white dark:bg-[#0F0F0F] border-r dark:border-gray-800"
        >
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
