import React, { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { refineText } from "@/utils/OpenRouter";

function PostTextInput({ content, setContent, maxLength, isSubmitting }) {
  const [isRefining, setIsRefining] = useState(false);
  const textareaRef = useRef(null);

  const handleRefine = async () => {
    if (!content.trim()) return;
    try {
      setIsRefining(true);
      const refined = await refineText(
        content,
        "Improve grammar and make it engaging for a dev community platform"
      );
      setContent(refined.slice(0, maxLength));
    } catch (error) {
      console.error(error);
    } finally {
      setIsRefining(false);
    }
  };

  // Auto-focus on mount with slight delay for modal open and place cursor at end
  useEffect(() => {
    if (textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
        if (textareaRef.current?.value) {
          const len = textareaRef.current.value.length;
          textareaRef.current.setSelectionRange(len, len);
        }
      }, 50);
    }
  }, []);

  const charPercent = content.length / maxLength;

  return (
    <div className="relative flex flex-col w-full h-full">
      {/* Refine Button — Gemini-style circular, absolute top-right, shifted left to avoid scrollbar */}
      <button
        onClick={handleRefine}
        disabled={isRefining || isSubmitting || !content.trim()}
        title="Refine with AI"
        className={`absolute top-0 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200
          ${
            isRefining
              ? "bg-indigo-500 text-white shadow-md"
              : "bg-neutral-100 dark:bg-neutral-800 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-neutral-700 hover:ring-2 hover:ring-indigo-200 dark:hover:ring-indigo-900"
          }
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:ring-0`}
      >
        {isRefining ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          /* Sparkle / star icon inline SVG */
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" />
            <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
          </svg>
        )}
      </button>

      {/* Skeleton shimmer overlay while refining */}
      {isRefining && (
        <div className="absolute inset-0 z-10 pointer-events-none rounded-md overflow-hidden flex flex-col gap-2 p-1 pt-2">
          <div
            className="h-3.5 rounded-md bg-neutral-200 dark:bg-neutral-700 animate-pulse"
            style={{ width: "85%", animationDelay: "0ms" }}
          />
          <div
            className="h-3.5 rounded-md bg-neutral-200 dark:bg-neutral-700 animate-pulse"
            style={{ width: "65%", animationDelay: "150ms" }}
          />
          <div
            className="h-3.5 rounded-md bg-neutral-200 dark:bg-neutral-700 animate-pulse"
            style={{ width: "75%", animationDelay: "300ms" }}
          />
          <div
            className="h-3.5 rounded-md bg-neutral-200 dark:bg-neutral-700 animate-pulse"
            style={{ width: "50%", animationDelay: "450ms" }}
          />
        </div>
      )}

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value.slice(0, maxLength))}
        placeholder="Start writing..."
        disabled={isSubmitting || isRefining}
        className={`flex-1 w-full h-full pr-14 pb-6 bg-transparent text-base leading-relaxed
          placeholder:text-neutral-400 dark:placeholder:text-neutral-500
          resize-none focus:outline-none overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700 transition-all
          ${
            isRefining
              ? "text-transparent dark:text-transparent select-none"
              : "text-neutral-800 dark:text-neutral-100"
          }`}
      />

      {/* Character count */}
      {content.length > 0 && (
        <div
          className={`absolute bottom-0 right-4 text-xs transition-colors bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm px-1 rounded ${
            charPercent >= 0.95
              ? "text-red-500"
              : charPercent >= 0.75
              ? "text-amber-500"
              : "text-neutral-400 dark:text-neutral-500"
          }`}
        >
          {content.length}/{maxLength}
        </div>
      )}
    </div>
  );
}

export default PostTextInput;