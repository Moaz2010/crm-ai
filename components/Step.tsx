"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StepProps {
  children: ReactNode;
  direction: number;
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.5,
    rotateY: direction > 0 ? 45 : -45,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.5,
    rotateY: direction < 0 ? 45 : -45,
    rotateX: 10, // Add a slight tilt
  }),
};

export default function Step({ children, direction }: StepProps) {
  return (
    <motion.div
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.4 },
        rotateY: { duration: 0.4 },
        rotateX: { duration: 0.4 },
      }}
      className="w-full"
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}
