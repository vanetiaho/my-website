import { Suspense, useLayoutEffect, useRef } from 'react'
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber'
import { ContactShadows, Float, OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'

const MODEL_URL = '/models/sky-otter-adventure.glb'

function OtterPlaneModel(props: ThreeElements['group']) {
  const { scene } = useGLTF(MODEL_URL)

  useLayoutEffect(() => {
    if (scene.userData.tuned) return
    scene.userData.tuned = true
    // This model is a single baked/textured mesh (Meshy AI output) — its
    // own metallic-roughness texture already drives per-pixel material
    // properties correctly, so unlike the plain-color GLBs used earlier
    // this one does NOT need metalness/color overrides, just shadows.
    scene.traverse((child) => {
      if (!(child as THREE.Mesh).isMesh) return
      child.castShadow = true
      child.receiveShadow = true
    })
  }, [scene])

  return (
    <group {...props}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload(MODEL_URL)

function Rig({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!group.current || reduced) return
    // A gentle side-to-side sway centered on "facing front", instead of a
    // full 360° spin — a continuous rotation always eventually drifts the
    // otter away from front, and how far depends on how long it's been
    // since the model appeared before anyone actually looked, which isn't
    // something we can control. This sway can never wander far.
    const idleSway = Math.sin(state.clock.elapsedTime * 0.35) * 0.18
    const targetX = (state.pointer.y * Math.PI) / 24
    const targetY = (state.pointer.x * Math.PI) / 16 + idleSway
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
        <OtterPlaneModel
          position={[0, -0.05, 0]}
          rotation={[0.25, Math.PI - (100 * Math.PI) / 225, 0]}
          scale={2}
        />
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
        intensity={1.3}
        color="#f4b860"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
      >
        <orthographicCamera attach="shadow-camera" args={[-2, 2, 2, -2, 0.1, 12]} />
      </directionalLight>
      <directionalLight position={[-1.5, 2.5, 5]} intensity={1.1} color="#eef2f6" />
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
        {/* The idle sway in Rig handles the "always facing roughly front"
            motion now, so autoRotate is off — it drives the camera on its
            own clock, and a continuous spin always eventually drifts away
            from front by an amount that depends on how long it's been
            since load, which isn't something we can control. */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={!isTouch}
          autoRotate={false}
          minPolarAngle={Math.PI / 2 - 0.6}
          maxPolarAngle={Math.PI / 2 + 0.6}
        />
      </Suspense>
    </Canvas>
  )
}
