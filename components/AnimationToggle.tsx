"use client";

import * as React from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAnimation } from "@/components/AnimationProvider";

export function AnimationToggle({ className }: { className?: string }) {
  const { isPaused, toggleAnimation } = useAnimation();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={toggleAnimation}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-black dark:text-white transition-all hover:bg-black/10 dark:hover:bg-white/10 hover:scale-105 active:scale-95",
        className
      )}
      aria-label={isPaused ? "Play animation" : "Pause animation"}
    >
      {isPaused ? (
        <Play className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Pause className="h-[1.2rem] w-[1.2rem]" />
      )}
    </button>
  );
}
