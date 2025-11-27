"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Ensure dark class is applied to HTML element
  useEffect(() => {
    if (mounted && theme) {
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [theme, mounted]);

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-full border bg-white dark:bg-gray-800 dark:text-white"
        aria-label="Toggle theme"
      >
        <span className="text-xl">🌞</span>
      </button>
    );
  }

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    // Force apply immediately
    const root = document.documentElement;
    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 group"
      aria-label="Toggle theme"
    >
      <span className="text-xl transition-transform duration-200 group-hover:scale-110">
        {theme === "dark" ? "🌙" : "🌞"}
      </span>
    </button>
  );
}
