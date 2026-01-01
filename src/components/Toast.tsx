"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  isVisible: boolean;
  onClose: () => void;
}

export default function Toast({ message, type = "success", isVisible, onClose }: ToastProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      // Trigger animation after render
      setTimeout(() => setIsAnimating(true), 10);
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(() => {
          setShouldRender(false);
          onClose();
        }, 300); // Wait for fade out animation
      }, 4000); // Auto-dismiss after 4 seconds

      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      setTimeout(() => setShouldRender(false), 300);
    }
  }, [isVisible, onClose]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed bottom-8 right-8 z-50 px-6 py-4 bg-asym-dark dark:bg-asym-light text-asym-light dark:text-asym-dark font-mono text-sm tracking-wide shadow-lg border border-asym-dark/20 dark:border-asym-light/20 transform transition-all duration-300 ease-out ${
        isAnimating ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${
        type === "error" ? "border-red-500/50" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        {type === "success" && (
          <div className="w-2 h-2 rounded-full bg-asym-orange flex-shrink-0" />
        )}
        <p>{message}</p>
      </div>
    </div>
  );
}

