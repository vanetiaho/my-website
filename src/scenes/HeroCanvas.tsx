import { Suspense, useRef } from 'react'
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber'
import { Float, MeshDistortMaterial, OrbitControls, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'

function SunsetSphere() {
  const materialRef = useRef<any>(null)
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.distort = 0.35 + Math.sin(state.clock.elapsedTime * 0.5) * 0.08
    }
  })
  return (
    <Sphere args={[1.5, 96, 96]}>
      <MeshDistortMaterial
        ref={materialRef}
        color="#e8934a"
        emissive="#c1502e"
        emissiveIntensity={0.35}
        roughness={0.25}
        metalness={0.1}
        distort={0.35}
        speed={1.4}
      />
    </Sphere>
  )
}

function PaperPlane(props: ThreeElements['group']) {
  return (
    <group {...props} rotation={[0.15, 2.4, -0.1]} scale={0.9}>
      {/* Fuselage */}
      <mesh position={[0, 0, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.16, 1.3, 4]} />
        <meshStandardMaterial color="#f4ead9" flatShading roughness={0.6} />
      </mesh>
      {/* Left wing */}
      <mesh position={[-0.35, -0.03, -0.15]} rotation={[0, 0.5, 0.18]}>
        <coneGeometry args={[0.05, 0.85, 3]} />
        <meshStandardMaterial color="#f4b860" flatShading roughness={0.6} />
      </mesh>
      {/* Right wing */}
      <mesh position={[0.35, -0.03, -0.15]} rotation={[0, -0.5, -0.18]}>
        <coneGeometry args={[0.05, 0.85, 3]} />
        <meshStandardMaterial color="#f4b860" flatShading roughness={0.6} />
      </mesh>
    </group>
  )
}

function Rig({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!group.current || reduced) return
    const targetX = (state.pointer.y * Math.PI) / 24
    const targetY = (state.pointer.x * Math.PI) / 16
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.05
  })
  return (
    <group ref={group}>
      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.8}>
        <SunsetSphere />
        <PaperPlane position={[1.6, 0.4, 0.8]} />
      </Float>
    </group>
  )
}

export default function HeroCanvas() {
  const reduced = useReducedMotion()

  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} color="#f2d9c2" />
      <directionalLight position={[3, 2, 4]} intensity={1.4} color="#f4b860" />
      <directionalLight position={[-4, -1, -2]} intensity={0.5} color="#4a2545" />
      <Suspense fallback={null}>
        <Rig reduced={reduced} />
      </Suspense>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={!reduced}
        autoRotateSpeed={0.6}
        minPolarAngle={Math.PI / 2 - 0.6}
        maxPolarAngle={Math.PI / 2 + 0.6}
      />
    </Canvas>
  )
}
