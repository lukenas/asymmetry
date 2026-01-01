"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";

interface BeehiivPost {
  id: string;
  title: string;
  subtitle?: string;
  publish_date: number;
  web_url: string;
  word_count?: number;
}

export default function FieldNotes() {
  const [posts, setPosts] = useState<BeehiivPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/beehiiv/posts");
        if (response.ok) {
          const data = await response.json();
          if (data.data && Array.isArray(data.data)) {
            setPosts(data.data);
          }
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).toUpperCase();
  };

  const getReadTime = (wordCount?: number) => {
    if (!wordCount) return "5 min read";
    const minutes = Math.ceil(wordCount / 200);
    return `${minutes} min read`;
  };
  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-8 pt-32 pb-24">
        {/* Page Header */}
        <div className="pb-8 mb-8">
          <span className="font-mono text-xs text-asym-orange tracking-widest uppercase">Archive</span>
          <h1 className="font-display text-5xl sm:text-7xl tracking-wide mt-2">Field Notes</h1>
          <p className="font-mono text-sm text-asym-dark/50 dark:text-asym-light/50 mt-6 max-w-lg">
            Thoughts on AI, product, and building things that matter.
          </p>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-asym-dark/10 dark:border-asym-light/10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
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

                <h2 className="font-display text-xl sm:text-2xl tracking-wide mb-4 group-hover:text-asym-orange transition-colors leading-tight">
                  {post.title}
                </h2>

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
      </main>

      <Footer />
    </div>
  );
}
