"use client";
import React, { useRef, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { motion, MotionConfig } from "framer-motion";
import { useRouter } from "next/navigation";

import useClickOutside from "@/hooks/use-click-outside";

const transition = {
  type: "spring",
  bounce: 0.1,
  duration: 0.2,
};

function Button({
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  return (
    <button
      className="relative flex h-9 w-9 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

export function ToolbarDynamic() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => {
    setIsOpen(false);
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsOpen(false);

    const form = e.currentTarget;
    const q = (form.q as HTMLInputElement).value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <MotionConfig transition={transition}>
      <div className="" ref={containerRef}>
        <div className="h-full w-fit rounded-xl bg-transparent">
          <motion.div
            animate={{
              width: isOpen ? "300px" : "98px",
            }}
            initial={false}
          >
            <div className="overflow-hidden">
              {!isOpen ? (
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setIsOpen(true)}
                    ariaLabel="Search notes"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Button onClick={() => setIsOpen(false)} ariaLabel="Back">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <form onSubmit={handleSubmit} method="GET" action="/search">
                    <input
                      name="q"
                      className="h-9 w-full rounded-lg border border-zinc-950/10 bg-transparent p-2 text-sm text-zinc-900 placeholder-zinc-500 focus:outline-none"
                      autoFocus
                      placeholder="Search for people"
                    />
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </MotionConfig>
  );
}
