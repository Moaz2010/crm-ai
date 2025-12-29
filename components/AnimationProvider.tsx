"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type AnimationContextType = {
  isPaused: boolean;
  toggleAnimation: () => void;
};

const AnimationContext = createContext<AnimationContextType | undefined>(
  undefined
);

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [isPaused, setIsPaused] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Optionally load from local storage here if we want persistence across reloads
    const saved = localStorage.getItem("animation-paused");
    if (saved) {
      setIsPaused(saved === "true");
    }
  }, []);

  const toggleAnimation = () => {
    const newState = !isPaused;
    setIsPaused(newState);
    localStorage.setItem("animation-paused", String(newState));
  };

  return (
    <AnimationContext.Provider value={{ isPaused, toggleAnimation }}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation() {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error("useAnimation must be used within an AnimationProvider");
  }
  return context;
}
