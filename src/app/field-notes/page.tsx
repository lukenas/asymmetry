"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import NewsletterSubscribe from "@/components/NewsletterSubscribe";
import Toast from "@/components/Toast";

/**
 * Swiss principles: type scale 1.25 from 16px, 8px spacing grid.
 * Articles in responsive grid: 1 col → 2 → 3 → 4 as screen grows.
 */

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
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/beehiiv/posts");
        if (response.ok) {
          const data = await response.json();
          if (data.data && Array.isArray(data.data)) {
            const sortedPosts = [...data.data].sort((a, b) =>
              (b.publish_date || 0) - (a.publish_date || 0)
            );
            setPosts(sortedPosts);
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
    return date
      .toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      .toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col w-full">
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 pt-32 pb-24 box-border">
        <div className="grid grid-cols-12 gap-x-8 gap-y-8">
          {/* Row 1: overline + title + lead */}
          <header className="col-span-12 space-y-2 mb-0">
            <span className="font-mono text-[0.8rem] text-asym-dark/60 dark:text-asym-light/60 tracking-wider uppercase block">
              Archive
            </span>
            <h1 className="font-display text-[1.95rem] md:text-[2.44rem] tracking-tight leading-[1.1]">
              Field Notes
            </h1>
            <p className="font-display text-[1rem] text-asym-dark/50 dark:text-asym-light/50 tracking-wide pt-2">
              Thoughts on AI, product, & company building.
            </p>
          </header>

          {/* Articles: 3-col grid on md+, shrinks to 2 → 1 on smaller screens */}
          {loading ? (
            <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2 min-w-0">
                  <div className="h-3 w-20 bg-asym-dark/10 dark:bg-asym-light/10 animate-pulse rounded" />
                  <div className="h-5 bg-asym-dark/10 dark:bg-asym-light/10 animate-pulse rounded w-4/5" />
                  <div className="h-4 bg-asym-dark/10 dark:bg-asym-light/10 animate-pulse rounded w-full" />
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <ul className="col-span-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-8 list-none p-0 m-0">
              {posts.map((post) => (
                <li key={post.id} className="min-w-0">
                  <Link
                    href={`/field-notes/${post.id}`}
                    className="block space-y-2 py-2 pl-4 -ml-4 transition-colors group"
                  >
                    <p className="font-mono text-[0.8rem] text-asym-dark/50 dark:text-asym-light/50 tracking-wider uppercase group-hover:text-asym-dark dark:group-hover:text-asym-light transition-colors">
                      {formatDate(post.publish_date)}
                    </p>
                    <h2 className="font-display text-[1.25rem] tracking-tight leading-[1.2] group-hover:text-asym-dark dark:group-hover:text-asym-light transition-colors">
                      {post.title}
                    </h2>
                    {post.subtitle && (
                      <p className="font-sans text-[1rem] text-asym-dark/60 dark:text-asym-light/60 leading-[1.5] line-clamp-2">
                        {post.subtitle}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="col-span-12 py-12">
              <p className="font-sans text-[1rem] text-asym-dark/50 dark:text-asym-light/50">
                No posts available at the moment.
              </p>
            </div>
          )}
        </div>
      </div>

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
