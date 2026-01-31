"use client";

import { useState } from "react";

interface NewsletterSubscribeProps {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

export default function NewsletterSubscribe({ onSuccess, onError }: NewsletterSubscribeProps) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/beehiiv/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setEmail("");
        onSuccess?.("Thanks! Check your email to confirm.");
      } else {
        const error = await response.json();
        console.error("Subscription error:", error);
        onError?.(error.error || "Failed to subscribe. Please try again.");
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      onError?.("Failed to subscribe. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-2xl mx-auto px-8">
        <div className="relative p-12">
          {/* Corner borders only */}
          <div className="absolute top-0 left-0 w-16 h-px bg-asym-dark/10 dark:bg-asym-light/10" />
          <div className="absolute top-0 right-0 w-16 h-px bg-asym-dark/10 dark:bg-asym-light/10" />
          <div className="absolute bottom-0 left-0 w-16 h-px bg-asym-dark/10 dark:bg-asym-light/10" />
          <div className="absolute bottom-0 right-0 w-16 h-px bg-asym-dark/10 dark:bg-asym-light/10" />
          <div className="absolute top-0 left-0 w-px h-16 bg-asym-dark/10 dark:bg-asym-light/10" />
          <div className="absolute top-0 right-0 w-px h-16 bg-asym-dark/10 dark:bg-asym-light/10" />
          <div className="absolute bottom-0 left-0 w-px h-16 bg-asym-dark/10 dark:bg-asym-light/10" />
          <div className="absolute bottom-0 right-0 w-px h-16 bg-asym-dark/10 dark:bg-asym-light/10" />
          
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-asym-orange" />
              <p className="font-display text-lg sm:text-xl tracking-wide text-asym-dark/70 dark:text-asym-light/70">
                Join the community
              </p>
            </div>
            <p className="font-sans text-sm text-asym-dark/50 dark:text-asym-light/50">
              Weekly insights on applied AI and product from builders in the trenches.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 bg-transparent border border-asym-dark/20 dark:border-asym-light/20 rounded-none font-mono text-sm tracking-wide text-asym-dark dark:text-asym-light placeholder:text-asym-dark/40 dark:placeholder:text-asym-light/40 focus:outline-none focus:border-asym-dark/40 dark:focus:border-asym-light/40 transition-colors"
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-asym-dark cursor-pointer dark:bg-asym-light text-asym-light dark:text-asym-dark font-mono text-sm tracking-wide hover:bg-asym-dark/90 dark:hover:bg-asym-light/90 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "JOINING..." : "JOIN"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

