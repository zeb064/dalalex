import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import PostProcessing from './PostProcessing'
import WaveBackground from './WaveBackground'
import type { WaveSettings } from './WaveBackground'

function CameraController() {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 0.3
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * -0.3
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  useFrame(() => {
    const targetX = mouse.current.x * 1.2
    const targetY = mouse.current.y * 0.8
    camera.position.x += (targetX - camera.position.x) * 0.03
    camera.position.y += (targetY - camera.position.y) * 0.03
    camera.lookAt(0, 0, 0)
  })

  return null
}

function SceneContent({ scrollProgress, waveSettings }: {
  scrollProgress: React.MutableRefObject<number>
  waveSettings: WaveSettings
}) {
  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 5, 5]} intensity={0.3} color="#D4A574" />
      <WaveBackground scrollProgress={scrollProgress} settings={waveSettings} />
      <PostProcessing />
    </>
  )
}

export default function Scene3D({ scrollRef, waveSettings }: {
  scrollRef: React.MutableRefObject<number>
  waveSettings: WaveSettings
}) {
  return (
    <div className="fixed inset-0 w-full h-full -z-10">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
      >
        <color attach="background" args={['#0A0A08']} />
        <CameraController />
        <SceneContent scrollProgress={scrollRef} waveSettings={waveSettings} />
      </Canvas>
    </div>
  )
}
