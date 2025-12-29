"use client";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import RealPyramidLogo from "@/components/ui/RealPyramidLogo";
import {
  FloatingTorusKnot,
  FloatingOctahedron,
  FloatingIcosahedron,
} from "@/components/landing/FloatingShape";
import { Suspense, useMemo } from "react";
import { motion } from "framer-motion";

const colors = [
  "#a5f3fc", // cyan-200
  "#c4b5fd", // violet-300
  "#e9d5ff", // purple-200
  "#fca5a5", // red-300
  "#86efac", // green-300
  "#fde047", // yellow-300
  "#93c5fd", // blue-300
  "#f9a8d4", // pink-300
];

export default function AuthSide({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  const [c1, c2, c3] = useMemo(() => {
    const shuffled = [...colors].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-transparent p-8 lg:p-12">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-20 -top-20 h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-[80px]" />
        <div className="absolute -bottom-20 -right-20 h-[300px] w-[300px] rounded-full bg-purple-500/10 blur-[80px]" />
      </div>

      {/* 3D Scene */}
      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />

            {/* Main Creative Shape */}
            <FloatingTorusKnot position={[0, 0, 0]} scale={1.2} color={c1} />

            {/* Floating Elements */}
            <FloatingOctahedron
              position={[-1.8, 1.5, -1]}
              scale={0.6}
              color={c2}
            />
            <FloatingIcosahedron
              position={[1.8, -1.5, -0.5]}
              scale={0.5}
              color={c3}
            />

            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-20 flex h-full flex-col justify-between pointer-events-none">
        <div className="flex items-center gap-2">
          <RealPyramidLogo className="h-10 w-10" />
          <span className="text-xl font-bold text-black dark:text-white">
            LeadCatch
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h2 className="mb-4 text-3xl font-bold leading-tight text-black dark:text-white">
            {title}
          </h2>
          <p className="text-base text-zinc-600 dark:text-zinc-400">
            {subtitle}
          </p>
        </motion.div>

        <div className="flex gap-4 text-xs text-zinc-500">
          <span>© 2025 LeadCatch Inc.</span>
        </div>
      </div>
    </div>
  );
}
