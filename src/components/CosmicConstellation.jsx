import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// ==========================================
// PURVA PHALGUNI CONSTELLATION
// ==========================================
const stars = [
  // Left — triangle
  { x: -3.0, y: -0.99, name: 'Sukun', bright: false },     // 0 — far-left (tail)
  { x: -1.3, y:  0.4, name: 'Noor', bright: true },        // 1 — RED star (upper-left body)
  { x: -1, y: -0.7, name: 'Inayat', bright: false },       // 2 — lower-left body

  // Body — center
  { x:  0.9, y:  0.6, name: 'Rooh', bright: false },       // 3 — center-upper
  { x:  1.6, y: 0.01, name: 'Barkat', bright: false },     // 4 — center-right body

  // Right — bottom
  { x:  1.8, y: -0.8, name: 'Khushi', bright: false },     // 5 — far-right bottom

  // Head — compact Y-fork
  { x:  0.9, y:  1.4, name: 'Fitoor', bright: false },     // 6 — head base (neck)
  { x:  1.8, y:  2.5, name: 'Manzil', bright: false },     // 7 — head top
  { x:  2.4, y:  2.1, name: 'Jannat', bright: false },     // 8 — fork right
];

// Lines — drawn ONE BY ONE as you scroll
const lines = [
  [0, 1],  // tail → red star (left diagonal up)
  [0, 2],  // tail → lower-left (left side down)
  [1, 3],  // red star → center upper (top body line)
  [1, 2],  // red star → lower-left (closes left triangle)
  [3, 4],  // center → right body (upper-right)
  [4, 5],  // right body → bottom-right (down diagonal)
  [2, 5],  // lower-left → bottom-right (long bottom line)
  [3, 6],  // center → head base (neck going up)
  [6, 7],  // head base → head top
  [7, 8],  // head top → fork right
];

// ==========================================
// BACKGROUND STARS — deep space twinkle
// ==========================================
function BackgroundStars({ count = 3000 }) {
  const ref = useRef();
  const elapsedRef = useRef(0);
  const [positions] = useState(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 2] = -Math.random() * 25 - 2;
    }
    return pos;
  });

  useFrame((state, delta) => {
    elapsedRef.current += delta;
    if (!ref.current) return;
    ref.current.rotation.y = elapsedRef.current * 0.002;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#e2e8f0" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

// ==========================================
// SOFT NEBULA GLOW — pastel galaxy feel
// ==========================================
const CLOUDS_DATA = [
  { pos: [-12, 6, -18], size: 4, color: '#4c1d95' },
  { pos: [14, -5, -20], size: 5, color: '#831843' },
  { pos: [-8, -7, -16], size: 3, color: '#1e3a5f' },
  { pos: [8, 8, -22], size: 5, color: '#78350f' },
  { pos: [0, 1, -14], size: 2.5, color: '#581c87' },
  { pos: [-15, 0, -18], size: 4, color: '#9d174d' },
];

function NebulaClouds() {
  return (
    <group>
      {CLOUDS_DATA.map((n, i) => (
        <mesh key={i} position={n.pos}>
          <sphereGeometry args={[n.size, 12, 12]} />
          <meshBasicMaterial color={n.color} transparent opacity={0.04} />
        </mesh>
      ))}
    </group>
  );
}

// ==========================================
// DIVINE GLOW — appears when constellation is complete
// ==========================================
function DivineGlow({ scrollProgress }) {
  const glowRef = useRef();
  const raysRef = useRef();
  const elapsedRef = useRef(0);

  useFrame((state, delta) => {
    elapsedRef.current += delta;
    if (!glowRef.current) return;
    const p = scrollProgress.current;
    const time = elapsedRef.current;

    // Glow appears after all lines are drawn (90%+)
    const glowProgress = Math.min(1, Math.max(0, (p - 0.88) / 0.12));
    const easedGlow = glowProgress * glowProgress;

    glowRef.current.material.opacity = easedGlow * 0.2;
    glowRef.current.scale.setScalar(1 + Math.sin(time * 0.8) * 0.05 * easedGlow);

    if (raysRef.current) {
      raysRef.current.material.opacity = easedGlow * 0.12;
      raysRef.current.rotation.z = time * 0.1;
    }
  });

  return (
    <group position={[0, 1, -0.5]}>
      {/* Inner glow */}
      <mesh ref={glowRef}>
        <circleGeometry args={[6, 32]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0} side={THREE.DoubleSide} />
      </mesh>
      {/* Rotating rays */}
      <mesh ref={raysRef}>
        <ringGeometry args={[4, 8, 6]} />
        <meshBasicMaterial color="#fde68a" transparent opacity={0} side={THREE.DoubleSide} wireframe />
      </mesh>
    </group>
  );
}

// ==========================================
// THE CONSTELLATION — dots + sequential line connections
// ==========================================
function Constellation({ scrollProgress }) {
  const groupRef = useRef();
  const starMeshes = useRef([]);
  const glowMeshes = useRef([]);
  const starTextRefs = useRef([]);
  const starParticlesRefs = useRef([]);
  const lineRefs = useRef([]);
  const elapsedRef = useRef(0);

  useFrame((state, delta) => {
    elapsedRef.current += delta;
    if (!groupRef.current) return;
    const p = scrollProgress.current;
    const time = elapsedRef.current;
    const totalLines = lines.length; // 9 lines

    // Each line occupies a portion of 5% to 90% scroll
    const linePhaseStart = 0.05;
    const linePhaseEnd = 0.88;

    // --- Update stars: twinkle + brighten when their line arrives ---
    stars.forEach((star, i) => {
      const mesh = starMeshes.current[i];
      const glow = glowMeshes.current[i];
      if (!mesh) return;

      // Base twinkle
      const twinkle = 1 + Math.sin(time * 3 + i * 1.3) * 0.2;

      // Check if this star is "active" (connected by any drawn line)
      let isActive = false;
      lines.forEach(([a, b], lineIdx) => {
        const lineStart = linePhaseStart + (lineIdx / totalLines) * (linePhaseEnd - linePhaseStart);
        const lineEnd = linePhaseStart + ((lineIdx + 1) / totalLines) * (linePhaseEnd - linePhaseStart);
        const lineProgress = Math.min(1, Math.max(0, (p - lineStart) / (lineEnd - lineStart)));
        if ((a === i || b === i) && lineProgress > 0.5) isActive = true;
      });

      // Divine mode when all lines complete
      const divineProgress = Math.min(1, Math.max(0, (p - 0.88) / 0.12));

      const activeBoost = isActive ? 1.4 : 0.8;
      const divineBoost = 1 + divineProgress * 0.6;

      mesh.scale.setScalar(twinkle * activeBoost * divineBoost);
      mesh.material.emissiveIntensity = (isActive ? 2.5 : 0.8) + divineProgress * 3;
      mesh.material.opacity = (isActive ? 1 : 0.5) + divineProgress * 0.5;

      if (glow) {
        glow.scale.setScalar(isActive ? twinkle * 1.2 * divineBoost : 0.01);
        glow.material.opacity = isActive ? 0.2 + divineProgress * 0.15 : 0;
      }

      // Star text logic
      if (starTextRefs.current[i]) {
        const textEl = starTextRefs.current[i];
        // Fade in when active, fade out completely when divine glow hits 50%
        const targetOpacity = isActive ? Math.max(0, 1 - divineProgress * 2) : 0;
        const currentOpacity = parseFloat(textEl.style.opacity || 0);
        textEl.style.opacity = String(THREE.MathUtils.lerp(currentOpacity, targetOpacity, delta * 8));
        textEl.style.transform = `scale(${0.8 + currentOpacity * 0.2})`;
      }
      
      // Star particles logic
      if (starParticlesRefs.current[i]) {
        starParticlesRefs.current[i].visible = isActive && divineProgress < 0.5;
      }
    });

    // --- Update lines: draw one by one based on scroll ---
    lines.forEach(([aIdx, bIdx], lineIdx) => {
      const lineObj = lineRefs.current[lineIdx];
      if (!lineObj) return;

      const lineStart = linePhaseStart + (lineIdx / totalLines) * (linePhaseEnd - linePhaseStart);
      const lineEnd = linePhaseStart + ((lineIdx + 1) / totalLines) * (linePhaseEnd - linePhaseStart);
      const lineProgress = Math.min(1, Math.max(0, (p - lineStart) / (lineEnd - lineStart)));

      const starA = stars[aIdx];
      const starB = stars[bIdx];

      const geo = lineObj.geometry;
      const positions = geo.attributes.position.array;

      positions[0] = starA.x;
      positions[1] = starA.y;
      positions[2] = 0;
      positions[3] = THREE.MathUtils.lerp(starA.x, starB.x, lineProgress);
      positions[4] = THREE.MathUtils.lerp(starA.y, starB.y, lineProgress);
      positions[5] = 0;

      geo.attributes.position.needsUpdate = true;

      // Divine glow makes lines brighter
      const divineProgress = Math.min(1, Math.max(0, (p - 0.88) / 0.12));
      lineObj.material.opacity = lineProgress > 0.01 ? (0.7 + divineProgress * 0.3) : 0;
      lineObj.material.color.set(divineProgress > 0.5 ? '#fef3c7' : '#fbbf24');
    });

    // Gentle sway when complete
    const divineProgress = Math.min(1, Math.max(0, (p - 0.88) / 0.12));
    groupRef.current.rotation.z = Math.sin(time * 0.3) * 0.015 * divineProgress;
  });

  return (
    <group ref={groupRef}>
      {/* Constellation star dots — SMALL */}
      {stars.map((star, i) => (
        <group key={i} position={[star.x, star.y, 0]}>
          {/* Particles for the active star */}
          <group ref={(el) => (starParticlesRefs.current[i] = el)} visible={false}>
            <Sparkles count={15} scale={1.2} size={3} speed={0.4} opacity={0.6} color="#fbbf24" noise={1} />
          </group>

          {/* Hindi Name Label */}
          <Html position={[0, -0.22, 0]} center zIndexRange={[10, 0]}>
            <div 
               ref={(el) => (starTextRefs.current[i] = el)}
               className="pointer-events-none opacity-0"
               style={{ 
                 color: '#fde68a', 
                 fontFamily: "'Dancing Script', cursive, sans-serif", 
                 fontSize: '1.4rem',
                 textShadow: '0 0 10px rgba(251,191,36,0.8), 0 0 20px rgba(251,191,36,0.4)',
                 whiteSpace: 'nowrap',
                 willChange: 'opacity, transform'
               }}
            >
              {star.name}
            </div>
          </Html>

          {/* Tiny star dot */}
          <mesh ref={(el) => (starMeshes.current[i] = el)}>
            <sphereGeometry args={[star.bright ? 0.08 : 0.06, 12, 12]} />
            <meshStandardMaterial
              color={star.bright ? '#fca5a5' : '#f5f5f4'}
              emissive={star.bright ? '#ef4444' : '#fbbf24'}
              emissiveIntensity={0.8}
              transparent
              opacity={0.5}
            />
          </mesh>
          {/* Tiny subtle glow */}
          <mesh ref={(el) => (glowMeshes.current[i] = el)} scale={0.01}>
            <ringGeometry args={[0.08, 0.15, 16]} />
            <meshBasicMaterial color={star.bright ? '#fca5a5' : '#fde68a'} transparent opacity={0} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}

      {/* Connection lines — one per connection */}
      {lines.map((_, i) => {
        const posArray = new Float32Array(6);
        return (
          <lineSegments key={`line-${i}`} ref={(el) => (lineRefs.current[i] = el)}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={posArray}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#fbbf24" transparent opacity={0} />
          </lineSegments>
        );
      })}
    </group>
  );
}

// ==========================================
// DIVINE TITLE — appears at the end
// ==========================================
function DivineTitle({ scrollProgress }) {
  const ref = useRef();

  useEffect(() => {
    const animate = () => {
      if (!ref.current) return;
      const p = scrollProgress.current;
      const divineProgress = Math.min(1, Math.max(0, (p - 0.88) / 0.12));
      ref.current.style.opacity = String(divineProgress);
      ref.current.style.transform = `translateY(${(1 - divineProgress) * 30}px) scale(${0.8 + divineProgress * 0.2})`;
      requestAnimationFrame(animate);
    };
    const raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [scrollProgress]);

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 w-full h-screen pointer-events-none z-30 flex flex-col items-center justify-center gap-4 opacity-0"
    >
      <p
        className="text-sm tracking-[0.3em] uppercase font-bold"
        style={{ color: '#c4b5fd', textShadow: '0 0 20px rgba(139,92,246,0.5)' }}
      >
        Purva Phalguni
      </p>
      <h2
        className="text-5xl md:text-7xl font-bold mt-2"
        style={{
          color: '#fef3c7',
          textShadow: '0 0 40px rgba(251,191,36,0.6), 0 0 80px rgba(251,191,36,0.3)',
          fontFamily: "'Dancing Script', cursive, sans-serif"
        }}
      >
        ✦ Purva Phalguni ✦
      </h2>
      <div
        className="text-lg md:text-xl mt-6 flex flex-col items-center gap-3 font-medium tracking-wider"
        style={{ color: '#e9d5ff', textShadow: '0 0 15px rgba(139,92,246,0.5)' }}
      >
        <p>✨ Endless Warmth & Affection ✨</p>
        <p>✨ Fierce Creative Passion ✨</p>
        <p>✨ Bringer of Deep Peace ✨</p>
      </div>
    </div>
  );
}

// ==========================================
// CAMERA
// ==========================================
function CosmicCamera({ scrollProgress }) {
  const { camera } = useThree();
  useFrame(() => {
    const p = scrollProgress.current;
    camera.position.x = Math.sin(p * Math.PI * 0.2) * 0.5; // eslint-disable-line react-hooks/immutability
    camera.position.y = 0.8 + Math.cos(p * Math.PI * 0.15) * 0.3;
    camera.position.z = 10 - p * 0.8;
    camera.lookAt(0, 0.5, 0);
  });
  return null;
}

// ==========================================
// SCENE
// ==========================================
function CosmicScene({ scrollProgress }) {
  return (
    <>
      <ambientLight intensity={0.08} />
      <pointLight position={[0, 5, 5]} intensity={0.3} color="#fbbf24" />
      <pointLight position={[-6, -3, 3]} intensity={0.15} color="#a855f7" />
      <pointLight position={[6, 2, -2]} intensity={0.1} color="#ec4899" />

      <CosmicCamera scrollProgress={scrollProgress} />
      <BackgroundStars />
      <NebulaClouds />
      <Constellation scrollProgress={scrollProgress} />
      <DivineGlow scrollProgress={scrollProgress} />

      {/* Deep space background */}
      <mesh position={[0, 0, -30]}>
        <planeGeometry args={[120, 80]} />
        <meshBasicMaterial color="#050210" />
      </mesh>
    </>
  );
}

// ==========================================
// EXPORT
// ==========================================
export default function CosmicConstellation() {
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

    const smoothLoop = () => {
      scrollProgress.current += (targetScroll.current - scrollProgress.current) * 0.05;
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
      <div className="sticky top-0 left-0 w-full h-screen z-0">
        <Canvas
          camera={{ position: [0, 1, 9], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false }}
        >
          <color attach="background" args={['#050210']} />
          <CosmicScene scrollProgress={scrollProgress} />
        </Canvas>
        <DivineTitle scrollProgress={scrollProgress} />
      </div>

      {/* Scroll driver — LONG so each line has reading time */}
      <div className="relative z-10 pointer-events-none">
        <div className="h-[120vh]" />  {/* Initial — see the stars */}
        <div className="h-[500vh]" /> {/* Lines connecting one by one + text */}
        <div className="h-[180vh]" /> {/* Divine reveal */}
        <div className="h-[80vh]" />  {/* Hold at the end */}
      </div>
    </div>
  );
}
