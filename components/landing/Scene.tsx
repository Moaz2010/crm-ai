"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import FloatingShape from "./FloatingShape";
import { Suspense } from "react";

export default function Scene() {
  return (
    <div className="absolute inset-0 z-0 h-full w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <FloatingShape position={[2, 0, 0]} color="#1e3a8a" />
          <FloatingShape position={[-2, -1, -2]} scale={0.5} color="#1d4ed8" />
          <Environment preset="city" />
          {/* <OrbitControls enableZoom={false} /> */}
        </Suspense>
      </Canvas>
    </div>
  );
}
