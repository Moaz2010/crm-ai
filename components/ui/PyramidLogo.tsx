"use client";

import { motion } from "framer-motion";

export default function PyramidLogo() {
  return (
    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-900/20 relative overflow-hidden">
      <div className="flex items-end justify-center -space-x-1 mb-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[12px] border-l-transparent border-r-transparent border-b-white/90"
            animate={{
              y: [0, -4, 0],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
