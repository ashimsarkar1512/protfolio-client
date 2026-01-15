"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import { useRef, useMemo } from "react"
import type * as THREE from "three"

function Particles() {
  const ref = useRef<THREE.Points>(null)

  // Generate positions only once
  const positions = useMemo(() => {
    const array = new Float32Array(4000 * 3)
    for (let i = 0; i < array.length; i++) {
      array[i] = (Math.random() - 0.5) * 20
    }
    return array
  }, [])

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.0004
      ref.current.rotation.x += 0.0002
    }
  })

  return (
    <Points ref={ref} positions={positions} stride={3}>
      <PointMaterial transparent color="#9ca3af" size={0.02} depthWrite={false} />
    </Points>
  )
}

export default function GlobalBackground() {
  return (
    <div className="absolute inset-0 -z-20 pointer-events-none w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6] }}
        gl={{ alpha: false }}
        onCreated={({ gl }) => gl.setClearColor("#000000")}
        style={{ width: "100%", height: "100%" }}
      >
        <Particles />
      </Canvas>
    </div>
  )
}
