import { Suspense, useLayoutEffect, useRef } from 'react'
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber'
import { ContactShadows, Float, OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'

const MODEL_URL = '/models/otter-plane.glb'

function OtterPlaneModel(props: ThreeElements['group']) {
  const { scene } = useGLTF(MODEL_URL)

  useLayoutEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  return (
    <group {...props}>
      {/* The source model is authored Z-up (Blender's convention); rotate
          -90° about X to bring it into three.js's Y-up world while
          keeping the nose pointed along +X. */}
      <primitive object={scene} rotation={[-Math.PI / 2, 0, 0]} />
    </group>
  )
}

useGLTF.preload(MODEL_URL)

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
      <Float
        speed={reduced ? 0 : 1.6}
        rotationIntensity={reduced ? 0 : 0.3}
        floatIntensity={reduced ? 0 : 0.6}
      >
        <OtterPlaneModel position={[0, -0.05, 0]} rotation={[0.04, -0.35, -0.03]} scale={0.52} />
      </Float>
    </group>
  )
}

export default function HeroCanvas() {
  const reduced = useReducedMotion()
  const isTouch = useIsTouchDevice()

  return (
    <Canvas
      shadows
      camera={{ position: [0, 0.15, 5.4], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: 'pan-y' }}
    >
      <ambientLight intensity={0.55} color="#f2d9c2" />
      <directionalLight
        position={[3, 3, 4]}
        intensity={1.6}
        color="#f4b860"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
      >
        <orthographicCamera attach="shadow-camera" args={[-2, 2, 2, -2, 0.1, 12]} />
      </directionalLight>
      <directionalLight position={[-4, 1.5, -2]} intensity={0.55} color="#c1502e" />
      <directionalLight position={[0, -2, 2]} intensity={0.25} color="#4a2545" />
      <Suspense fallback={null}>
        <Rig reduced={reduced} />
        <ContactShadows
          position={[0, -1.15, 0]}
          opacity={0.45}
          scale={5}
          blur={2.6}
          far={1.6}
          color="#1a0f0a"
        />
      </Suspense>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={!isTouch}
        autoRotate={!reduced}
        autoRotateSpeed={0.6}
        minPolarAngle={Math.PI / 2 - 0.6}
        maxPolarAngle={Math.PI / 2 + 0.6}
      />
    </Canvas>
  )
}
