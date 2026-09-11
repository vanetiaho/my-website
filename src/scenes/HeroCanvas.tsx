import { Suspense, useRef } from 'react'
import { Canvas, useFrame, type ThreeElements } from '@react-three/fiber'
import { ContactShadows, Float, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useIsTouchDevice } from '@/hooks/useIsTouchDevice'

const FUR = '#9a6b45'
const FUR_DARK = '#7a4f30'
const BELLY = '#f0d9b8'
const NOSE = '#2a1c12'
const GOGGLE_FRAME = '#3a2a1e'
const GOGGLE_LENS = '#f4b860'
const JET_BODY = '#f5f1e8'
const JET_STRIPE = '#3a7ca8'
const JET_DARK = '#2a3038'

function Eye(props: ThreeElements['group']) {
  return (
    <group {...props}>
      <mesh castShadow>
        <sphereGeometry args={[0.026, 12, 12]} />
        <meshStandardMaterial color="#1a120c" roughness={0.15} metalness={0.1} />
      </mesh>
      <mesh position={[0.009, 0.01, 0.02]}>
        <sphereGeometry args={[0.007, 6, 6]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}

function Goggles(props: ThreeElements['group']) {
  return (
    <group {...props}>
      {/* Strap around the head */}
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.14, 0.012, 8, 20, Math.PI]} />
        <meshStandardMaterial color={GOGGLE_FRAME} roughness={0.5} />
      </mesh>
      {/* Left lens */}
      <group position={[-0.075, 0, 0.11]}>
        <mesh castShadow>
          <torusGeometry args={[0.05, 0.015, 8, 16]} />
          <meshStandardMaterial color={GOGGLE_FRAME} roughness={0.4} metalness={0.2} />
        </mesh>
        <mesh>
          <circleGeometry args={[0.045, 16]} />
          <meshStandardMaterial
            color={GOGGLE_LENS}
            roughness={0.15}
            metalness={0.3}
            emissive={GOGGLE_LENS}
            emissiveIntensity={0.25}
          />
        </mesh>
      </group>
      {/* Right lens */}
      <group position={[0.075, 0, 0.11]}>
        <mesh castShadow>
          <torusGeometry args={[0.05, 0.015, 8, 16]} />
          <meshStandardMaterial color={GOGGLE_FRAME} roughness={0.4} metalness={0.2} />
        </mesh>
        <mesh>
          <circleGeometry args={[0.045, 16]} />
          <meshStandardMaterial
            color={GOGGLE_LENS}
            roughness={0.15}
            metalness={0.3}
            emissive={GOGGLE_LENS}
            emissiveIntensity={0.25}
          />
        </mesh>
      </group>
    </group>
  )
}

// Otter's local forward axis is +Z (muzzle points +Z), belly down along -Y.
// It's designed lying flat/prone so it can be laid directly along the top
// of the jet's fuselage, front legs draped over the sides.
function OtterPilot(props: ThreeElements['group']) {
  return (
    <group {...props}>
      {/* Long, flattened body draped over the fuselage */}
      <mesh position={[0, 0, -0.02]} scale={[0.95, 0.72, 1.55]} castShadow receiveShadow>
        <sphereGeometry args={[0.16, 22, 22]} />
        <meshStandardMaterial color={FUR} roughness={0.85} />
      </mesh>
      {/* Belly patch pressed against the fuselage */}
      <mesh position={[0, -0.11, -0.02]} scale={[0.72, 0.4, 1.3]}>
        <sphereGeometry args={[0.155, 18, 18]} />
        <meshStandardMaterial color={BELLY} roughness={0.85} />
      </mesh>

      {/* Head, up and forward, alert and looking ahead over the nose */}
      <group position={[0, 0.09, 0.34]} rotation={[-0.18, 0, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.155, 22, 22]} />
          <meshStandardMaterial color={FUR} roughness={0.85} />
        </mesh>
        {/* Chubby cheeks */}
        <mesh position={[-0.098, -0.03, 0.09]}>
          <sphereGeometry args={[0.063, 14, 14]} />
          <meshStandardMaterial color={BELLY} roughness={0.85} />
        </mesh>
        <mesh position={[0.098, -0.03, 0.09]}>
          <sphereGeometry args={[0.063, 14, 14]} />
          <meshStandardMaterial color={BELLY} roughness={0.85} />
        </mesh>
        {/* Muzzle */}
        <mesh position={[0, -0.045, 0.145]} scale={[0.85, 0.65, 0.8]}>
          <sphereGeometry args={[0.073, 14, 14]} />
          <meshStandardMaterial color={BELLY} roughness={0.85} />
        </mesh>
        <mesh position={[0, -0.03, 0.208]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color={NOSE} roughness={0.3} />
        </mesh>

        {/* Ears */}
        <mesh position={[-0.118, 0.135, 0.01]} scale={[1, 1, 0.5]}>
          <sphereGeometry args={[0.044, 12, 12]} />
          <meshStandardMaterial color={FUR_DARK} />
        </mesh>
        <mesh position={[0.118, 0.135, 0.01]} scale={[1, 1, 0.5]}>
          <sphereGeometry args={[0.044, 12, 12]} />
          <meshStandardMaterial color={FUR_DARK} />
        </mesh>

        {/* Eyes */}
        <Eye position={[-0.061, 0.02, 0.135]} />
        <Eye position={[0.061, 0.02, 0.135]} />

        {/* Aviator goggles, pushed up on the forehead */}
        <Goggles position={[0, 0.11, -0.01]} rotation={[-0.35, 0, 0]} scale={0.93} />
      </group>

      {/* Front paws draped over the sides of the fuselage, gripping the rim */}
      <mesh position={[-0.17, -0.08, 0.2]} rotation={[0.5, 0, 0.85]} castShadow>
        <capsuleGeometry args={[0.026, 0.16, 4, 8]} />
        <meshStandardMaterial color={FUR} roughness={0.85} />
      </mesh>
      <mesh position={[0.17, -0.08, 0.2]} rotation={[0.5, 0, -0.85]} castShadow>
        <capsuleGeometry args={[0.026, 0.16, 4, 8]} />
        <meshStandardMaterial color={FUR} roughness={0.85} />
      </mesh>
      <mesh position={[-0.21, -0.17, 0.24]}>
        <sphereGeometry args={[0.03, 10, 10]} />
        <meshStandardMaterial color={BELLY} roughness={0.85} />
      </mesh>
      <mesh position={[0.21, -0.17, 0.24]}>
        <sphereGeometry args={[0.03, 10, 10]} />
        <meshStandardMaterial color={BELLY} roughness={0.85} />
      </mesh>

      {/* Hind legs trailing back along the body, feet resting flat */}
      <mesh position={[-0.1, -0.09, -0.38]} rotation={[1.35, 0, 0.1]} castShadow>
        <capsuleGeometry args={[0.032, 0.1, 4, 8]} />
        <meshStandardMaterial color={FUR} roughness={0.85} />
      </mesh>
      <mesh position={[0.1, -0.09, -0.38]} rotation={[1.35, 0, -0.1]} castShadow>
        <capsuleGeometry args={[0.032, 0.1, 4, 8]} />
        <meshStandardMaterial color={FUR} roughness={0.85} />
      </mesh>

      {/* Tail draping down the back of the fuselage */}
      <mesh position={[0, -0.06, -0.56]} rotation={[1.55, 0, 0]}>
        <coneGeometry args={[0.065, 0.24, 10]} />
        <meshStandardMaterial color={FUR_DARK} />
      </mesh>
    </group>
  )
}

// Jet's nose points +X, belly is -Y. Designed as a sleek, minimal single-aisle
// toy jet — slim fuselage, tapered nose, swept wings, single tail fin.
function ToyJet(props: ThreeElements['group']) {
  const FUSE_R = 0.155
  const FUSE_L = 1.05
  const NOSE_X = FUSE_L / 2 + FUSE_R

  return (
    <group {...props}>
      {/* Fuselage */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
        <capsuleGeometry args={[FUSE_R, FUSE_L, 6, 20]} />
        <meshStandardMaterial color={JET_BODY} roughness={0.3} metalness={0.15} />
      </mesh>

      {/* Nose taper */}
      <mesh position={[NOSE_X + 0.05, 0, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <coneGeometry args={[FUSE_R * 0.98, 0.16, 20]} />
        <meshStandardMaterial color={JET_BODY} roughness={0.25} metalness={0.15} />
      </mesh>

      {/* Amber accent stripe along the belly */}
      <mesh position={[0, -FUSE_R * 0.72, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.045, FUSE_L * 0.98, 4, 12]} />
        <meshStandardMaterial color={JET_STRIPE} roughness={0.4} />
      </mesh>

      {/* Cockpit windshield */}
      <mesh position={[NOSE_X - 0.16, 0.06, 0]} scale={[0.9, 0.55, 0.85]} castShadow>
        <sphereGeometry args={[0.09, 14, 14]} />
        <meshStandardMaterial color={JET_DARK} roughness={0.15} metalness={0.5} />
      </mesh>

      {/* Passenger windows */}
      {[-0.28, -0.12, 0.04, 0.2].map((x) => (
        <mesh key={x} position={[x, 0.05, FUSE_R * 0.97]}>
          <circleGeometry args={[0.022, 10]} />
          <meshStandardMaterial color={JET_DARK} roughness={0.3} />
        </mesh>
      ))}

      {/* Swept, slim wings */}
      <mesh position={[-0.12, -0.05, 0.42]} rotation={[0.05, 0.32, 0.05]} castShadow>
        <boxGeometry args={[0.34, 0.014, 0.4]} />
        <meshStandardMaterial color={JET_BODY} roughness={0.35} metalness={0.1} />
      </mesh>
      <mesh position={[-0.12, -0.05, -0.42]} rotation={[0.05, -0.32, 0.05]} castShadow>
        <boxGeometry args={[0.34, 0.014, 0.4]} />
        <meshStandardMaterial color={JET_BODY} roughness={0.35} metalness={0.1} />
      </mesh>

      {/* Slim underwing engines */}
      <mesh position={[-0.06, -0.14, 0.32]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.14, 14]} />
        <meshStandardMaterial color="#3a3f45" roughness={0.4} metalness={0.4} />
      </mesh>
      <mesh position={[-0.06, -0.14, -0.32]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.14, 14]} />
        <meshStandardMaterial color="#3a3f45" roughness={0.4} metalness={0.4} />
      </mesh>

      {/* Single swept tail fin */}
      <mesh position={[-0.54, 0.13, 0]} rotation={[0, 0, -0.32]} castShadow>
        <boxGeometry args={[0.24, 0.26, 0.018]} />
        <meshStandardMaterial color={JET_STRIPE} roughness={0.4} />
      </mesh>
      {/* Horizontal stabilizers */}
      <mesh position={[-0.56, -0.005, 0]}>
        <boxGeometry args={[0.13, 0.012, 0.22]} />
        <meshStandardMaterial color={JET_BODY} roughness={0.4} />
      </mesh>
    </group>
  )
}

function HeroRig(props: ThreeElements['group']) {
  return (
    <group {...props}>
      <ToyJet position={[0, 0, 0]} />
      {/* Otter's local +Z (muzzle) aligned to the jet's +X (nose), laid on
          top of the fuselage just forward of center. Scaled down relative
          to the jet so it reads as a small rider on a bigger plane. */}
      <OtterPilot position={[0.14, 0.26, 0]} rotation={[0, Math.PI / 2, 0]} scale={0.95} />
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
      <Float
        speed={reduced ? 0 : 1.6}
        rotationIntensity={reduced ? 0 : 0.3}
        floatIntensity={reduced ? 0 : 0.6}
      >
        <HeroRig position={[0, -0.05, 0]} rotation={[0.04, -0.35, -0.03]} scale={2.3} />
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
