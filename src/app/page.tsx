"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";

const fieldNotes = [
  {
    id: 1,
    title: "Building AI Products That Actually Ship",
    excerpt: "The gap between prototype and production is where most AI projects die. Here's how to bridge it.",
    date: "Dec 28, 2025",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "The Asymmetry of Information in Product Development",
    excerpt: "Why the best product decisions come from understanding what you don't know.",
    date: "Dec 20, 2025",
    readTime: "8 min read",
  },
  {
    id: 3,
    title: "Designing for Human-AI Collaboration",
    excerpt: "Moving beyond automation to create genuinely collaborative experiences.",
    date: "Dec 15, 2025",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "The Case for Simplicity in Complex Systems",
    excerpt: "How constraints and simplicity lead to better products, not worse ones.",
    date: "Dec 10, 2025",
    readTime: "4 min read",
  },
];

export default function Home() {
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [fieldNotesOpacity, setFieldNotesOpacity] = useState(1);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center relative">
        <h1
          className="font-display text-5xl sm:text-7xl md:text-8xl tracking-wider transition-opacity duration-100"
          style={{ opacity: scrollOpacity }}
        >
          ASYMMETRY
        </h1>

        {/* Bottom - Read More and Applied AI + Product */}
        <div
          className="absolute bottom-8 left-0 right-0 transition-opacity duration-100"
          style={{ opacity: scrollOpacity }}
        >
          <div className="mx-auto px-8 flex items-end justify-between relative">
            {/* Left - Date and Time (mobile hidden, shown on sm+) */}
            <div className="hidden sm:block font-display text-sm tracking-wide text-asym-dark/60 dark:text-asym-light/60">
              <div>{currentDate}</div>
              <div>{currentTime}</div>
            </div>

            {/* Right - Description and Read More CTA */}
            <div className="hidden sm:flex flex-col items-end gap-0 max-w-xs text-right">
              
              <p className="font-display text-md tracking-wide text-asym-dark/60 dark:text-asym-light/60 leading-relaxed">
                Insights on applied AI and product from builders in the trenches and those pushing the frontier.
              </p>
              <div className="flex flex-col items-center text-asym-orange">
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-60"
                >
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg> */}
                <span className="font-mono text-sm tracking-wide cursor-pointer">
                  Discover More
                </span>
              </div>
            </div>
          </div>

          {/* Mobile: Applied AI + Product centered below */}
          {/* <div className="sm:hidden font-display text-xs tracking-wide text-center mt-8">
            <span>APPLIED AI + PRODUCT</span>
          </div> */}
        </div>
      </section>

      {/* Field Notes Section */}
      <section className="max-w-4xl mx-auto px-8 pt-16 pb-24">
        <h2 className="font-display text-4xl sm:text-5xl tracking-wide mb-4">Field Notes</h2>
        <p className="font-mono text-sm text-asym-dark/60 dark:text-asym-light/60 mb-16">
          Thoughts on AI, product, and building things that matter.
        </p>

        {/* Posts */}
        <div className="space-y-12">
          {fieldNotes.map((post) => (
            <article
              key={post.id}
              className="group cursor-pointer border-b border-asym-dark/10 dark:border-asym-light/10 pb-12"
            >
              <div className="flex items-center gap-4 mb-3">
                <span className="font-mono text-xs text-asym-dark/60 dark:text-asym-light/60">
                  {post.date}
                </span>
                <span className="font-mono text-xs text-asym-dark/40 dark:text-asym-light/40">
                  {post.readTime}
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl tracking-wide mb-3 group-hover:text-asym-orange transition-colors">
                {post.title}
              </h3>
              <p className="font-sans text-asym-dark/70 dark:text-asym-light/70 leading-relaxed">
                {post.excerpt}
              </p>
            </article>
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-16 text-center">
          <Link
            href="/field-notes"
            className="font-mono text-sm text-asym-orange hover:underline tracking-wide"
          >
            View All Field Notes
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
