"use client";

/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";

interface LogoItem {
  node?: React.ReactNode;
  src?: string;
  alt?: string;
  title?: string;
  href?: string;
}

interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number; // Duration in seconds for one cycle, or relative speed
  direction?: "left" | "right" | "up" | "down";
  logoHeight?: number;
  gap?: number;
  hoverSpeed?: number; // If 0, pauses. If > 0, changes speed.
  scaleOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  ariaLabel?: string;
  className?: string;
}

export default function LogoLoop({
  logos,
  speed = 40,
  direction = "left",
  logoHeight = 48,
  gap = 40,
  hoverSpeed = 0,
  scaleOnHover = false,
  fadeOut = false,
  fadeOutColor = "#ffffff",
  ariaLabel,
  className,
}: LogoLoopProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    function addAnimation() {
      if (containerRef.current && scrollerRef.current) {
        const scrollerContent = Array.from(scrollerRef.current.children);

        // Clone items to ensure seamless looping
        // We might need multiple clones if the content is short
        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true);
          if (scrollerRef.current) {
            scrollerRef.current.appendChild(duplicatedItem);
          }
        });
        // Double clone for safety on wide screens
        scrollerContent.forEach((item) => {
          const duplicatedItem = item.cloneNode(true);
          if (scrollerRef.current) {
            scrollerRef.current.appendChild(duplicatedItem);
          }
        });

        setStart(true);
      }
    }

    addAnimation();
  }, []);

  const isVertical = direction === "up" || direction === "down";
  const isReverse = direction === "right" || direction === "down";

  const animationDirection = isReverse ? "reverse" : "normal";
  const animationDuration = `${Math.max(10, 2000 / speed)}s`; // Heuristic for speed to duration

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 overflow-hidden",
        isVertical ? "h-full flex flex-col" : "max-w-full",
        fadeOut &&
          !isVertical &&
          "[mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        fadeOut &&
          isVertical &&
          "[mask-image:linear-gradient(to_bottom,transparent,white_20%,white_80%,transparent)]",
        className
      )}
      aria-label={ariaLabel}
      style={{
        // @ts-ignore
        "--animation-duration": animationDuration,
        "--animation-direction": animationDirection,
      }}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex shrink-0 gap-4 py-4 w-max flex-nowrap",
          start && "animate-scroll",
          isVertical ? "flex-col h-max w-full" : "flex-row",
          hoverSpeed === 0 && "hover:[animation-play-state:paused]"
        )}
        style={{
          gap: `${gap}px`,
        }}
      >
        {logos.map((logo, idx) => (
          <li
            key={idx}
            className={cn(
              "relative flex items-center justify-center flex-shrink-0 transition-transform duration-300",
              scaleOnHover && "hover:scale-110"
            )}
            style={{ height: isVertical ? "auto" : `${logoHeight}px` }}
          >
            {logo.href ? (
              <Link
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                {logo.node ? (
                  <div style={{ fontSize: `${logoHeight}px` }}>{logo.node}</div>
                ) : (
                  <img
                    src={logo.src}
                    alt={logo.alt || logo.title || "Logo"}
                    style={{
                      height: `${logoHeight}px`,
                      width: "auto",
                      objectFit: "contain",
                    }}
                  />
                )}
              </Link>
            ) : (
              <div className="flex items-center justify-center text-gray-500 dark:text-gray-400">
                {logo.node ? (
                  <div style={{ fontSize: `${logoHeight}px` }}>{logo.node}</div>
                ) : (
                  <img
                    src={logo.src}
                    alt={logo.alt || logo.title || "Logo"}
                    style={{
                      height: `${logoHeight}px`,
                      width: "auto",
                      objectFit: "contain",
                    }}
                  />
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
