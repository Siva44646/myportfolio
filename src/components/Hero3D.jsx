import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, PerspectiveCamera, Environment, MeshDistortMaterial, Sphere } from '@react-three/drei'
import * as THREE from 'three'

function AnimatedSphere() {
  const sphereRef = useRef()

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = state.clock.getElapsedTime() * 0.2
      sphereRef.current.rotation.y = state.clock.getElapsedTime() * 0.3
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2}>
      <Sphere ref={sphereRef} args={[1, 64, 64]} scale={1.5}>
        <MeshDistortMaterial
          color="#000000"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  )
}

function Particles() {
  const count = 50 // Reduced quantity
  const mesh = useRef()
  const dummy = new THREE.Object3D()
  const particles = useRef(
    Array.from({ length: count }, () => ({
      t: Math.random() * 100,
      speed: 0.002 + Math.random() * 0.005, // Very slow, premium drift
      xOffset: -15 + Math.random() * 30, // Spread out widely
      yOffset: -15 + Math.random() * 30,
      zOffset: -15 + Math.random() * 30,
      xAmp: 2 + Math.random() * 3, // Drift amplitude
      yAmp: 2 + Math.random() * 3,
      zAmp: 2 + Math.random() * 3,
      scale: 0.02 + Math.random() * 0.04, // Varied small sizes
    }))
  )

  useFrame((state) => {
    particles.current.forEach((particle, i) => {
      let { t, speed, xOffset, yOffset, zOffset, xAmp, yAmp, zAmp, scale } = particle
      t = particle.t += speed
      
      // Smooth, elegant drift animation
      const x = xOffset + Math.cos(t) * xAmp
      const y = yOffset + Math.sin(t) * yAmp
      const z = zOffset + Math.sin(t * 0.5) * zAmp
      
      dummy.position.set(x, y, z)
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="#00f0ff" roughness={0.1} metalness={0.9} transparent opacity={0.7} />
    </instancedMesh>
  )
}

export default function Hero3D() {
  return (
    <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={75} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={2} color="#00f0ff" />
        <Environment preset="city" />
        <AnimatedSphere />
        <Particles />
      </Canvas>
    </div>
  )
}
