"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-gray-800">
      <motion.div
        className="h-full bg-blue-500"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  );
}
