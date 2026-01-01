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
  const [posts, setPosts] = useState<BeehiivPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingText, setLoadingText] = useState("");
  const [showLoader, setShowLoader] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

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
    // Fetch posts from Beehiiv
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/beehiiv/posts");
        if (response.ok) {
          const data = await response.json();
          // Beehiiv API returns posts in data.data array
          console.log("POSTS: ", data)
          if (data.data && Array.isArray(data.data)) {
            // Sort by publish_date descending (newest first), then take first 4
            const sortedPosts = [...data.data].sort((a, b) => 
              (b.publish_date || 0) - (a.publish_date || 0)
            );
            setPosts(sortedPosts.slice(0, 4));
          }
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
        // Fade out loader after a brief delay
        setTimeout(() => {
          setShowLoader(false);
        }, 500);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    // Cryptographic loading animation
    const targetText = "ASYMMETRY";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    
    if (!showLoader) return;

    let iterations = 0;
    const maxIterations = 20; // Number of cycles before revealing
    
    const interval = setInterval(() => {
      if (iterations < maxIterations) {
        // Generate random characters for all positions - all letters keep changing
        const randomChars = Array.from({ length: targetText.length }, () => 
          chars[Math.floor(Math.random() * chars.length)]
        );
        
        setLoadingText(randomChars.join(""));
        iterations++;
      } else {
        // After max iterations, reveal the actual text
        clearInterval(interval);
        setLoadingText(targetText);
      }
    }, 100);

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center relative">
        <h1
          className="font-display text-5xl sm:text-7xl md:text-8xl tracking-wider transition-opacity duration-100"
          style={{ opacity: scrollOpacity }}
        >
          {showLoader && loadingText ? loadingText : "ASYMMETRY"}
        </h1>

        {/* Bottom - Read More and Applied AI + Product */}
        <div
          className="absolute bottom-8 left-0 right-0 transition-opacity duration-100"
          style={{ opacity: scrollOpacity }}
        >
          <div className="mx-auto px-8 flex flex-col sm:flex-row items-center sm:items-end justify-between relative gap-8 sm:gap-0">
            {/* Left - Date and Time (mobile hidden, shown on sm+) */}
            <div className="hidden sm:block font-display text-sm tracking-wide text-asym-dark/60 dark:text-asym-light/60">
              <div>{currentDate}</div>
              <div>{currentTime}</div>
            </div>

            {/* Description - centered on mobile, right on desktop */}
            <div className="flex flex-col items-center sm:items-end gap-0 max-w-xs text-center sm:text-right">
              <p className="font-display text-sm sm:text-md tracking-wide text-asym-dark/60 dark:text-asym-light/60 leading-relaxed">
                Insights on applied AI and product from builders in the trenches and those pushing the frontier.
              </p>
            </div>
          </div>

          {/* Centered Arrow */}
          <div className="flex justify-center mt-6 sm:absolute sm:bottom-0 sm:left-1/2 sm:-translate-x-1/2 sm:mt-0 text-asym-orange">
            <svg
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
            </svg>
          </div>
        </div>
      </section>

      {/* Field Notes Section */}
      <section className="max-w-5xl mx-auto px-8 pt-24 pb-32">
        {/* Section Header */}
        <div className="flex items-baseline justify-between mb-8 pb-6">
          <div>
            <span className="font-mono text-xs text-asym-orange tracking-widest uppercase">Latest</span>
            <h2 className="font-display text-5xl sm:text-6xl tracking-wide mt-2">Field Notes</h2>
          </div>
          <Link
            href="/field-notes"
            className="hidden sm:block font-mono text-xs text-asym-dark/50 dark:text-asym-light/50 hover:text-asym-orange transition-colors tracking-wide"
          >
            VIEW ALL →
          </Link>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-asym-dark/10 dark:border-asym-light/10">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="border-b border-r border-asym-dark/10 dark:border-asym-light/10 p-8"
              >
                <div className="animate-pulse">
                  <div className="h-4 bg-asym-dark/10 dark:bg-asym-light/10 rounded w-24 mb-4" />
                  <div className="h-6 bg-asym-dark/10 dark:bg-asym-light/10 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-asym-dark/10 dark:bg-asym-light/10 rounded w-full mb-2" />
                  <div className="h-4 bg-asym-dark/10 dark:bg-asym-light/10 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-asym-dark/10 dark:border-asym-light/10">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/field-notes/${post.id}`}
                className="group block border-b border-r border-asym-dark/10 dark:border-asym-light/10 p-8 hover:bg-asym-dark/[0.02] dark:hover:bg-asym-light/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="font-mono text-xs text-asym-dark/40 dark:text-asym-light/40 tracking-wide">
                    {formatDate(post.publish_date)}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-asym-dark/20 dark:bg-asym-light/20" />
                  <span className="font-mono text-xs text-asym-dark/40 dark:text-asym-light/40 tracking-wide">
                    {getReadTime(post.word_count)}
                  </span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl tracking-wide mb-4 group-hover:text-asym-orange transition-colors leading-tight">
                  {post.title}
                </h3>

                {post.subtitle && (
                  <p className="font-sans text-sm text-asym-dark/60 dark:text-asym-light/60 leading-relaxed">
                    {post.subtitle}
                  </p>
                )}

                <span className="inline-block mt-6 font-mono text-xs text-asym-orange opacity-0 group-hover:opacity-100 transition-opacity tracking-wide">
                  READ →
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-asym-dark/50 dark:text-asym-light/50">
            <p className="font-sans">No posts available at the moment.</p>
          </div>
        )}

        {/* Mobile View All Link */}
        <div className="mt-20 text-center sm:hidden">
          <Link
            href="/field-notes"
            className="font-mono text-xs text-asym-orange tracking-wide"
          >
            VIEW ALL FIELD NOTES →
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <NewsletterSubscribe
        onSuccess={(message) => setToast({ message, type: "success" })}
        onError={(message) => setToast({ message, type: "error" })}
      />

      <Footer />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={!!toast}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
