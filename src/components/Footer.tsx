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
    <footer className="w-full">
      <div className="w-full px-8 py-4 flex items-center justify-between">
        <div className="flex gap-x-2">
          <span className="font-sans text-xs text-asym-dark dark:text-asym-light">
            ASYMMETRY BY
          </span>
          <a className="font-sans underline text-xs text-asym-dark dark:text-asym-light" href="https://www.lukenascimento.org">
            LUKE NASCIMENTO
          </a>
        </div>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 text-asym-dark dark:text-asym-light hover:opacity-60 transition-opacity cursor-pointer"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <>
              <MoonIcon width={14} height={14} />
              {/* <span className="font-sans text-xs">DARK MODE</span> */}
            </>
          ) : (
            <>
              <SunIcon width={14} height={14} />
              {/* <span className="font-sans text-xs">LIGHT MODE</span> */}
            </>
          )}
        </button>
      </div>
    </footer>
  );
}
