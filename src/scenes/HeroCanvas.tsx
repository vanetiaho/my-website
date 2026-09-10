import { Suspense, useRef } from 'react'
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber'
import { Float, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'

function OtterPilot(props: ThreeElements['group']) {
  const fur = '#8a5a3b'
  const furDark = '#6b432b'
  const belly = '#e0bd94'
  return (
    <group {...props}>
      {/* Body */}
      <mesh position={[0, 0, 0]} scale={[1, 0.85, 1.15]}>
        <sphereGeometry args={[0.14, 14, 14]} />
        <meshStandardMaterial color={fur} roughness={0.8} flatShading />
      </mesh>
      {/* Belly */}
      <mesh position={[0, -0.03, 0.1]} scale={[0.75, 0.65, 0.7]}>
        <sphereGeometry args={[0.13, 12, 12]} />
        <meshStandardMaterial color={belly} roughness={0.8} flatShading />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.14, 0.08]}>
        <sphereGeometry args={[0.095, 14, 14]} />
        <meshStandardMaterial color={fur} roughness={0.8} flatShading />
      </mesh>
      {/* Snout */}
      <mesh position={[0, 0.12, 0.17]} scale={[0.8, 0.65, 0.9]}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <meshStandardMaterial color={belly} roughness={0.8} flatShading />
      </mesh>
      {/* Nose */}
      <mesh position={[0, 0.135, 0.215]}>
        <sphereGeometry args={[0.018, 6, 6]} />
        <meshStandardMaterial color="#2a1c12" />
      </mesh>
      {/* Ears */}
      <mesh position={[-0.075, 0.21, 0.06]}>
        <sphereGeometry args={[0.026, 6, 6]} />
        <meshStandardMaterial color={furDark} flatShading />
      </mesh>
      <mesh position={[0.075, 0.21, 0.06]}>
        <sphereGeometry args={[0.026, 6, 6]} />
        <meshStandardMaterial color={furDark} flatShading />
      </mesh>
      {/* Arms reaching forward as if gripping the controls */}
      <mesh position={[-0.1, 0.01, 0.12]} rotation={[0.5, 0, 0.35]}>
        <capsuleGeometry args={[0.022, 0.1, 4, 6]} />
        <meshStandardMaterial color={fur} flatShading />
      </mesh>
      <mesh position={[0.1, 0.01, 0.12]} rotation={[0.5, 0, -0.35]}>
        <capsuleGeometry args={[0.022, 0.1, 4, 6]} />
        <meshStandardMaterial color={fur} flatShading />
      </mesh>
      {/* Tail trailing behind */}
      <mesh position={[0, -0.06, -0.2]} rotation={[1.35, 0, 0]}>
        <coneGeometry args={[0.055, 0.26, 8]} />
        <meshStandardMaterial color={furDark} flatShading />
      </mesh>
    </group>
  )
}

function PaperPlane(props: ThreeElements['group']) {
  return (
    <group {...props} rotation={[0.15, 2.4, -0.1]} scale={2.1}>
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
      {/* Otter pilot, riding just behind the nose */}
      <OtterPilot position={[0, 0.19, 0.35]} scale={1.35} />
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
        <PaperPlane position={[0, -0.1, 0]} />
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
