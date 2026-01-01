"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "FIELD NOTES", href: "/field-notes" },
  { label: "INTERVIEWS", href: "/interviews" },
  { label: "TOOLING", href: "/tooling" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const pathname = usePathname();
  const isHomePage = pathname === "/";

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
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const showNav = isHomePage ? isScrolled : true;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-asym-light/80 dark:bg-asym-dark/80 backdrop-blur-sm">
      <div className="mx-auto px-8 py-6 flex items-center justify-between relative">
        {/* Left - Logo */}
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo"
            width={32}
            height={32}
            priority
            className="dark:hidden"
          />
          <Image
            src="/logo-dark.png"
            alt="Logo"
            width={32}
            height={32}
            priority
            className="hidden dark:block"
          />
        </Link>

        {/* Center - Navigation (absolutely positioned for true center) */}
        <nav
          className={`absolute left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-8 transition-all duration-300 ${
            showNav ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-sm tracking-wide text-asym-dark dark:text-asym-light hover:text-asym-orange transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side - Location on desktop, Date/Time on mobile */}
        <div
          className={`font-display text-xs tracking-wide text-asym-dark/60 dark:text-asym-light/60 text-right transition-all duration-300`}
        >
          <div className="hidden sm:block">NEW YORK, NEW YORK</div>
          <div className="sm:hidden">{currentDate}</div>
          <div className="sm:hidden">{currentTime}</div>
        </div>
      </div>
    </header>
  );
}
