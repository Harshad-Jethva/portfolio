"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ── Suppress the THREE.Clock deprecation that originates inside
//    @react-three/fiber v9's internal loop.  The library still works
//    correctly; this is purely a console-noise issue until r3f ships
//    a patch that uses THREE.Timer instead.
if (typeof window !== "undefined") {
  const _warn = THREE.WebGLRenderer
    ? (() => {
        // Patch warn only once
        const originalWarn = console.warn.bind(console);
        let patched = false;
        if (!patched) {
          patched = true;
          console.warn = (...args) => {
            if (
              typeof args[0] === "string" &&
              args[0].includes("THREE.Clock") &&
              args[0].includes("deprecated")
            ) {
              return; // silence r3f's internal Clock deprecation
            }
            originalWarn(...args);
          };
        }
        return originalWarn;
      })()
    : null;
}

const count = 1500;
const positions = new Float32Array(count * 3);
for (let i = 0; i < count; i++) {
  positions[i * 3]     = (Math.random() - 0.5) * 12;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
}

function Particles() {
  const pointsRef = useRef();

  const timeRef = useRef(0);

  useFrame((state, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;

    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = t * 0.035;
    pointsRef.current.rotation.x = t * 0.014;

    const p = state.pointer;
    pointsRef.current.position.x = THREE.MathUtils.lerp(
      pointsRef.current.position.x,
      p.x * 0.4,
      0.04
    );
    pointsRef.current.position.y = THREE.MathUtils.lerp(
      pointsRef.current.position.y,
      p.y * 0.4,
      0.04
    );
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.012}
        color="#f0ece4"
        sizeAttenuation
        transparent
        opacity={0.22}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function Background3D() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%", height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 70 }}
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 1.5]}
      >
        <Particles />
      </Canvas>
    </div>
  );
}
