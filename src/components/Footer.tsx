"use client";

import { useEffect, useState } from "react";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";

export default function Footer() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <footer className="border-t border-asym-dark/10 dark:border-asym-light/10">
      <div className="mx-auto px-8 py-8 flex items-center justify-between">
        <span className="font-mono text-xs text-asym-dark/50 dark:text-asym-light/50">
          ASYMMETRY
        </span>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 text-asym-dark/50 dark:text-asym-light/50 hover:text-asym-orange transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <>
              <MoonIcon width={14} height={14} />
              <span className="font-mono text-xs">DARK MODE</span>
            </>
          ) : (
            <>
              <SunIcon width={14} height={14} />
              <span className="font-mono text-xs">LIGHT MODE</span>
            </>
          )}
        </button>
      </div>
    </footer>
  );
}
