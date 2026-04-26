"use client";

import { useState } from "react";

interface NewsletterSubscribeProps {
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
  containerClassName?: string;
}

export default function NewsletterSubscribe({ onSuccess, onError, containerClassName = "max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16" }: NewsletterSubscribeProps) {
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
    <section className="py-24 sm:py-32">
      <div className={containerClassName}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
          <div>
            <p className="font-sans text-xl tracking-tight text-asym-dark dark:text-asym-light">
              Follow Along
            </p>
            <p className="font-sans text-sm text-asym-dark dark:text-asym-light mt-3 max-w-md">
              Occasional notes. No schedule.
            </p>
          </div>
          <div className="relative">
            <div className="w-full h-[40px] min-w-[194px]">
              <form onSubmit={handleSubscribe} className="inline-block w-full h-full">
                <div className="group overflow-hidden cursor-text relative flex items-center justify-between gap-6 text-xs tracking-wide whitespace-nowrap uppercase font-mono leading-none w-full h-[40px] py-[14px] px-[12px] bg-[#EFEFE6] dark:bg-[#252525] text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)] focus-within:text-asym-dark dark:focus-within:text-asym-light transition-colors">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="YOUR@EMAIL.COM"
                    required
                    className="max-[768px]:text-sm min-w-0 flex-1 bg-transparent focus:outline-none placeholder:text-[rgba(0,0,0,0.5)] dark:placeholder:text-[rgba(255,255,255,0.5)]"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="shrink-0 disabled:cursor-not-allowed disabled:opacity-50 text-inherit hover:opacity-80 transition-opacity"
                    aria-label="Subscribe"
                  >
                    <svg
                      width="13"
                      height="12"
                      viewBox="0 0 13 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3.5 md:w-4 shrink-0 text-inherit"
                      aria-hidden
                    >
                      <path d="M13 6L0 12L3.31373 6L4.24572e-07 0L13 6Z" fill="currentColor" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

