"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Cylinder,
  Box,
  Torus,
  Icosahedron,
  TorusKnot,
  Octahedron,
  Sphere,
  MeshDistortMaterial,
} from "@react-three/drei";
import * as THREE from "three";

const GlassMaterial = ({
  color,
  hovered,
}: {
  color: string;
  hovered: boolean;
}) => (
  <meshPhysicalMaterial
    roughness={0.1}
    transmission={1}
    thickness={1.5}
    color={hovered ? "#ffffff" : color}
    ior={1.5}
    clearcoat={1}
    clearcoatRoughness={0.1}
    metalness={0.1}
  />
);

export function FloatingBlob({ color = "#ffffff", ...props }: any) {
  const [hovered, setHover] = useState(false);

  return (
    <group
      {...props}
      scale={hovered ? 1.1 : 1}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <Sphere args={[1, 64, 64]}>
        <MeshDistortMaterial
          color={color}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0}
          metalness={0.1}
          distort={0.4}
          speed={2}
        />
      </Sphere>
    </group>
  );
}

export function FloatingSphere({ color = "#ffffff", ...props }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y =
      Math.sin(t * 0.5) * 0.2 + (props.position?.[1] || 0);
  });

  return (
    <group
      {...props}
      ref={groupRef}
      scale={hovered ? 1.1 : 1}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <Sphere args={[1, 64, 64]}>
        <GlassMaterial color={color} hovered={hovered} />
      </Sphere>
    </group>
  );
}

export function FloatingGeodesicSphere({ color = "#ffffff", ...props }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.x = t * 0.2;
    groupRef.current.rotation.y = t * 0.3;
    groupRef.current.position.y =
      Math.sin(t * 0.5) * 0.2 + (props.position?.[1] || 0);
  });

  return (
    <group
      {...props}
      ref={groupRef}
      scale={hovered ? 1.1 : 1}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <Icosahedron args={[1, 1]}>
        <GlassMaterial color={color} hovered={hovered} />
      </Icosahedron>
    </group>
  );
}

export function FloatingTorusKnot({ color = "#ffffff", ...props }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.x = t * 0.1;
    groupRef.current.rotation.y = t * 0.15;
    groupRef.current.position.y =
      Math.sin(t * 0.5) * 0.2 + (props.position?.[1] || 0);
  });

  return (
    <group
      {...props}
      ref={groupRef}
      scale={hovered ? 1.1 : 1}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <TorusKnot args={[0.6, 0.2, 128, 32]}>
        <GlassMaterial color={color} hovered={hovered} />
      </TorusKnot>
    </group>
  );
}

export function FloatingOctahedron({ color = "#ffffff", ...props }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.z = t * 0.2;
    groupRef.current.rotation.y = t * 0.3;
    groupRef.current.position.y =
      Math.sin(t * 0.8) * 0.15 + (props.position?.[1] || 0);
  });

  return (
    <group
      {...props}
      ref={groupRef}
      scale={hovered ? 1.1 : 1}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <Octahedron args={[0.8]}>
        <GlassMaterial color={color} hovered={hovered} />
      </Octahedron>
    </group>
  );
}

export function FloatingIcosahedron({ color = "#ffffff", ...props }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.x = t * 0.2;
    groupRef.current.rotation.y = t * 0.3;
    groupRef.current.position.y =
      Math.sin(t * 0.5) * 0.2 + (props.position?.[1] || 0);
  });

  return (
    <group
      {...props}
      ref={groupRef}
      scale={hovered ? 1.1 : 1}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <Icosahedron args={[1, 0]}>
        <GlassMaterial color={color} hovered={hovered} />
      </Icosahedron>
    </group>
  );
}

export function FloatingHourglass({ color = "#ffffff", ...props }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.x = t * 0.15;
    groupRef.current.rotation.z = t * 0.1;
    groupRef.current.position.y =
      Math.sin(t * 0.5) * 0.2 + (props.position?.[1] || 0);
  });

  return (
    <group
      {...props}
      ref={groupRef}
      scale={hovered ? 1.1 : 1}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      {/* Top Cone */}
      <Cylinder args={[0.6, 0.1, 0.6, 32]} position={[0, 0.35, 0]}>
        <GlassMaterial color={color} hovered={hovered} />
      </Cylinder>
      {/* Bottom Cone */}
      <Cylinder args={[0.1, 0.6, 0.6, 32]} position={[0, -0.35, 0]}>
        <GlassMaterial color={color} hovered={hovered} />
      </Cylinder>
      {/* Ring */}
      <Torus args={[0.4, 0.05, 16, 32]} rotation={[Math.PI / 2, 0, 0]}>
        <GlassMaterial color={color} hovered={hovered} />
      </Torus>
    </group>
  );
}

export function FloatingCalendar({ color = "#ffffff", ...props }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.x = t * 0.1;
    groupRef.current.rotation.y = t * 0.15;
    groupRef.current.position.y =
      Math.sin(t * 0.5 + 1) * 0.2 + (props.position?.[1] || 0);
  });

  return (
    <group
      {...props}
      ref={groupRef}
      scale={hovered ? 1.1 : 1}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      {/* Main Board */}
      <Box args={[1.4, 1.1, 0.1]} position={[0, 0, 0]}>
        <GlassMaterial color={color} hovered={hovered} />
      </Box>
      {/* Header */}
      <Box args={[1.4, 0.3, 0.12]} position={[0, 0.5, 0]}>
        <GlassMaterial color={color} hovered={hovered} />
      </Box>
      {/* Grid Lines (Abstract) */}
      <Box args={[1.2, 0.05, 0.12]} position={[0, 0.1, 0]}>
        <GlassMaterial color={color} hovered={hovered} />
      </Box>
      <Box args={[1.2, 0.05, 0.12]} position={[0, -0.2, 0]}>
        <GlassMaterial color={color} hovered={hovered} />
      </Box>
    </group>
  );
}

export function FloatingClock({ color = "#ffffff", ...props }: any) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHover] = useState(false);
  const hourHandRef = useRef<THREE.Group>(null);
  const minuteHandRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Float and rotate the whole clock
    groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.2;
    groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.2;
    groupRef.current.position.y =
      Math.sin(t * 0.5 + 2) * 0.2 + (props.position?.[1] || 0);

    // Rotate hands
    if (hourHandRef.current) hourHandRef.current.rotation.z = -t * 0.2;
    if (minuteHandRef.current) minuteHandRef.current.rotation.z = -t * 2;
  });

  return (
    <group
      {...props}
      ref={groupRef}
      scale={hovered ? 1.1 : 1}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      {/* Clock Face */}
      <Cylinder args={[0.8, 0.8, 0.1, 32]} rotation={[Math.PI / 2, 0, 0]}>
        <GlassMaterial color={color} hovered={hovered} />
      </Cylinder>

      {/* Rim */}
      <Torus args={[0.8, 0.05, 16, 32]} rotation={[0, 0, 0]}>
        <GlassMaterial color={color} hovered={hovered} />
      </Torus>

      {/* Hour Hand Container */}
      <group position={[0, 0, 0.06]} ref={hourHandRef}>
        <Box args={[0.08, 0.5, 0.02]} position={[0, 0.2, 0]}>
          <GlassMaterial color={color} hovered={hovered} />
        </Box>
      </group>

      {/* Minute Hand Container */}
      <group position={[0, 0, 0.06]} ref={minuteHandRef}>
        <Box args={[0.05, 0.7, 0.02]} position={[0, 0.3, 0]}>
          <GlassMaterial color={color} hovered={hovered} />
        </Box>
      </group>

      {/* Center Dot */}
      <Cylinder
        args={[0.08, 0.08, 0.04, 16]}
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 0.08]}
      >
        <GlassMaterial color={color} hovered={hovered} />
      </Cylinder>
    </group>
  );
}

// Default export for backward compatibility if needed, or just a simple shape
export default function FloatingShape(props: any) {
  return <FloatingBlob {...props} />;
}
