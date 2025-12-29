"use client";

import { useState, useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
// @ts-ignore
import * as random from "maath/random/dist/maath-random.esm";
import { useTheme } from "next-themes";
import { useAnimation } from "@/components/AnimationProvider";

const StarBackground = ({ theme, ...props }: any) => {
  const ref = useRef<any>();
  const { isPaused } = useAnimation();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(6000), { radius: 1.5 })
  );

  useFrame((state, delta) => {
    if (ref.current && !isPaused) {
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color={theme === "dark" ? "#60a5fa" : "#000000"}
          size={theme === "dark" ? 0.003 : 0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

export const StarsCanvas = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full h-auto fixed inset-0 z-[0] pointer-events-none">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <StarBackground theme={resolvedTheme} />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
};
