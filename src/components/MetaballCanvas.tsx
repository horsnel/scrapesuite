"use client";

import { useRef, useEffect } from 'react'

const vertexShader = `
varying vec3 vWorldPos;
void main() {
  vWorldPos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
precision highp float;
#define BLOB_COUNT 12

uniform float uTime;
uniform vec3 uBlobCenters[BLOB_COUNT];
uniform float uBlobRadius[BLOB_COUNT];
uniform vec3 uBlobColors[BLOB_COUNT];
uniform float uBlendScale;
uniform vec3 uRimColor;
uniform float uRimIntensity;
uniform float uColorShiftSpeed;
uniform vec2 uViewportRes;
varying vec3 vWorldPos;

float sdf_sphere(vec3 p, vec3 center, float radius) {
  return length(p - center) - radius;
}
float smin(float a, float b, float k) {
  float h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * k * (1.0 / 4.0);
}
float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float metaball_sdf(vec3 p) {
  float d = 1e5;
  for (int i = 0; i < BLOB_COUNT; i++) {
    float bd = sdf_sphere(p, uBlobCenters[i], uBlobRadius[i]);
    d = smin(d, bd, uBlendScale);
  }
  return d;
}
vec3 normal(vec3 p) {
  vec2 e = vec2(0.001, 0.0);
  return normalize(vec3(
    metaball_sdf(p + e.xyy) - metaball_sdf(p - e.xyy),
    metaball_sdf(p + e.yxy) - metaball_sdf(p - e.yxy),
    metaball_sdf(p + e.yyx) - metaball_sdf(p - e.yyx)
  ));
}
vec3 metaball_color(vec3 p) {
  vec3 base = vec3(0.0);
  float wsum = 0.0;
  for (int i = 0; i < BLOB_COUNT; i++) {
    vec3 ci = uBlobCenters[i];
    float di = length(p - ci);
    float ri = uBlobRadius[i];
    float wi = exp(-8.0 * max(di - ri, 0.0));
    float h = hash(vec2(float(i) * 7.13, 3.71));
    float phase = h * 6.2831853 + uTime * uColorShiftSpeed;
    float sw = sin(phase) * 0.5 + 0.5;
    vec3 ci_col = mix(uBlobColors[i], uRimColor, sw * 0.35);
    base += ci_col * wi;
    wsum += wi;
  }
  if (wsum > 0.0) return base / wsum;
  return vec3(0.05, 0.07, 0.12);
}
float soft_shadow(vec3 ro, vec3 rd, float mint, float maxt, float k) {
  float res = 1.0;
  float ph = 1e10;
  float t = mint;
  for (int i = 0; i < 24; i++) {
    if (t >= maxt) break;
    float h = metaball_sdf(ro + rd * t);
    float y = h * h / (2.0 * ph);
    float d = sqrt(h * h - y * y);
    res = min(res, max((k * d) / (2.0 * ph), 0.0));
    ph = h;
    t += h;
    if (h < 0.001) break;
  }
  return clamp(res, 0.0, 1.0);
}
void main() {
  vec3 camPos = vec3(0.0, 0.0, 5.2);
  vec3 rayDir = normalize(vWorldPos - camPos);
  float t = 0.0;
  float tMax = 12.0;
  bool hit = false;
  vec3 p = vWorldPos;
  for (int i = 0; i < 64; i++) {
    p = camPos + rayDir * t;
    float d = metaball_sdf(p);
    if (d < 0.003) { hit = true; break; }
    if (t > tMax) break;
    t += max(d * 0.5, 0.005);
  }
  if (!hit) discard;
  vec3 N = normal(p);
  vec3 viewDir = normalize(camPos - p);
  float nDotV = max(dot(N, viewDir), 0.0);
  vec3 baseColor = metaball_color(p);
  float rim = pow(1.0 - nDotV, 4.0) * uRimIntensity;
  vec3 rimColor = uRimColor * rim;
  vec3 lightDir1 = normalize(vec3(1.2, 2.0, 1.5));
  vec3 lightDir2 = normalize(vec3(-1.5, 0.5, 2.0));
  float NdotL1 = max(dot(N, lightDir1), 0.0);
  float NdotL2 = max(dot(N, lightDir2), 0.0);
  float shadow1 = soft_shadow(p + N * 0.02, lightDir1, 0.02, 4.0, 8.0);
  vec3 diffuse = baseColor * (NdotL1 * shadow1 * 0.85 + NdotL2 * 0.25);
  vec3 ambient = baseColor * vec3(0.08, 0.1, 0.14);
  float spec = pow(max(dot(N, normalize(lightDir1 + viewDir)), 0.0), 80.0) * shadow1 * 0.4;
  vec3 col = ambient + diffuse + vec3(spec) + rimColor;
  float edgeDist = abs(metaball_sdf(p));
  float edgeGlow = exp(-edgeDist * 40.0) * 0.25;
  col += uRimColor * edgeGlow;
  col = col * (2.51 * col + 0.03) / (col * (2.43 * col + 0.59) + 0.14);
  col = pow(col, vec3(1.0 / 2.2));
  float viewDist = length(vWorldPos - camPos);
  float fade = smoothstep(10.0, 12.0, viewDist);
  col = mix(col, vec3(0.02, 0.03, 0.06), fade);
  gl_FragColor = vec4(col, 1.0);
}
`

const BLOB_COUNT = 12

// WebGL metaball background is disabled by default: the original design shipped
// without `three` installed, so this effect never ran in production and the
// approved visual identity is the clean, canvas-free hero. Set
// NEXT_PUBLIC_ENABLE_WEBGL=true to opt in at build time.
const ENABLE_WEBGL = process.env.NEXT_PUBLIC_ENABLE_WEBGL === 'true'

export default function MetaballCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if (!ENABLE_WEBGL) return

    let cancelled = false
    let cleanupFn: (() => void) | undefined

    const init = async () => {
      try {
        // Skip WebGL on mobile for performance
        if (window.innerWidth < 768) return

        const THREE = await import('three')
        if (cancelled) return
        const { EffectComposer } = await import('three/examples/jsm/postprocessing/EffectComposer.js')
        if (cancelled) return
        const { RenderPass } = await import('three/examples/jsm/postprocessing/RenderPass.js')
        if (cancelled) return
        const { UnrealBloomPass } = await import('three/examples/jsm/postprocessing/UnrealBloomPass.js')
        if (cancelled) return

        const testCanvas = document.createElement('canvas')
        const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl')
        if (!gl) return

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 30)
        camera.position.set(0, 0, 5.2)

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: window.devicePixelRatio > 1 })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.domElement.style.width = '100%'
        renderer.domElement.style.height = '100%'
        renderer.domElement.style.display = 'block'
        container.appendChild(renderer.domElement)

        const composer = new EffectComposer(renderer)
        composer.addPass(new RenderPass(scene, camera))
        const bloomPass = new UnrealBloomPass(
          new THREE.Vector2(window.innerWidth, window.innerHeight),
          0.35, 0.5, 0.75
        )
        composer.addPass(bloomPass)

        const blobColors = [
          new THREE.Color(0xf59e0b), new THREE.Color(0xef4444), new THREE.Color(0x06b6d4),
          new THREE.Color(0xf97316), new THREE.Color(0xdc2626), new THREE.Color(0x0ea5e9),
          new THREE.Color(0xf59e0b), new THREE.Color(0xec4899), new THREE.Color(0x14b8a6),
          new THREE.Color(0xfbbf24), new THREE.Color(0xe11d48), new THREE.Color(0x22d3ee),
        ]
        const blobColorsVec3 = blobColors.map(c => new THREE.Vector3(c.r, c.g, c.b))
        const blobCenters = Array.from({ length: BLOB_COUNT }, () => new THREE.Vector3())
        const blobRadius = Array.from({ length: BLOB_COUNT }, (_, i) => {
          const h = ((i * 17.0 + 31.0) * 0.1031) % 1.0
          return 0.6 + h * 0.5
        })

        const material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms: {
            uTime: { value: 0.0 },
            uBlobCenters: { value: blobCenters },
            uBlobRadius: { value: blobRadius },
            uBlobColors: { value: blobColorsVec3 },
            uBlendScale: { value: 0.48 },
            uRimColor: { value: new THREE.Vector3(0.9, 0.6, 0.1) },
            uRimIntensity: { value: 1.0 },
            uColorShiftSpeed: { value: 0.6 },
            uViewportRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          },
          side: THREE.BackSide,
          transparent: false,
        })

        const geometry = new THREE.BoxGeometry(20, 20, 20)
        const mesh = new THREE.Mesh(geometry, material)
        scene.add(mesh)

        const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }
        const onMouseMove = (e: MouseEvent) => {
          mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2
          mouse.targetY = (e.clientY / window.innerHeight - 0.5) * 2
        }
        window.addEventListener('mousemove', onMouseMove)

        const onResize = () => {
          camera.aspect = window.innerWidth / window.innerHeight
          camera.updateProjectionMatrix()
          renderer.setSize(window.innerWidth, window.innerHeight)
          composer.setSize(window.innerWidth, window.innerHeight)
          material.uniforms.uViewportRes.value.set(window.innerWidth, window.innerHeight)
        }
        window.addEventListener('resize', onResize)

        const clock = new THREE.Clock()
        let frameId = 0
        let isActive = true

        const updateBlobPositions = (time: number, centers: typeof blobCenters) => {
          for (let i = 0; i < BLOB_COUNT; i++) {
            const seed = i * 17.0 + 31.0
            const cx = Math.sin(seed * 1.1 + time * 0.23) * 1.8 + Math.sin(seed * 2.7 + time * 0.17) * 0.6
            const cy = Math.cos(seed * 1.3 + time * 0.19) * 1.4 + Math.cos(seed * 2.1 + time * 0.31) * 0.5
            const cz = Math.sin(seed * 0.7 + time * 0.15) * 1.2 + Math.cos(seed * 1.9 + time * 0.11) * 0.7
            centers[i].set(cx, cy, cz)
          }
        }

        const animate = () => {
          if (!isActive) return
          frameId = requestAnimationFrame(animate)
          const time = clock.getElapsedTime()
          material.uniforms.uTime.value = time
          updateBlobPositions(time, blobCenters)
          material.uniforms.uBlobCenters.value = blobCenters
          mouse.x += (mouse.targetX - mouse.x) * 0.08
          mouse.y += (mouse.targetY - mouse.y) * 0.08
          camera.rotation.x = mouse.y * 0.12 * 0.3
          camera.rotation.y = mouse.x * 0.12 * 0.3
          camera.position.x = Math.sin(time * 0.08) * 0.14 * 0.5
          camera.position.y = Math.cos(time * 0.08 * 0.7) * 0.14 * 0.3
          composer.render()
        }
        animate()

        cleanupFn = () => {
          isActive = false
          cancelAnimationFrame(frameId)
          window.removeEventListener('mousemove', onMouseMove)
          window.removeEventListener('resize', onResize)
          renderer.dispose()
          geometry.dispose()
          material.dispose()
          if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement)
          }
        }
      } catch {
        // WebGL not available, keep gradient fallback
      }
    }

    // Defer Three.js init
    const timer = setTimeout(init, 500)

    return () => {
      cancelled = true
      clearTimeout(timer)
      cleanupFn?.()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 30% 40%, #131a2a 0%, #0b0f1a 50%, #070a12 100%)',
      }}
    />
  )
}
