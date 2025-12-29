"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function SpotlightCard({
  children,
  className = "",
  disableSpotlight = false,
}: {
  children: React.ReactNode;
  className?: string;
  disableSpotlight?: boolean;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;

    const div = divRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={!disableSpotlight ? handleMouseMove : undefined}
      onFocus={!disableSpotlight ? handleFocus : undefined}
      onBlur={!disableSpotlight ? handleBlur : undefined}
      onMouseEnter={!disableSpotlight ? handleMouseEnter : undefined}
      onMouseLeave={!disableSpotlight ? handleMouseLeave : undefined}
      className={`relative overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-white/5 dark:bg-black/20 shadow-2xl h-full min-h-0 flex flex-col ${className}`}
    >
      {!disableSpotlight && (
        <div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
          style={{
            opacity,
            background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`,
          }}
        />
      )}
      <div className="relative z-10 flex-1 min-h-0 w-full">{children}</div>
    </div>
  );
}
