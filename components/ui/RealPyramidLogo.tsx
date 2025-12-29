"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import { Mesh } from "three";
import { useTheme } from "next-themes";

function Pyramid({ isDark }: { isDark: boolean }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotate around Y axis
      meshRef.current.rotation.y += delta * 1;
      // Slight floating wobble
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[0, Math.PI / 4, 0]}>
      {/* Radius, Height, RadialSegments (4 = square base) */}
      <coneGeometry args={[1.6, 2.2, 4]} />
      <meshStandardMaterial
        color={isDark ? "#ffffff" : "#2563eb"}
        roughness={0.2}
        metalness={0.8}
        emissive={isDark ? "#4f46e5" : "#1e40af"}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

export default function RealPyramidLogo({
  className = "h-14 w-14",
}: {
  className?: string;
}) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) return <div className={className} />;

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <div className={`${className} relative`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={2} />
        <pointLight
          position={[-5, -5, -5]}
          color={isDark ? "#a855f7" : "#60a5fa"}
          intensity={1}
        />
        <Pyramid isDark={isDark} />
      </Canvas>
    </div>
  );
}
