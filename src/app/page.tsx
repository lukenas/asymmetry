"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import NewsletterSubscribe from "@/components/NewsletterSubscribe";

interface BeehiivPost {
  id: string;
  title: string;
  subtitle?: string;
  publish_date: number;
  web_url: string;
  word_count?: number;
}

export default function Home() {
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [loadingText, setLoadingText] = useState("");
  const [showLoader, setShowLoader] = useState(true);

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
      // Format: "7:30 PM"
      const timeString = hours.replace(/\s?(AM|PM)/i, ` ${period}`);
      setCurrentTime(timeString);

      // Format date: "DEC 30, 2025"
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
    // Enhanced cryptographic loading animation - all characters change together
    const targetText = "ASYMMETRY";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Only letters
    
    if (!showLoader) return;

    let frame = 0;
    const maxFrames = 12; // Shorter animation
    
    const interval = setInterval(() => {
      frame++;
      
      if (frame < maxFrames) {
        // All characters change randomly, with increasing chance of showing target character
        const progress = frame / maxFrames;
        const displayText = targetText.split("").map((char) => {
          const targetCharCode = char.charCodeAt(0);
          
          // As we progress, show characters closer to the target
          if (progress > 0.6 && Math.random() < (progress - 0.6) * 2.5) {
            // Show a character close to the target
            const offset = Math.floor(Math.random() * 4) - 1; // -1 to +2 offset
            const nearbyChar = String.fromCharCode(
              Math.max(65, Math.min(90, targetCharCode + offset))
            );
            return nearbyChar;
          }
          
          // Otherwise use completely random letter
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("");
        
        setLoadingText(displayText);
      } else {
        // Reveal all characters at once
        clearInterval(interval);
        setLoadingText(targetText);
      }
    }, 50); // Faster frame rate for shorter animation

    return () => clearInterval(interval);
  }, [showLoader]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      // Fade out hero over the first 40% of viewport height
      const heroOpacity = Math.max(0, 1 - (scrollY / (windowHeight * 0.4)));
      setScrollOpacity(heroOpacity);

    };

    handleScroll(); // Run once on mount
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).toUpperCase();
  };

  const getReadTime = (wordCount?: number) => {
    if (!wordCount) return "5 min read";
    const minutes = Math.ceil(wordCount / 200); // Average reading speed
    return `${minutes} min read`;
  };

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
    window.dispatchEvent(new Event("themechange"));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center relative">
        <button
          type="button"
          onClick={toggleTheme}
          className="font-sans text-4xl tracking-tight transition-opacity duration-100 cursor-pointer bg-transparent border-none text-inherit p-0"
          style={{ opacity: scrollOpacity }}
          aria-label="Toggle light and dark mode"
        >
          {showLoader && loadingText ? loadingText : "ASYMMETRY"}
        </button>

        {/* Bottom - Date/Time and description */}
        <div
          className="absolute bottom-8 left-0 right-0 transition-opacity duration-100"
          style={{ opacity: scrollOpacity }}
        >
          <div className="mx-auto px-8 flex flex-col sm:flex-row items-center sm:items-end justify-between relative gap-8 sm:gap-0">
            <div className="hidden sm:block font-mono text-xs tracking-wide text-asym-dark dark:text-asym-light">
              <div>{currentDate}</div>
              <div>{currentTime} EST</div>
            </div>

            <div className="flex flex-col items-center sm:items-end gap-0 max-w-xs text-center sm:text-right">
              <p className="font-sans text-sm text-asym-dark dark:text-asym-light leading-relaxed">
                Notes on applied AI and company building.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
