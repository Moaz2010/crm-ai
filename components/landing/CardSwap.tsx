"use client";
import { useState, useEffect, Children, ReactNode } from "react";
import { motion } from "framer-motion";

interface CardSwapProps {
  children: ReactNode;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
}

export const Card = ({ children }: { children: ReactNode }) => {
  return <div className="w-full h-full flex flex-col">{children}</div>;
};

export default function CardSwap({
  children,
  verticalDistance = 40,
  delay = 5000,
  pauseOnHover = false,
}: CardSwapProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const cards = Children.toArray(children);

  useEffect(() => {
    if (pauseOnHover && isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, delay);

    return () => clearInterval(interval);
  }, [cards.length, delay, isHovered, pauseOnHover]);

  return (
    <div
      className="relative w-full h-full flex items-center justify-center perspective-1000"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full max-w-3xl h-[400px] md:h-[500px]">
        {cards.map((card, index) => {
          // Calculate position relative to current index
          const position = (index - currentIndex + cards.length) % cards.length;

          // We only want to render the active card and the next few in the stack
          if (position > 2 && position !== cards.length - 1) return null;

          // Determine z-index and transforms
          const isActive = position === 0;
          const isLast = position === cards.length - 1; // The one leaving/swapping to back

          let zIndex = cards.length - position;
          let y = -position * verticalDistance; // Negative to stack upwards
          let x = position * (verticalDistance * 0.5); // Slight offset to the right
          let scale = 1 - position * 0.05;
          let opacity = 1 - position * 0.2;
          let rotateX = 0;

          // Special animation for the card moving to the back
          if (isLast) {
            zIndex = 0;
            y = verticalDistance * 2; // Move down and away
            x = 0;
            scale = 0.9;
            opacity = 0;
          }

          return (
            <motion.div
              key={index}
              className="absolute inset-0 w-full h-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0a0a0a] shadow-2xl overflow-hidden"
              initial={false}
              animate={{
                y,
                x,
                scale,
                opacity,
                zIndex,
                rotateX,
              }}
              transition={{
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1], // Smooth cubic-bezier
              }}
              style={{
                transformOrigin: "bottom center",
                boxShadow: isActive
                  ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                  : "none",
              }}
            >
              {/* Gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/5 dark:from-white/5 to-transparent pointer-events-none" />

              {/* Content */}
              <div className="relative z-10 h-full">{card}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
