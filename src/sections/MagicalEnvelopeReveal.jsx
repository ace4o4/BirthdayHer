import React, { useRef, useMemo, useLayoutEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Instances, Instance, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// Procedural 3D Chest/Box Component for the Main Centerpiece
const MainEnvelope = ({ isSwirling, envelopeStep }) => {
  const groupRef = useRef();
  const flapRef = useRef();
  const cardRef = useRef();
  const elapsedRef = useRef(0);

  // Hovering effect before swirl
  useFrame((state, delta) => {
    elapsedRef.current += delta;
    if (!isSwirling && groupRef.current) {
      groupRef.current.position.y = Math.sin(elapsedRef.current * 2) * 0.15;
    }
  });

  useLayoutEffect(() => {
    if (isSwirling && groupRef.current) {
      // 1. Shoot upwards when vortex starts
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
      // 2. Open Flap (Chest Lid rotating backwards)
      gsap.to(flapRef.current.rotation, {
        x: -Math.PI * 0.55,
        duration: 1.2,
        ease: "bounce.out"
      });
      
      // 3. Card slides up slightly out of envelope
      if (cardRef.current) {
        gsap.to(cardRef.current.position, {
          y: 0.8,
          duration: 1,
          delay: 0.3,
          ease: "power2.out"
        });
      }

      // 4. Trigger Mint-Green Confetti Burst
      setTimeout(() => {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.4 },
          colors: ['#a7f3d0', '#6ee7b7', '#34d399', '#ffffff'], // Mint Greens
          disableForReducedMotion: true
        });
      }, 500);
    } else if (envelopeStep === 0 && flapRef.current && isSwirling) {
      // Close flap if they scroll back up
      gsap.to(flapRef.current.rotation, { x: 0, duration: 0.5 });
      if (cardRef.current) gsap.to(cardRef.current.position, { y: 0, duration: 0.5 });
    }
  }, [envelopeStep, isSwirling]);

  return (
    <group ref={groupRef} scale={1.2}>
      {/* Chest Body */}
      <mesh position={[0, -0.25, 0]}>
        <boxGeometry args={[1.8, 0.8, 1]} />
        <meshStandardMaterial color="#fbcfe8" roughness={0.6} />
      </mesh>
      
      {/* Chest Body Gold Rim */}
      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[1.82, 0.05, 1.02]} />
        <meshStandardMaterial color="#fef08a" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* The pop-out magical card inside (Hidden until opened) */}
      <mesh ref={cardRef} position={[0, -0.2, 0]}>
         <planeGeometry args={[1.6, 1.1]} />
         <meshStandardMaterial color="#f8fafc" roughness={0.2} metalness={0.5} emissive="#6ee7b7" emissiveIntensity={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* Top Hinge Lid */}
      <group position={[0, 0.15, -0.5]} ref={flapRef}>
        <group position={[0, 0.25, 0.5]}>
          <mesh>
            <boxGeometry args={[1.8, 0.5, 1]} />
            <meshStandardMaterial color="#f9a8d4" roughness={0.6} />
          </mesh>
          
          {/* Lid Gold Rim Base */}
          <mesh position={[0, -0.25, 0]}>
            <boxGeometry args={[1.82, 0.05, 1.02]} />
            <meshStandardMaterial color="#fef08a" roughness={0.2} metalness={0.8} />
          </mesh>

          {/* Cute Wax Seal / Lock on the front of the lid */}
          <mesh position={[0, -0.1, 0.52]} rotation={[Math.PI / 2, 0, 0]}>
             <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
             <meshStandardMaterial color="#f43f5e" roughness={0.3} metalness={0.2} />
          </mesh>
          {/* Inner Lock Gold details */}
          <mesh position={[0, -0.1, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
             <cylinderGeometry args={[0.08, 0.08, 0.1, 32]} />
             <meshStandardMaterial color="#fef08a" roughness={0.2} metalness={0.8} />
          </mesh>
        </group>
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
    const pastelColors = ['#fbcfe8', '#fef08a', '#bbf7d0', '#bfdbfe', '#e9d5ff', '#fda4af'];
    
    for (let i = 0; i < count; i++) {
        // Initial hidden spawn position behind the main envelope
        const x = (Math.random() - 0.5) * 0.2; // eslint-disable-line react-hooks/purity
        const y = (Math.random() - 0.5) * 0.2; // eslint-disable-line react-hooks/purity
        const z = -0.5 + (Math.random() - 0.5) * 0.2; // eslint-disable-line react-hooks/purity
        
        const color = pastelColors[Math.floor(Math.random() * pastelColors.length)]; // eslint-disable-line react-hooks/purity
        
        // Vortex final parameters
        const angle = Math.random() * Math.PI * 2; // eslint-disable-line react-hooks/purity
        // Tornado shape: distribute height between -6 and +8, making the radius wider near the top
        const height = -6 + Math.random() * 14; // eslint-disable-line react-hooks/purity
        
        // Base radius calculation to shape the tornado (wider at top, narrower at bottom)
        const radiusFactor = (height + 15) / 14; // 0 to 1 based on height
        const radius = 1.5 + (radiusFactor * 4) + (Math.random() * 1.5); // eslint-disable-line react-hooks/purity
        
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
      <boxGeometry args={[0.4, 0.25, 0.05]} /> {/* Small dummy envelope shape */}
      <meshStandardMaterial roughness={0.3} metalness={0.1} />
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
             className="absolute inset-x-4 md:inset-x-auto md:w-[650px] md:left-1/2 md:-translate-x-1/2 top-24 bottom-16 bg-[#fffdf0] rounded-sm shadow-2xl z-30 p-10 flex flex-col items-center justify-center pointer-events-auto"
             style={{
                backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')",
                boxShadow: "0 40px 60px -15px rgba(0,0,0,0.6), inset 0 0 80px rgba(212,175,55,0.15)",
                border: "1px solid #e5e5e5",
                borderImage: "linear-gradient(to bottom right, #d4af37, #fef08a, #d4af37) 1"
             }}
           >
             {/* Royal Gold Foil Border Accent */}
             <div className="absolute inset-4 border-2 border-[#d4af37] opacity-60 pointer-events-none"></div>
             <div className="absolute inset-5 border border-[#d4af37] opacity-30 pointer-events-none"></div>

             {/* SVG Handwriting Title */}
             <div className="w-full max-w-md mb-8 z-10 drop-shadow-sm">
                <svg viewBox="0 0 400 120" className="w-full h-auto">
                    <motion.path
                       initial={{ pathLength: 0 }}
                       animate={{ pathLength: 1 }}
                       transition={{ duration: 2.5, delay: 0.8, ease: "easeInOut" }}
                       fill="none"
                       stroke="#831843"
                       strokeWidth="4"
                       strokeLinecap="round"
                       strokeLinejoin="round"
                       d={cursivePath} 
                    />
                    <motion.text
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       transition={{ delay: 3, duration: 1 }}
                       x="50%" 
                       y="70" 
                       textAnchor="middle" 
                       fontFamily="'Dancing Script', cursive" 
                       fontSize="55" 
                       fill="#831843"
                       className="drop-shadow-sm"
                    >
                       Happy Birthday!
                    </motion.text>
                </svg>
             </div>

             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.5, duration: 1 }}
                className="text-[#4c0519] font-serif text-xl md:text-2xl text-center leading-relaxed px-4 z-10"
             >
                <p className="mb-4">
                  May your year ahead be filled with as much joy, magic, and beautiful chaos as this very moment.
                </p>
                <p className="italic text-lg text-[#831843] opacity-80 mt-8">
                  Scroll down to discover what's next...
                </p>
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>
    </section>
  );
}
