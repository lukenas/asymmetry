"use client";

import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { label: "WRITING", href: "/field-notes" },
  { label: "INTERVIEWS", href: "/interviews" },
  // { label: "TOOLING", href: "/tooling" },
];

export default function Header() {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.toLocaleString("en-US", {
        timeZone: "America/New_York",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      const period = now.toLocaleString("en-US", {
        timeZone: "America/New_York",
        hour: "numeric",
        hour12: true,
      }).slice(-2).toUpperCase();
      const timeString = hours.replace(/\s?(AM|PM)/i, ` ${period}`);
      setCurrentTime(timeString);

      const dateString = now.toLocaleDateString("en-US", {
        timeZone: "America/New_York",
        month: "short",
        day: "numeric",
        year: "numeric",
      }).toUpperCase();
      setCurrentDate(dateString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const el = mobileMenuRef.current;
      if (el && !el.contains(e.target as Node)) setMobileMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-asym-light dark:bg-asym-dark">
      <div className="relative w-full px-8 py-6 flex items-center justify-between">
        {/* Left - Logo */}
        <Link href="/">
          <Image
            src="/asym-black-logo.png"
            alt="Logo"
            width={32}
            height={32}
            priority
            className="dark:hidden"
          />
          <Image
            src="/asym-white-logo.png"
            alt="Logo"
            width={32}
            height={32}
            priority
            className="hidden dark:block"
          />
        </Link>

        {/* Center - Navigation (desktop only) */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-sans text-xs tracking-wide text-asym-dark dark:text-asym-light hover:opacity-70 transition-opacity"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right - Location on desktop, hamburger on mobile */}
        <div ref={mobileMenuRef} className="font-sans text-xs tracking-wide text-asym-dark dark:text-asym-light text-right flex items-center relative">
          <div className="hidden sm:block">NEW YORK, NEW YORK</div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className={`sm:hidden p-2 -m-2 touch-manipulation text-asym-dark dark:text-asym-light hover:opacity-70 transition-opacity ${mobileMenuOpen ? "opacity-70" : ""}`}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            <HamburgerMenuIcon className="w-5 h-5" aria-hidden />
          </button>

          {/* Mobile menu popout — same rounding/colors as CTA input */}
          {mobileMenuOpen && (
          <div
            className="sm:hidden text-left absolute -right-2 top-full mt-2 z-[100] bg-asym-light dark:bg-asym-dark border border-asym-dark/10 dark:border-asym-light/10 text-asym-dark dark:text-asym-light py-4 px-5 min-w-[100px]"
            role="dialog"
            aria-label="Menu"
          >
            <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-sans text-xs tracking-wide text-asym-dark dark:text-asym-light hover:opacity-70 transition-opacity"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          )}
        </div>
      </div>
    </header>
  );
}
