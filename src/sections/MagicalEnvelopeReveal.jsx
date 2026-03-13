import React, { useRef, useMemo, useState, useLayoutEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Instances, Instance, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Paper Envelope 3D Component — looks like a real folded paper envelope
const MainEnvelope = ({ isSwirling, envelopeStep }) => {
  const groupRef = useRef();
  const flapRef = useRef();
  const cardRef = useRef();
  const sealRef = useRef();

  // Hovering effect before swirl
  useFrame((state) => {
    if (!isSwirling && groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.15;
    }
  });

  useLayoutEffect(() => {
    if (isSwirling && groupRef.current) {
      gsap.to(groupRef.current.position, {
        y: 3.5,
        duration: 1.5,
        ease: "power2.out"
      });
      gsap.to(groupRef.current.rotation, {
        y: Math.PI * 2,
        duration: 2,
        ease: "power2.out"
      });
    }
  }, [isSwirling]);

  useLayoutEffect(() => {
    if (envelopeStep === 1 && flapRef.current) {
      // Open flap — rotates backward like a real envelope flap
      gsap.to(flapRef.current.rotation, {
        x: -Math.PI * 0.75,
        duration: 1.0,
        ease: "power2.out"
      });
      // Hide the seal
      if (sealRef.current) {
        gsap.to(sealRef.current.scale, {
          x: 0, y: 0, z: 0,
          duration: 0.3,
          ease: "power2.in"
        });
      }
      // Card/letter slides up out of envelope
      if (cardRef.current) {
        gsap.to(cardRef.current.position, {
          y: 1.2,
          duration: 1.2,
          delay: 0.4,
          ease: "power2.out"
        });
      }
      // Confetti
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.4 },
          colors: ['#a7f3d0', '#6ee7b7', '#34d399', '#ffffff'],
          disableForReducedMotion: true
        });
      }, 500);
    } else if (envelopeStep === 0 && flapRef.current && isSwirling) {
      gsap.to(flapRef.current.rotation, { x: 0, duration: 0.5 });
      if (cardRef.current) gsap.to(cardRef.current.position, { y: 0, duration: 0.5 });
      if (sealRef.current) gsap.to(sealRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
    }
  }, [envelopeStep, isSwirling]);

  // Envelope dimensions
  const W = 2.2;  // width
  const H = 1.4;  // height
  const FLAP_H = 0.9; // flap height

  return (
    <group ref={groupRef} scale={1.2}>
      {/* ── Envelope Body (back panel) ── */}
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[W, H]} />
        <meshToonMaterial color="#f5e6d3" side={THREE.DoubleSide} />
      </mesh>

      {/* ── Envelope Front Panel (slightly in front) ── */}
      <mesh position={[0, -H * 0.07, 0.02]}>
        <planeGeometry args={[W, H * 0.85]} />
        <meshToonMaterial color="#faf0e6" side={THREE.DoubleSide} />
      </mesh>

      {/* ── Bottom fold line accent ── */}
      <mesh position={[0, -H * 0.5 + 0.02, 0.03]}>
        <planeGeometry args={[W, 0.03]} />
        <meshToonMaterial color="#e8d5c4" />
      </mesh>

      {/* ── Left side fold triangle ── */}
      <mesh position={[-W * 0.35, 0, 0.01]} rotation={[0, 0, 0]}>
        <planeGeometry args={[W * 0.32, H * 0.9]} />
        <meshToonMaterial color="#f0dcc8" side={THREE.DoubleSide} />
      </mesh>

      {/* ── Right side fold triangle ── */}
      <mesh position={[W * 0.35, 0, 0.01]} rotation={[0, 0, 0]}>
        <planeGeometry args={[W * 0.32, H * 0.9]} />
        <meshToonMaterial color="#f0dcc8" side={THREE.DoubleSide} />
      </mesh>

      {/* ── Thin border/edge line around envelope ── */}
      <mesh position={[0, 0, 0.025]}>
        <planeGeometry args={[W + 0.04, H + 0.04]} />
        <meshToonMaterial color="#dcc9b5" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0.026]}>
        <planeGeometry args={[W - 0.02, H - 0.02]} />
        <meshToonMaterial color="#faf0e6" side={THREE.DoubleSide} />
      </mesh>

      {/* ── Inner stripe details (like a real envelope) ── */}
      {[-0.4, -0.15, 0.1, 0.35].map((y, i) => (
        <mesh key={i} position={[0, y, -0.015]} >
          <planeGeometry args={[W * 0.85, 0.015]} />
          <meshToonMaterial color="#e8d5c4" />
        </mesh>
      ))}

      {/* ── The Letter/Card inside ── */}
      <group ref={cardRef} position={[0, 0, -0.01]}>
        <mesh>
          <planeGeometry args={[W * 0.88, H * 0.85]} />
          <meshToonMaterial color="#fffef5" side={THREE.DoubleSide} />
        </mesh>
        {/* Faint ruled lines on the letter */}
        {[-0.35, -0.2, -0.05, 0.1, 0.25, 0.4].map((y, i) => (
          <mesh key={`line-${i}`} position={[0, y, 0.001]}>
            <planeGeometry args={[W * 0.75, 0.008]} />
            <meshBasicMaterial color="#dde5ed" transparent opacity={0.5} />
          </mesh>
        ))}
        {/* Little heart doodle on letter */}
        <mesh position={[0.6, -0.45, 0.001]}>
          <planeGeometry args={[0.15, 0.15]} />
          <meshBasicMaterial color="#f9a8d4" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* ── Top Flap (triangular envelope flap) ── */}
      <group position={[0, H * 0.5, 0]} ref={flapRef}>
        {/* The flap pivots from the top edge of the envelope body */}
        <mesh position={[0, -FLAP_H * 0.45, 0.01]} rotation={[0, 0, 0]}>
          <planeGeometry args={[W, FLAP_H]} />
          <meshToonMaterial color="#eddcc6" side={THREE.DoubleSide} />
        </mesh>
        {/* Flap fold accent line */}
        <mesh position={[0, 0, 0.015]}>
          <planeGeometry args={[W, 0.025]} />
          <meshToonMaterial color="#d4c4ae" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* ── Wax Seal Heart ── */}
      <group ref={sealRef} position={[0, H * 0.05, 0.04]}>
        {/* Seal circle */}
        <mesh>
          <circleGeometry args={[0.22, 16]} />
          <meshToonMaterial color="#e11d48" />
        </mesh>
        {/* Inner seal detail */}
        <mesh position={[0, 0, 0.005]}>
          <circleGeometry args={[0.14, 12]} />
          <meshToonMaterial color="#f43f5e" />
        </mesh>
        {/* Heart shape on seal (simplified) */}
        <mesh position={[0, -0.02, 0.01]}>
          <circleGeometry args={[0.06, 8]} />
          <meshToonMaterial color="#fecdd3" />
        </mesh>
        <mesh position={[-0.04, 0.03, 0.01]}>
          <circleGeometry args={[0.04, 8]} />
          <meshToonMaterial color="#fecdd3" />
        </mesh>
        <mesh position={[0.04, 0.03, 0.01]}>
          <circleGeometry args={[0.04, 8]} />
          <meshToonMaterial color="#fecdd3" />
        </mesh>
      </group>
    </group>
  );
};

// The chaotic vortex swarm of 250 small dummy envelopes
const Swarm = ({ isSwirling }) => {
  const count = 250;
  const instanceRefs = useRef([]);
  instanceRefs.current = []; // Clear array on re-render to avoid stale refs

  const instancesData = useMemo(() => {
    const data = [];
    const vibrantPastels = ['#f472b6', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#fb923c', '#fecdd3'];
    
    for (let i = 0; i < count; i++) {
        // Initial hidden spawn position behind the main envelope
        const x = (Math.random() - 0.5) * 0.2;
        const y = (Math.random() - 0.5) * 0.2;
        const z = -0.5 + (Math.random() - 0.5) * 0.2;
        
        const color = vibrantPastels[Math.floor(Math.random() * vibrantPastels.length)];
        
        // Vortex final parameters
        const angle = Math.random() * Math.PI * 2;
        // Tornado shape: distribute height between -6 and +8, making the radius wider near the top
        const height = -6 + Math.random() * 14; 
        
        // Base radius calculation to shape the tornado (wider at top, narrower at bottom)
        const radiusFactor = (height + 15) / 14; // 0 to 1 based on height
        const radius = 1.5 + (radiusFactor * 4) + (Math.random() * 1.5); // 1.5 min radius -> 7 max radius
        
        data.push({ x, y, z, color, angle, radius, height, scale: 0 });
    }
    return data;
  }, [count]);

  const addRef = (el) => {
      if (el && !instanceRefs.current.includes(el)) {
          instanceRefs.current.push(el);
      }
  };

  useLayoutEffect(() => {
    if (!isSwirling) return;

    // We create a single GSAP timeline context to ensure clean garbage collection if unmounted
    const ctx = gsap.context(() => {
        instanceRefs.current.forEach((ref, i) => {
            const data = instancesData[i];

            // 1. Pop out (scale up) 
            gsap.to(ref.scale, {
                x: 1, y: 1, z: 1,
                duration: 0.5 + Math.random() * 0.5,
                ease: "back.out(1.5)",
                delay: Math.random() * 0.2
            });

            // 2. Animate out to vortex orbit and start spinning
            // We use a dummy JS object to hold values that GSAP easily tweens
            const proxy = { angle: data.angle, currentRadius: 0.1, y: data.y };
            
            // The burst translation outward
            gsap.to(proxy, {
               currentRadius: data.radius,
               y: data.height,
               duration: 1.5 + Math.random() * 1.5,
               ease: "power3.out",
               delay: Math.random() * 0.4
            });

            // The continuous spin around the vortex center
            const orbitSpeed = (3 / data.radius) + (Math.random() * 0.5); // Closer ones orbit much faster
            
            gsap.to(proxy, {
                angle: proxy.angle + Math.PI * 4 * orbitSpeed,
                duration: 10,
                repeat: -1,
                ease: "none",
                onUpdate: () => {
                    ref.position.x = proxy.currentRadius * Math.cos(proxy.angle);
                    ref.position.z = proxy.currentRadius * Math.sin(proxy.angle);
                    ref.position.y = proxy.y + Math.sin(proxy.angle * 3 + data.radius) * 0.3; // Add a chaotic up/down wobble
                }
            });

            // 3. Keep them tumbling randomly in 3D space
            gsap.to(ref.rotation, {
                x: "+=" + (Math.random() * Math.PI * 4 - Math.PI*2),
                y: "+=" + (Math.random() * Math.PI * 4 - Math.PI*2),
                z: "+=" + (Math.random() * Math.PI * 4 - Math.PI*2),
                duration: 4 + Math.random() * 4,
                repeat: -1,
                ease: "none"
            });
        });
    });

    return () => ctx.revert(); // Cleanup GSAP tweens if component unmounts
  }, [isSwirling, instancesData]);

  return (
    <Instances limit={count} range={count}>
      <boxGeometry args={[0.3, 0.2, 0.005]} /> {/* Thin paper card shape */}
      <meshToonMaterial />
      {instancesData.map((data, i) => (
        <Instance 
          key={i} 
          ref={addRef} 
          position={[data.x, data.y, data.z]} 
          scale={[0, 0, 0]} // Hidden initially
          color={data.color} 
        />
      ))}
    </Instances>
  );
};

export default function MagicalEnvelopeReveal({ envelopeStep, isSwirling, setIsSwirling }) {
  // SVG Handwriting Animation Path
  const cursivePath = "M20,60 C40,0 80,100 110,60 C120,40 140,40 160,60 C170,80 190,80 200,60 C220,10 260,110 280,60 C290,40 310,40 330,60 C340,80 370,80 380,60";

  return (
    <section 
      className="min-h-screen w-full relative bg-[#0f172a] overflow-hidden" 
      onClick={() => { if (!isSwirling) setIsSwirling(true); }}
    >
       {/* 3D Canvas */}
       <div className={`absolute inset-0 z-10 ${envelopeStep === 1 ? 'pointer-events-none' : ''}`}>
          <Canvas camera={{ position: [0, 0, 16], fov: 45 }}>
             <ambientLight intensity={0.6} color="#ffffff" />
             <directionalLight position={[10, 15, 10]} intensity={1.5} color="#fef08a" />
             <pointLight position={[0, 0, 5]} intensity={2} color="#fbcfe8" distance={20} />
             
             <Swarm isSwirling={isSwirling} />
             
             {/* Dynamic Central Envelope */}
             <MainEnvelope isSwirling={isSwirling} envelopeStep={envelopeStep} />
          </Canvas>
       </div>
       
       {/* UI Overlay - Vortex Start Instruction */}
       <div className="absolute top-1/4 w-full text-center z-20 pointer-events-none">
          <AnimatePresence>
            {!isSwirling && (
                <motion.h1 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
                  className="text-pink-300 text-3xl font-bold drop-shadow-lg tracking-widest animate-pulse"
                >
                   CLICK TO REVEAL MAGIC
                </motion.h1>
            )}
          </AnimatePresence>
       </div>

       {/* Royal Letter Overlay - Appears on Scroll (envelopeStep === 1) */}
       <AnimatePresence>
         {envelopeStep === 1 && (
           <motion.div
             initial={{ opacity: 0, scale: 0.8, y: 100, rotateX: 20 }}
             animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
             exit={{ opacity: 0, scale: 1.1, y: -50, filter: "blur(10px)" }}
             transition={{ duration: 1.2, ease: "easeOut" }}
             className="absolute inset-x-4 md:inset-x-auto md:w-[600px] md:left-1/2 md:-translate-x-1/2 top-16 bottom-16 bg-[#fffdf0] rounded-lg shadow-2xl z-30 p-2 sm:p-6 lg:p-10 pointer-events-auto flex flex-col items-center overflow-hidden"
             style={{
                backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')",
                boxShadow: "0 40px 60px -15px rgba(0,0,0,0.6), inset 0 0 80px rgba(236,72,153,0.1)",
                border: "1px solid #fbcfe8",
             }}
           >
             {/* Cute Border Accent */}
             <div className="absolute inset-3 border-2 border-pink-200 border-dashed rounded-lg opacity-60 pointer-events-none"></div>

             {/* Scrollable Letter Content */}
             <div className="w-full h-full overflow-y-auto scrollable-container pb-20 pt-8 px-4 sm:px-8 z-10 custom-scrollbar relative">
                
                {/* Header shifted up with cute font */}
                <motion.h2 
                   initial={{ opacity: 0, y: -20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.8, duration: 1 }}
                   className="text-center font-display text-5xl sm:text-6xl text-pink-500 mb-12 drop-shadow-sm font-bold"
                >
                   Happy Birthday! 🎂
                </motion.h2>

                {/* Paragraphs that reveal on scroll */}
                <div className="space-y-16 mt-8 font-sans text-xl sm:text-2xl text-slate-700 leading-relaxed text-center font-medium">
                  
                  <motion.p 
                     initial={{ opacity: 0, y: 40 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true, margin: "-50px" }}
                     transition={{ duration: 0.8 }}
                  >
                     Today is your special day, and you deserve nothing but the absolute best. 💖
                  </motion.p>
                  
                  <motion.p 
                     initial={{ opacity: 0, y: 40 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true, margin: "-50px" }}
                     transition={{ duration: 0.8 }}
                  >
                     May your year ahead be filled with as much joy, magic, and beautiful chaos as this very moment! ✨
                  </motion.p>

                  <motion.p 
                     initial={{ opacity: 0, scale: 0.8 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true, margin: "-50px" }}
                     transition={{ duration: 0.8, delay: 0.2 }}
                     className="text-pink-400 font-display text-3xl"
                  >
                     You are amazing! 🌟
                  </motion.p>

                  <motion.p 
                     initial={{ opacity: 0, y: 40 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true, margin: "-50px" }}
                     transition={{ duration: 0.8 }}
                  >
                     Let's make some wonderful memories today. Keep being the unique, brilliant person you are. 🌷
                  </motion.p>

                  <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: false, margin: "0px" }}
                     transition={{ duration: 0.8 }}
                     className="pt-24 pb-8 flex flex-col items-center justify-center opacity-70 text-pink-400"
                  >
                     <p className="italic text-lg mb-2">Scroll down to see what's next...</p>
                     <motion.div 
                        animate={{ y: [0, 8, 0] }} 
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="text-2xl"
                     >
                        👇
                     </motion.div>
                  </motion.div>

                </div>
             </div>

           </motion.div>
         )}
       </AnimatePresence>
    </section>
  );
}
