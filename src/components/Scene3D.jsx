import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, Lightformer, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

// Vị trí / tỉ lệ của ngôi sao theo từng kiểu slide
const POSES = {
  hero: { pos: [2.6, 0.1, 0], scale: 1.15, rings: 1 },
  section: { pos: [3.1, 0.1, -0.5], scale: 1.2, rings: 1 },
  content: { pos: [8.6, 3.3, -6], scale: 0.6, rings: 0.35 },
  quiz: { pos: [9.3, -3.2, -6], scale: 0.6, rings: 0.35 },
}

function starShape(outer = 1, inner = 0.42) {
  const s = new THREE.Shape()
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = (i / 10) * Math.PI * 2 + Math.PI / 2
    const x = Math.cos(a) * r
    const y = Math.sin(a) * r
    if (i === 0) s.moveTo(x, y)
    else s.lineTo(x, y)
  }
  s.closePath()
  return s
}

function Star({ pose }) {
  const group = useRef()
  const mesh = useRef()
  const rings = useRef()
  const geometry = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(starShape(), {
      depth: 0.22,
      bevelEnabled: true,
      bevelThickness: 0.12,
      bevelSize: 0.08,
      bevelSegments: 6,
    })
    g.center()
    return g
  }, [])

  const target = useMemo(() => new THREE.Vector3(), [])
  useFrame((state, dt) => {
    const p = POSES[pose] ?? POSES.content
    target.set(...p.pos)
    const k = 1 - Math.pow(0.02, dt)
    group.current.position.lerp(target, k)
    const s = THREE.MathUtils.lerp(group.current.scale.x, p.scale, k)
    group.current.scale.setScalar(s)
    // lắc nhẹ quanh mặt chính diện để ngôi sao luôn rõ hình
    mesh.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.6
    const px = state.pointer.x * 0.25
    const py = state.pointer.y * 0.2
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -py, k)
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, px * 0.3, k)
    rings.current.rotation.z += dt * 0.12
    rings.current.children.forEach((r, i) => {
      r.rotation.x += dt * (0.15 + i * 0.08)
      r.material.opacity = THREE.MathUtils.lerp(r.material.opacity, 0.55 * p.rings, k)
    })
  })

  return (
    <group ref={group}>
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
        <mesh ref={mesh} geometry={geometry}>
          <meshStandardMaterial color="#f2c14e" metalness={1} roughness={0.18} envMapIntensity={1.4} />
        </mesh>
      </Float>
      <group ref={rings}>
        {[1.75, 2.15, 2.6].map((r, i) => (
          <mesh key={r} rotation={[Math.PI / 2 + i * 0.5, i * 0.7, 0]}>
            <torusGeometry args={[r, 0.008 + i * 0.002, 16, 160]} />
            <meshBasicMaterial color={i === 1 ? '#ff6b5a' : '#f2c14e'} transparent opacity={0} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function CameraRig() {
  useFrame((state, dt) => {
    const k = 1 - Math.pow(0.05, dt)
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, state.pointer.x * 0.4, k)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, state.pointer.y * 0.3, k)
    state.camera.lookAt(0, 0, 0)
  })
  return null
}

export default function Scene3D({ pose = 'content' }) {
  return (
    <div className="scene3d" aria-hidden="true">
      <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 7], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[3, 4, 5]} intensity={1.6} color="#fff1d6" />
        <pointLight position={[-4, -2, 3]} intensity={30} color="#ff3b2f" />
        <Star pose={pose} />
        <Sparkles count={140} scale={[16, 9, 6]} size={2.4} speed={0.35} color="#f7d488" opacity={0.7} />
        <Sparkles count={50} scale={[14, 8, 4]} size={4} speed={0.2} color="#ff7a59" opacity={0.35} />
        <CameraRig />
        {/* Môi trường phản chiếu dựng bằng Lightformer — không tải HDR từ mạng */}
        <Environment resolution={256}>
          <Lightformer intensity={4} position={[0, 5, -6]} scale={[10, 2, 1]} color="#fff4de" />
          <Lightformer intensity={3} position={[-6, 0, 2]} rotation-y={Math.PI / 2} scale={[8, 3, 1]} color="#ff5a3c" />
          <Lightformer intensity={2} position={[6, -1, 2]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} color="#ffd27a" />
          <Lightformer form="ring" intensity={3} position={[0, 0, 6]} scale={3} color="#ffffff" />
        </Environment>
      </Canvas>
    </div>
  )
}
