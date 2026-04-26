"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import NewsletterSubscribe from "@/components/NewsletterSubscribe";
import Toast from "@/components/Toast";

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
        month: "long",
        year: "numeric",
      })
      .toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col w-full">
      <div className="flex-1 w-full max-w-3xl mx-auto px-6 sm:px-8 pt-32 pb-24">

        {/* Page header */}
        <header className="mb-12">
          <h1 className="font-sans text-2xl sm:text-3xl md:text-4xl tracking-tight">Field Notes</h1>
          <p className="font-sans text-sm mt-2 leading-relaxed">Thoughts on AI, product, & company building.</p>
        </header>

        {/* Post list */}
        {loading ? (
          <ul className="list-none p-0 m-0">
            {[...Array(6)].map((_, i) => (
              <li key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-10 py-3 animate-pulse">
                <div className="h-3 w-28 bg-asym-dark/10 dark:bg-asym-light/10 shrink-0" />
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-5 bg-asym-dark/10 dark:bg-asym-light/10 w-3/5" />
                  <div className="h-4 bg-asym-dark/10 dark:bg-asym-light/10 w-4/5" />
                </div>
              </li>
            ))}
          </ul>
        ) : posts.length > 0 ? (
          <ul className="list-none p-0 m-0">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/field-notes/${post.id}`}
                  className="group flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-10 py-3"
                >
                  <span className="font-mono text-xs tracking-wider uppercase text-asym-dark dark:text-asym-light shrink-0 sm:w-32">
                    {formatDate(post.publish_date)}
                  </span>
                  <h2 className="font-sans text-lg leading-snug min-w-0 group-hover:underline">
                    {post.title}
                  </h2>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-sans text-sm text-asym-dark dark:text-asym-light pt-6">
            No posts available at the moment.
          </p>
        )}
      </div>

      <NewsletterSubscribe
        onSuccess={(message) => setToast({ message, type: "success" })}
        onError={(message) => setToast({ message, type: "error" })}
        containerClassName="max-w-3xl mx-auto px-6 sm:px-8"
      />

      <Footer />

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
