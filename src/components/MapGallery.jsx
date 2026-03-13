import { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { assetUrl } from '../utils/assetUrl';

// ==========================================
// 3D MAP PLANE with the real map texture
// ==========================================
function MapPlane({ scrollProgress }) {
  const meshRef = useRef();
  const texture = useTexture(assetUrl('/assets/map_texture.png'));

  useFrame(() => {
    if (!meshRef.current) return;
    const p = scrollProgress.current;

    if (p < 0.4) {
      meshRef.current.visible = true;
      const fadeOut = p > 0.25 ? 1 - (p - 0.25) / 0.15 : 1;
      meshRef.current.material.opacity = Math.max(0, fadeOut);
      meshRef.current.position.z = -p * 8;
      meshRef.current.position.y = -1 - p * 3;
      meshRef.current.rotation.x = -Math.PI / 2 + p * 0.3;
    } else {
      meshRef.current.visible = false;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
      <planeGeometry args={[16, 10, 1, 1]} />
      <meshBasicMaterial map={texture} transparent opacity={1} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ==========================================
// 3D MEMORY PINS
// ==========================================
const pinData = [
  { pos: [-4, 0.5, 1], color: '#ec4899' },
  { pos: [-1, 0.5, -1], color: '#3b82f6' },
  { pos: [2, 0.5, 0.5], color: '#10b981' },
  { pos: [4, 0.5, -2], color: '#f97316' },
  { pos: [0, 0.5, 2], color: '#8b5cf6' },
  { pos: [-3, 0.5, -2.5], color: '#ef4444' },
];

function MemoryPin({ position, color, scrollProgress, index }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const elapsedRef = useRef(0);

  useFrame((state, delta) => {
    elapsedRef.current += delta;
    if (!meshRef.current) return;
    const p = scrollProgress.current;
    const time = elapsedRef.current;

    if (p < 0.35) {
      meshRef.current.visible = true;
      const fadeOut = p > 0.2 ? 1 - (p - 0.2) / 0.15 : 1;
      meshRef.current.scale.setScalar(Math.max(0.01, fadeOut));
      meshRef.current.position.y = position[1] + Math.sin(time * 2 + index) * 0.15;
    } else {
      meshRef.current.visible = false;
    }

    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(time * 3 + index) * 0.2);
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      <mesh ref={glowRef} position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.1, 0.25, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ==========================================
// FLOATING PHOTO FRAMES
// ==========================================
// Put your photos in: public/assets/gallery/ named 1.png to 8.png
const photos = [
  { x: -2.5, y: 1.2, z: -12, ry: 0.12, label: 'By the Lake', color: '#fce7f3', img: assetUrl('/assets/gallery/1.png') },
  { x: 2.5, y: -0.5, z: -20, ry: -0.1, label: 'Morning View', color: '#dbeafe', img: assetUrl('/assets/gallery/2.png') },
  { x: -1.8, y: 0.6, z: -28, ry: 0.08, label: 'Peaceful Ganges', color: '#d1fae5', img: assetUrl('/assets/gallery/3.png') },
  { x: 3, y: 1, z: -36, ry: -0.12, label: 'Fresh Snow', color: '#ede9fe', img: assetUrl('/assets/gallery/4.png') },
  { x: -2.8, y: -0.3, z: -44, ry: 0.1, label: 'Rare Blooms', color: '#fef3c7', img: assetUrl('/assets/gallery/5.png') },
  { x: 1.5, y: 0.8, z: -52, ry: -0.08, label: 'Safari Day', color: '#fce7f3', img: assetUrl('/assets/gallery/6.png') },
  { x: -3, y: -0.8, z: -60, ry: 0.15, label: 'Sunset Magic', color: '#ccfbf1', img: assetUrl('/assets/gallery/7.png') },
  { x: 2.8, y: 0.4, z: -68, ry: -0.12, label: 'Valley Dreams', color: '#e0e7ff', img: assetUrl('/assets/gallery/8.png') },
];

// Loads real image texture and computes dynamic dimensions to prevent stretching
function DynamicPhotoFrame({ imgPath }) {
  const texture = useTexture(imgPath);
  
  // Get original image dimensions and aspect ratio
  const imgW = texture.image?.width || 800;
  const imgH = texture.image?.height || 600;
  const aspect = imgW / imgH;

  // Max width 2.4, max height 2.0 to fit well within the 3D gallery bounds
  let w = 2.4;
  let h = w / aspect;
  if (h > 2.0) {
    h = 2.0;
    w = h * aspect;
  }

  const frameW = w + 0.3;
  const frameH = h + 0.4;

  return (
    <group>
      {/* White frame border */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[frameW, frameH]} />
        <meshStandardMaterial color="#ffffff" transparent />
      </mesh>
      {/* Photo */}
      <mesh position={[0, 0.05, 0]}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={texture} transparent />
      </mesh>
      {/* Cute tape on top */}
      <mesh position={[0, frameH / 2 - 0.05, 0.02]} rotation={[0, 0, 0.06]}>
        <planeGeometry args={[Math.min(0.7, w * 0.4), 0.12]} />
        <meshBasicMaterial color="#fbcfe8" transparent opacity={0.8} />
      </mesh>
      {/* Label bar */}
      <mesh position={[0, -frameH / 2 + 0.15, 0.02]}>
        <planeGeometry args={[w * 0.6, 0.20]} />
        <meshBasicMaterial color="#f8fafc" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function PhotoFrame({ position, rotationY, scrollProgress, index, color, img }) {
  const groupRef = useRef();
  const elapsedRef = useRef(0);

  useFrame((state, delta) => {
    elapsedRef.current += delta;
    if (!groupRef.current) return;
    const p = scrollProgress.current;
    const time = elapsedRef.current;

    // Gallery starts at 45% scroll (after camera fully centered)
    const galleryProgress = Math.max(0, (p - 0.45) / 0.55);
    const flySpeed = 80;
    const baseZ = position[2];
    const currentZ = baseZ + galleryProgress * flySpeed;

    groupRef.current.position.z = currentZ;

    // Gentle centering — subtle 25% nudge when very close
    const distToCamera = Math.abs(currentZ);
    const centeringZone = 4;
    const centerFactor = distToCamera < centeringZone
      ? Math.pow(1 - distToCamera / centeringZone, 2)
      : 0;

    const targetX = position[0] * (1 - centerFactor * 0.25);
    const targetY = position[1] * (1 - centerFactor * 0.15) + Math.sin(time * 0.8 + index * 1.5) * 0.1;

    groupRef.current.position.x = targetX;
    groupRef.current.position.y = targetY;
    groupRef.current.rotation.y = rotationY * (1 - centerFactor * 0.3) + Math.sin(time * 0.5 + index) * 0.02;

    const closeScale = 1 + centerFactor * 0.08;
    groupRef.current.scale.setScalar(closeScale);

    // Fade based on distance
    let opacity = 1;
    if (distToCamera > 15) opacity = Math.max(0, 1 - (distToCamera - 15) / 10);
    if (distToCamera < 0.5) opacity = Math.max(0, distToCamera * 2);
    if (currentZ > 5) opacity = 0;

    groupRef.current.visible = opacity > 0.01;

    groupRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.opacity = opacity;
      }
    });
  });

  return (
    <group ref={groupRef} position={position}>
      <Suspense fallback={
        <group>
          {/* Skeleton placeholder frame while loading */}
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[2.6, 2.2]} />
            <meshStandardMaterial color="#ffffff" transparent />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <planeGeometry args={[2.3, 1.7]} />
            <meshStandardMaterial color={color} transparent />
          </mesh>
        </group>
      }>
        <DynamicPhotoFrame imgPath={img} />
      </Suspense>
    </group>
  );
}

// ==========================================
// AMBIENT PARTICLES — sparkle dust
// ==========================================
function Particles({ count = 250 }) {
  const mesh = useRef();
  const elapsedRef = useRef(0);
  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80 - 10;
    }
    return pos;
  });

  useFrame((state, delta) => {
    elapsedRef.current += delta;
    if (!mesh.current) return;
    mesh.current.rotation.y = elapsedRef.current * 0.015;
    mesh.current.rotation.x = Math.sin(elapsedRef.current * 0.008) * 0.05;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#ddd6fe" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

// ==========================================
// FLOATING BOKEH ORBS — soft glowing spheres
// ==========================================
const bokehData = [
  { pos: [-6, 3, -8], size: 0.4, color: '#fbcfe8', speed: 0.3 },
  { pos: [5, -2, -15], size: 0.6, color: '#c4b5fd', speed: 0.2 },
  { pos: [-3, 4, -25], size: 0.35, color: '#a5f3fc', speed: 0.4 },
  { pos: [7, 1, -35], size: 0.5, color: '#fde68a', speed: 0.25 },
  { pos: [-8, -1, -12], size: 0.45, color: '#bbf7d0', speed: 0.35 },
  { pos: [4, 3, -45], size: 0.3, color: '#fecdd3', speed: 0.3 },
  { pos: [-5, -3, -30], size: 0.55, color: '#ddd6fe', speed: 0.2 },
  { pos: [6, 2, -55], size: 0.4, color: '#bae6fd', speed: 0.3 },
  { pos: [-7, 0, -40], size: 0.5, color: '#fde68a', speed: 0.25 },
  { pos: [3, -2, -20], size: 0.35, color: '#fbcfe8', speed: 0.4 },
  { pos: [-4, 5, -50], size: 0.6, color: '#c4b5fd', speed: 0.15 },
  { pos: [8, -1, -60], size: 0.45, color: '#a5f3fc', speed: 0.3 },
  { pos: [-6, 2, -18], size: 0.3, color: '#bbf7d0', speed: 0.35 },
  { pos: [5, 4, -42], size: 0.5, color: '#fecdd3', speed: 0.2 },
  { pos: [-2, -4, -28], size: 0.4, color: '#ddd6fe', speed: 0.3 },
  { pos: [7, -3, -52], size: 0.35, color: '#bae6fd', speed: 0.25 },
  { pos: [-8, 3, -65], size: 0.55, color: '#fbcfe8', speed: 0.2 },
  { pos: [4, 0, -10], size: 0.3, color: '#fde68a', speed: 0.4 },
  { pos: [-3, -2, -48], size: 0.45, color: '#c4b5fd', speed: 0.3 },
  { pos: [6, 5, -22], size: 0.4, color: '#a5f3fc', speed: 0.25 },
];

function FloatingBokeh() {
  return (
    <group>
      {bokehData.map((b, i) => (
        <BokehOrb key={i} index={i} pos={b.pos} size={b.size} color={b.color} speed={b.speed} />
      ))}
    </group>
  );
}

function BokehOrb({ pos, size, color, speed, index }) {
  const ref = useRef();
  const elapsedRef = useRef(0);
  useFrame((state, delta) => {
    elapsedRef.current += delta;
    if (!ref.current) return;
    const t = elapsedRef.current;
    ref.current.position.x = pos[0] + Math.sin(t * speed + index) * 0.8;
    ref.current.position.y = pos[1] + Math.sin(t * speed * 0.7 + index * 2) * 0.6;
  });

  return (
    <mesh ref={ref} position={pos}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.15} />
    </mesh>
  );
}

// ==========================================
// FLOATING DECORATIVE SHAPES — hearts, stars, rings
// ==========================================
const shapeData = [
  { pos: [-5, 2, -10], type: 'ring', color: '#ec4899', scale: 0.5 },
  { pos: [6, -1, -20], type: 'torus', color: '#8b5cf6', scale: 0.3 },
  { pos: [-4, 3, -35], type: 'ring', color: '#f97316', scale: 0.4 },
  { pos: [5, 0, -50], type: 'torus', color: '#3b82f6', scale: 0.35 },
  { pos: [-7, -2, -45], type: 'ring', color: '#10b981', scale: 0.45 },
  { pos: [7, 3, -30], type: 'torus', color: '#ec4899', scale: 0.25 },
  { pos: [-6, 1, -58], type: 'ring', color: '#8b5cf6', scale: 0.5 },
  { pos: [4, -3, -15], type: 'torus', color: '#f97316', scale: 0.3 },
];

function FloatingShapes() {
  return (
    <group>
      {shapeData.map((s, i) => (
        <FloatingShape key={i} index={i} pos={s.pos} type={s.type} color={s.color} scale={s.scale} />
      ))}
    </group>
  );
}

function FloatingShape({ pos, type, color, scale, index }) {
  const ref = useRef();
  const elapsedRef = useRef(0);
  useFrame((state, delta) => {
    elapsedRef.current += delta;
    if (!ref.current) return;
    const t = elapsedRef.current;
    ref.current.rotation.x = t * 0.3 + index;
    ref.current.rotation.z = t * 0.2 + index * 0.5;
    ref.current.position.y = pos[1] + Math.sin(t * 0.4 + index) * 0.5;
  });

  return (
    <mesh ref={ref} position={pos} scale={scale}>
      {type === 'ring'
        ? <torusGeometry args={[1, 0.15, 12, 32]} />
        : <torusKnotGeometry args={[0.6, 0.2, 64, 8]} />
      }
      <meshBasicMaterial color={color} transparent opacity={0.12} wireframe />
    </mesh>
  );
}

// ==========================================
// CAMERA CONTROLLER
// ==========================================
function CameraController({ scrollProgress }) {
  const { camera } = useThree();

  useFrame(() => {
    const p = scrollProgress.current;

    if (p < 0.4) {
      const mapP = p / 0.4;
      camera.position.x = mapP * 1; // eslint-disable-line react-hooks/immutability
      camera.position.y = 6 - mapP * 2;
      camera.position.z = 6 - mapP * 3;
      camera.lookAt(0, -1 + mapP * 2, -mapP * 5);
    } else {
      const galP = (p - 0.4) / 0.6;
      camera.position.x = (1 - Math.min(galP * 2, 1)) * 1;
      camera.position.y = 4 - Math.min(galP * 2, 1) * 3.5;
      camera.position.z = 3 - galP * 1;
      camera.lookAt(0, 0, -5);
    }
  });

  return null;
}

// ==========================================
// MAIN SCENE
// ==========================================
function Scene({ scrollProgress }) {
  return (
    <>
      {/* Fog for depth */}
      <fog attach="fog" args={['#dbeafe', 15, 70]} />

      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1} color="#fffcf5" />
      <pointLight position={[-3, 3, -5]} intensity={0.4} color="#c4b5fd" />
      <pointLight position={[4, -2, -20]} intensity={0.3} color="#fbcfe8" />
      <pointLight position={[-5, 2, -40]} intensity={0.3} color="#a5f3fc" />
      <pointLight position={[3, 1, -55]} intensity={0.2} color="#fde68a" />

      <CameraController scrollProgress={scrollProgress} />
      <Particles />
      <FloatingBokeh />
      <FloatingShapes />

      <Suspense fallback={null}>
        <MapPlane scrollProgress={scrollProgress} />
      </Suspense>

      {pinData.map((pin, i) => (
        <MemoryPin
          key={i}
          index={i}
          position={pin.pos}
          color={pin.color}
          scrollProgress={scrollProgress}
        />
      ))}

      {photos.map((photo, i) => (
        <PhotoFrame
          key={i}
          index={i}
          position={[photo.x, photo.y, photo.z]}
          rotationY={photo.ry}
          scrollProgress={scrollProgress}
          label={photo.label}
          color={photo.color}
          img={photo.img}
        />
      ))}

      {/* Background gradient plane */}
      <mesh position={[0, 0, -75]}>
        <planeGeometry args={[150, 100]} />
        <meshBasicMaterial color="#c7d2fe" />
      </mesh>
    </>
  );
}

// ==========================================
// EXPORTED COMPONENT
// ==========================================
export default function MapGallery() {
  const containerRef = useRef(null);
  const scrollProgress = useRef(0);
  const targetScroll = useRef(0);
  const rafId = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollParent = container.closest('.scrollable-container');
    if (!scrollParent) return;

    const handleScroll = () => {
      const scrollTop = scrollParent.scrollTop;
      const scrollHeight = scrollParent.scrollHeight - scrollParent.clientHeight;
      if (scrollHeight > 0) {
        targetScroll.current = Math.min(1, Math.max(0, scrollTop / scrollHeight));
      }
    };

    // Smooth lerp loop — eliminates all jerkiness
    const smoothLoop = () => {
      scrollProgress.current += (targetScroll.current - scrollProgress.current) * 0.06;
      rafId.current = requestAnimationFrame(smoothLoop);
    };

    scrollParent.addEventListener('scroll', handleScroll, { passive: true });
    rafId.current = requestAnimationFrame(smoothLoop);

    return () => {
      scrollParent.removeEventListener('scroll', handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Fixed 3D Canvas */}
      <div className="sticky top-0 left-0 w-full h-screen z-0">
        <Canvas
          camera={{ position: [0, 6, 6], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false }}
        >
          <color attach="background" args={['#e0f2fe']} />
          <Scene scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      {/* Scroll Height Driver */}
      <div className="relative z-10 pointer-events-none">
        <div className="h-[100vh] flex items-center justify-center">
          <div className="text-center pointer-events-auto">
            <h2 className="text-5xl md:text-7xl font-display font-black text-slate-800 drop-shadow-md">
              Our Map of <span className="text-pink-500">Memories</span>
            </h2>
            <p className="mt-4 text-xl text-slate-500 font-medium bg-white/50 backdrop-blur-sm px-6 py-3 rounded-2xl inline-block shadow-sm">
              Scroll down to explore ↓
            </p>
          </div>
        </div>

        <div className="h-[80vh] flex items-center justify-center">
          <div className="text-center pointer-events-auto">
            <p className="text-3xl md:text-5xl font-display font-bold text-slate-700/80 drop-shadow-sm">
              Every place holds a <span className="text-purple-500">story</span>...
            </p>
          </div>
        </div>

        <div className="h-[100vh] flex items-start justify-center pt-20">
          <div className="text-center pointer-events-auto">
            <span className="text-orange-500 font-bold tracking-widest uppercase text-sm mb-2 block">Gallery</span>
            <h3 className="text-4xl md:text-5xl font-display font-bold text-slate-800 drop-shadow-sm">
              🌿 Your Peace
            </h3>
          </div>
        </div>

        <div className="h-[100vh] flex items-start justify-center pt-20">
          <div className="text-center pointer-events-auto">
            <h3 className="text-4xl md:text-5xl font-display font-bold text-slate-800 drop-shadow-sm">
              🥰 The Baddie and Cutie
            </h3>
          </div>
        </div>

        <div className="h-[80vh] flex items-center justify-center">
          <div className="text-center pointer-events-auto">
            <h3 className="text-4xl md:text-6xl font-display font-bold text-pink-500 drop-shadow-md">
              ✨ More memories are Coming Soon...... ✨
              
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
