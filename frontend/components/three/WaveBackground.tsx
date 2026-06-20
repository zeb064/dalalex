import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export interface WaveSettings {
  intensityEnabled: boolean
  speedEnabled: boolean
  colorShiftEnabled: boolean
  revealEnabled: boolean
  rippleEnabled: boolean
  auroraEnabled: boolean
}

const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uIntensity;
  uniform float uScroll;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float wave = sin(pos.x * 0.5 + uTime * 0.2) * cos(pos.y * 0.4 + uTime * 0.15);
    float intensity = 1.0;
    if (uIntensity > 0.5) intensity *= (1.0 + uScroll * 2.0);
    pos.z += wave * 0.08 * intensity;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  uniform float uScroll;
  uniform float uIntensity;
  uniform float uSpeed;
  uniform float uColorShift;
  uniform float uAurora;
  uniform float uRipple;
  uniform float uReveal;

  varying vec2 vUv;

  const vec3 C1 = vec3(0.769, 0.584, 0.416);
  const vec3 C2 = vec3(0.831, 0.647, 0.455);
  const vec3 C3 = vec3(0.604, 0.427, 0.282);

  void main() {
    float s = 0.3;
    if (uSpeed > 0.5) s *= (1.0 + uScroll * 3.0);
    float t = uTime * s;

    float w1 = sin(vUv.x * 12.0 + t * 1.0) * cos(vUv.y * 8.0 + t * 0.7);
    float w2 = sin(vUv.y * 14.0 - t * 0.6) * cos((vUv.x + vUv.y) * 10.0 + t * 0.4);
    float w3 = sin(vUv.x * 18.0 + vUv.y * 12.0 + t * 0.8);
    float w4 = sin((vUv.x - vUv.y) * 20.0 + t * 0.5);

    float wave = (w1 * 0.35 + w2 * 0.25 + w3 * 0.2 + w4 * 0.2);
    wave = wave * 0.5 + 0.5;

    if (uAurora > 0.5) {
      float b1 = sin(vUv.y * 25.0 + vUv.x * 5.0 + t * 0.2) * 0.5 + 0.5;
      float b2 = sin(vUv.y * 20.0 - vUv.x * 8.0 + t * 0.35) * 0.5 + 0.5;
      float b3 = sin(vUv.y * 15.0 + vUv.x * 3.0 + t * 0.5) * 0.5 + 0.5;
      float aura = (b1 * b2 * 0.7 + b3 * 0.3);
      wave = mix(wave, aura, 0.5);
    }

    if (uRipple > 0.5) {
      float d = distance(vUv, vec2(0.5));
      float r = sin(d * 40.0 - uScroll * 30.0) * 0.5 + 0.5;
      r *= exp(-d * 4.0);
      wave = clamp(wave + r * 0.4, 0.0, 1.0);
    }

    float intensity = 1.0;
    if (uIntensity > 0.5) intensity *= (1.0 + uScroll * 2.5);

    float shift = 0.0;
    if (uColorShift > 0.5) shift = uScroll;
    vec3 color = mix(mix(C1, C2, wave), C3, shift * wave);

    float alpha = wave * 0.12 * intensity;

    if (uReveal > 0.5) {
      float bandPos = 1.0 - uScroll;
      float band = exp(-abs(vUv.y - bandPos) * 25.0);
      alpha += band * 0.08;
    }

    gl_FragColor = vec4(color, alpha);
  }
`

export default function WaveBackground({ scrollProgress, settings }: {
  scrollProgress: React.MutableRefObject<number>
  settings: WaveSettings
}) {
  const timeRef = useRef(0)

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uIntensity: { value: 0 },
    uSpeed: { value: 0 },
    uColorShift: { value: 0 },
    uAurora: { value: 0 },
    uRipple: { value: 0 },
    uReveal: { value: 0 },
  }), [])

  useFrame((_, delta) => {
    timeRef.current += delta
    uniforms.uTime.value = timeRef.current
    uniforms.uScroll.value = scrollProgress.current
    uniforms.uIntensity.value = settings.intensityEnabled ? 1 : 0
    uniforms.uSpeed.value = settings.speedEnabled ? 1 : 0
    uniforms.uColorShift.value = settings.colorShiftEnabled ? 1 : 0
    uniforms.uAurora.value = settings.auroraEnabled ? 1 : 0
    uniforms.uRipple.value = settings.rippleEnabled ? 1 : 0
    uniforms.uReveal.value = settings.revealEnabled ? 1 : 0
  })

  return (
    <mesh>
      <planeGeometry args={[24, 18]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}
