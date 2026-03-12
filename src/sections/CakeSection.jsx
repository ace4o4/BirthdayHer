import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Cloud, Sparkles, Float, Cylinder, Cone, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

// Procedural 3D Cake Component
function Cake3D({ isExtinguished }) {
  // Candle flame refs for animation
  const flame1Ref = useRef();
  const flame2Ref = useRef();
  const flame3Ref = useRef();

  // Precompute sprinkle rotations once to avoid Math.random() in render
  const sprinkleRotations = useMemo(
    () => Array.from({ length: 15 }, () => [Math.random() * Math.PI, Math.random() * Math.PI, 0]), // eslint-disable-line react-hooks/purity
    []
  );

  useFrame((state, delta) => {
    // Flickering animation for flames when lit
    const t = state.clock.getElapsedTime();
    if (!isExtinguished) {
      const flicker1 = 1 + Math.sin(t * 10) * 0.1;
      const flicker2 = 1 + Math.cos(t * 12) * 0.1;
      const flicker3 = 1 + Math.sin(t * 15) * 0.1;
      
      if (flame1Ref.current) flame1Ref.current.scale.set(flicker1, flicker1, flicker1);
      if (flame2Ref.current) flame2Ref.current.scale.set(flicker2, flicker2, flicker2);
      if (flame3Ref.current) flame3Ref.current.scale.set(flicker3, flicker3, flicker3);
    } else {
      // Epic Blow-out Animation
      if (flame1Ref.current) {
         // Bend backward from wind pressure, shrink rapidly, jitter violently
         flame1Ref.current.rotation.x = THREE.MathUtils.lerp(flame1Ref.current.rotation.x, -Math.PI / 4, delta * 15);
         flame1Ref.current.position.y = THREE.MathUtils.lerp(flame1Ref.current.position.y, 0.2, delta * 10);
         flame1Ref.current.position.z = THREE.MathUtils.lerp(flame1Ref.current.position.z, -0.2, delta * 10);
         flame1Ref.current.scale.lerp(new THREE.Vector3(0,0,0), delta * 5);
      }
      if (flame2Ref.current) {
         flame2Ref.current.rotation.x = THREE.MathUtils.lerp(flame2Ref.current.rotation.x, -Math.PI / 4, delta * 15);
         flame2Ref.current.position.y = THREE.MathUtils.lerp(flame2Ref.current.position.y, 0.2, delta * 10);
         flame2Ref.current.position.z = THREE.MathUtils.lerp(flame2Ref.current.position.z, -0.2, delta * 10);
         flame2Ref.current.scale.lerp(new THREE.Vector3(0,0,0), delta * 5);
      }
      if (flame3Ref.current) {
         flame3Ref.current.rotation.x = THREE.MathUtils.lerp(flame3Ref.current.rotation.x, -Math.PI / 4, delta * 15);
         flame3Ref.current.position.y = THREE.MathUtils.lerp(flame3Ref.current.position.y, 0.2, delta * 10);
         flame3Ref.current.position.z = THREE.MathUtils.lerp(flame3Ref.current.position.z, -0.2, delta * 10);
         flame3Ref.current.scale.lerp(new THREE.Vector3(0,0,0), delta * 5);
      }
    }
  });

  // Reusable candle component
  const Candle = ({ position, flameRef }) => (
    <group position={position}>
      {/* Candle Body */}
      <Cylinder args={[0.06, 0.06, 0.5, 16]} position={[0, 0.25, 0]}>
        <meshStandardMaterial color="#fcd34d" roughness={0.7} />
      </Cylinder>
      {/* Wick */}
      <Cylinder args={[0.01, 0.01, 0.1, 8]} position={[0, 0.55, 0]}>
        <meshStandardMaterial color="#333333" roughness={0.9} />
      </Cylinder>
      
      {/* Flame & Light (Wrapped in a group to allow the flame mesh itself to lean/animate) */}
      <group position={[0, 0.7, 0]}>
          <group ref={flameRef}>
            {/* Outer Flame (Orange Glow) */}
            <mesh position={[0, 0.05, 0]}>
               <sphereGeometry args={[0.15, 16, 16]} />
               <meshBasicMaterial color="#f97316" transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
            {/* Inner Core Flame (White/Yellow) */}
            <mesh position={[0, 0, 0]}>
               <coneGeometry args={[0.06, 0.25, 16]} />
               <meshBasicMaterial color="#ffffff" />
            </mesh>
            {/* Flame Base (Orange) */}
            <mesh position={[0, -0.05, 0]}>
               <sphereGeometry args={[0.06, 16, 16]} />
               <meshBasicMaterial color="#fb923c" />
            </mesh>
            
            {/* The light source attached to the flame */}
            <pointLight intensity={isExtinguished ? 0 : 2} distance={6} decay={2} color="#fef08a" />
          </group>
          
          {/* Smoke Puff when extinguished */}
          {isExtinguished && (
            <Sparkles 
              count={20} 
              scale={[0.4, 2, 0.4]} 
              size={6} 
              speed={0.8} 
              opacity={0.3} 
              color="#d4d4d8" 
              position={[0, 1, 0]} 
              noise={2}
            />
          )}
      </group>
    </group>
  );

  return (
    <group position={[0, -1, 0]}>
      {/* Plate */}
      <Cylinder args={[2.5, 2.7, 0.2, 32]} position={[0, 0.1, 0]}>
         <meshStandardMaterial color="#f8fafc" roughness={0.5} metalness={0.1} />
      </Cylinder>

      {/* Bottom Tier */}
      <Cylinder args={[2, 2, 0.8, 32]} position={[0, 0.6, 0]}>
         <meshStandardMaterial color="#fbcfe8" roughness={0.8} />
      </Cylinder>

      {/* Top Tier */}
      <Cylinder args={[1.5, 1.5, 0.8, 32]} position={[0, 1.4, 0]}>
         <meshStandardMaterial color="#f0fdf4" roughness={0.8} />
      </Cylinder>
      
      {/* Icing/Frosting Details */}
      <Cylinder args={[1.55, 1.55, 0.2, 32]} position={[0, 1.8, 0]}>
         <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </Cylinder>

      {/* Cute Frosting Dollops */}
      {[...Array(8)].map((_, i) => (
        <Sphere key={`dollop-${i}`} args={[0.2, 16, 16]} position={[
          Math.cos((i * Math.PI) / 4) * 1.3,
          1.9,
          Math.sin((i * Math.PI) / 4) * 1.3
        ]}>
          <meshStandardMaterial color="#ffffff" roughness={0.3} />
        </Sphere>
      ))}

      {/* Decorative Sprinkles on Bottom Tier */}
      {[...Array(15)].map((_, i) => (
        <Cylinder key={`sprinkle-${i}`} args={[0.03, 0.03, 0.15, 8]} position={[
          Math.cos(i) * 2.02,
          0.6 + Math.sin(i*3) * 0.3,
          Math.sin(i) * 2.02
        ]} rotation={sprinkleRotations[i]}>
           <meshStandardMaterial color={['#fef08a', '#60a5fa', '#f87171'][i%3]} />
        </Cylinder>
      ))}

      {/* Candles */}
      <Candle position={[-0.4, 1.9, 0.4]} flameRef={flame1Ref} />
      <Candle position={[0.4, 1.9, 0.3]} flameRef={flame2Ref} />
      <Candle position={[0, 1.9, -0.5]} flameRef={flame3Ref} />
    </group>
  );
}

// Minimal aesthetic lighting and environment
function EnvironmentSetup({ isExtinguished }) {
  const ambientRef = useRef();
  const spotlightRef = useRef();
  
  useFrame((state, delta) => {
     if (ambientRef.current) {
        // Drop ambient light dramatically when candles go out
        const targetIntensity = isExtinguished ? 0.05 : 0.8;
        ambientRef.current.intensity = THREE.MathUtils.lerp(ambientRef.current.intensity, targetIntensity, delta * 2);
     }
     if (spotlightRef.current && isExtinguished) {
        // Fade in a dramatic spotlight from above when it gets dark
        spotlightRef.current.intensity = THREE.MathUtils.lerp(spotlightRef.current.intensity, 3, delta * 2);
     }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.8} color="#ffffff" />
      <spotLight ref={spotlightRef} position={[0, 10, 0]} angle={0.5} penumbra={0.5} intensity={0} color="#e0e7ff" castShadow />
      
      {/* Soft animated pastel skies */}
      {!isExtinguished && (
        <group position={[0, -5, -15]}>
           <Cloud opacity={0.5} speed={0.4} width={10} depth={1.5} segments={20} color="#fce7f3" />
        </group>
      )}
    </>
  );
}


export default function CakeSection({ onBlowCandles }) {
  const [isBlowing, setIsBlowing] = useState(false);
  const [isExtinguished, setIsExtinguished] = useState(false);
  const [micError, setMicError] = useState(false);
  
  // Audio Refs
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const animationFrameRef = useRef(null);

  const triggerExtinguish = useCallback(() => {
    setIsExtinguished(true);
    setIsBlowing(false);
    
    // Cleanup mic stream to save resources
    if (microphoneRef.current) {
      microphoneRef.current.mediaStream.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Pass control to the parent (App) after the "lights out" animation finishes (Phase 1 & 2 only)
    setTimeout(() => {
      onBlowCandles();
    }, 3000); 
  }, [onBlowCandles]);

  useEffect(() => {
    // Longer warmup to completely bypass the hardware switch-on pop
    let isWarmupComplete = false;
    const warmupTimer = setTimeout(() => {
      isWarmupComplete = true;
    }, 2500);

    // Auto-extinguish fallback timer (12 seconds)
    // If the mic algorithm completely fails on their hardware, the cake will just gracefully blow out anyway so they aren't stuck.
    const autoBlowTimer = setTimeout(() => {
      if (isBlowing && !isExtinguished) {
         triggerExtinguish();
      }
    }, 12000);

    if (isBlowing && !isExtinguished && analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      
      const checkVolume = () => {
        if (!isBlowing || isExtinguished) return;

        analyserRef.current.getByteFrequencyData(dataArray);
        
        if (isWarmupComplete) {
          let sum = 0;
          let peak = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
            if (dataArray[i] > peak) peak = dataArray[i];
          }
          const averageVolume = sum / dataArray.length;

          // Extreme Threshold: Only a high-pressure blow directly into the mic should hit > 230
          if (peak > 230 || averageVolume > 60) {
            triggerExtinguish();
            return; // Stop looping
          }
        }
        
        animationFrameRef.current = requestAnimationFrame(checkVolume);
      };
      
      checkVolume();
    }

    return () => {
      clearTimeout(warmupTimer);
      clearTimeout(autoBlowTimer);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isBlowing, isExtinguished, triggerExtinguish]);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyserNode = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      
      analyserNode.fftSize = 256;
      source.connect(analyserNode);

      audioContextRef.current = audioCtx;
      analyserRef.current = analyserNode;
      microphoneRef.current = source;
      
      setIsBlowing(true);
      setMicError(false);
    } catch (err) {
      console.error('Microphone access denied or not supported', err);
      setMicError(true);
    }
  };

  return (
    <section 
      className={`min-h-screen w-full relative overflow-hidden transition-colors duration-2000 ${isExtinguished ? 'bg-[#0f172a]' : 'bg-[#e8f4f8]'}`}
      onClick={() => {
        // Fallback: If they click anywhere while it's waiting for a blow, or if mic failed, extinguish manually
        if (!isExtinguished) triggerExtinguish();
      }}
    >
      
      {/* 3D Canvas Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
          <EnvironmentSetup isExtinguished={isExtinguished} />
          <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.5}>
             <Cake3D isExtinguished={isExtinguished} />
          </Float>
        </Canvas>
      </div>

      {/* HTML UI Overlay Layer */}
      <div className="absolute inset-x-0 bottom-20 z-20 flex flex-col items-center pointer-events-auto">
        <AnimatePresence>
          {!isExtinguished && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-display text-slate-800 mb-8 drop-shadow-sm font-bold">
                Happy Birthday!
              </h1>
              
              {!isBlowing ? (
                <button
                  onClick={(e) => { e.stopPropagation(); startListening(); }}
                  className="px-8 py-4 bg-white/80 backdrop-blur-md text-pink-600 font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all outline-none border-2 border-pink-200"
                >
                  Click to make a wish & turn on Mic! 💨
                </button>
              ) : (
                <div className="space-y-4">
                  <p className="text-pink-600 font-bold text-xl animate-pulse">
                    Waiting for a BIG blow into your mic... 😮💨
                  </p>
                  <p className="text-slate-500 text-sm font-medium">
                    (or just tap anywhere if it's not working)
                  </p>
                </div>
              )}

              {micError && (
                <p className="text-red-500 mt-4 font-semibold text-sm">
                  Mic access denied. Just tap the screen to blow them out!
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
