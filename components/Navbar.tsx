"use client";

import { UserButton } from "@clerk/nextjs";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

type NavbarProps = {
  dark: boolean;
  setDark: (dark: boolean) => void;
};

export default function Navbar({ dark, setDark }: NavbarProps) {
  return (
    <div className="w-full px-6 h-16 border-b flex items-center justify-between bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm">
      <h1 className="font-bold text-xl dark:text-gray-100">Dashboard</h1>

      <div className="flex items-center gap-4">
        {/* Switch Dark Mode */}
        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-lg border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          {dark ? (
            <SunIcon className="h-6 w-6 text-yellow-400" />
          ) : (
            <MoonIcon className="h-6 w-6 text-gray-700" />
          )}
        </button>

        {/* Menu utilisateur Clerk */}
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </div>
  );
}
