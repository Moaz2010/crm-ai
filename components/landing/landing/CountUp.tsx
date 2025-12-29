"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export default function CountUp({
  from = 0,
  to,
  separator = ",",
  direction = "up",
  duration = 1,
  className = "",
}: {
  from?: number;
  to: number;
  separator?: string;
  direction?: "up" | "down";
  duration?: number;
  className?: string;
}) {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min(
          (timestamp - startTime) / (duration * 1000),
          1
        );

        // Ease out quart
        const ease = 1 - Math.pow(1 - progress, 4);

        const currentCount =
          direction === "up"
            ? from + (to - from) * ease
            : from - (from - to) * ease;

        setCount(currentCount);

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);

      return () => cancelAnimationFrame(animationFrame);
    }
  }, [isInView, from, to, direction, duration]);

  const formattedCount = Math.floor(count)
    .toLocaleString()
    .replace(/,/g, separator);

  return (
    <span ref={ref} className={className}>
      {formattedCount}
    </span>
  );
}
