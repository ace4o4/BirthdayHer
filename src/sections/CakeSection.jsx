import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Sparkles, Float, Cylinder, Cone, Sphere, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

// ─────────────────────────────────────────────────────────────
// Floating Stickers & Emojis Data
// ─────────────────────────────────────────────────────────────
const FLOATING_STICKERS = [
  // Left side
  { emoji: '🎀', x: '8%',  y: '12%', size: '2.2rem', delay: 0, rotate: -15 },
  { emoji: '🌸', x: '5%',  y: '35%', size: '2rem',   delay: 0.3, rotate: 10 },
  { emoji: '🧁', x: '12%', y: '58%', size: '2.4rem', delay: 0.6, rotate: -8 },
  { emoji: '💖', x: '3%',  y: '78%', size: '1.8rem', delay: 0.9, rotate: 12 },
  { emoji: '🎂', x: '15%', y: '88%', size: '2rem',   delay: 1.2, rotate: -5 },
  { emoji: '✨', x: '7%',  y: '50%', size: '1.6rem', delay: 0.4, rotate: 20 },
  
  // Right side  
  { emoji: '🎈', x: '88%', y: '15%', size: '2.4rem', delay: 0.2, rotate: 15 },
  { emoji: '🦋', x: '92%', y: '38%', size: '2rem',   delay: 0.5, rotate: -12 },
  { emoji: '🍰', x: '85%', y: '55%', size: '2.2rem', delay: 0.8, rotate: 8 },
  { emoji: '💫', x: '95%', y: '72%', size: '1.8rem', delay: 1.1, rotate: -18 },
  { emoji: '🎉', x: '82%', y: '85%', size: '2rem',   delay: 0.7, rotate: 10 },
  { emoji: '🌟', x: '90%', y: '60%', size: '1.6rem', delay: 1.0, rotate: -6 },

  // Top area
  { emoji: '🎁', x: '30%', y: '5%',  size: '2rem',   delay: 0.1, rotate: -10 },
  { emoji: '🌈', x: '65%', y: '3%',  size: '2.2rem', delay: 0.4, rotate: 8 },
  { emoji: '💝', x: '48%', y: '7%',  size: '1.8rem', delay: 0.7, rotate: -15 },
  
  // Bottom corners
  { emoji: '🍓', x: '22%', y: '92%', size: '1.8rem', delay: 0.3, rotate: 12 },
  { emoji: '🎪', x: '72%', y: '90%', size: '2rem',   delay: 0.6, rotate: -8 },
  
  // Near cake area (subtle, smaller)
  { emoji: '💕', x: '25%', y: '30%', size: '1.5rem', delay: 0.8, rotate: 20 },
  { emoji: '🌷', x: '75%', y: '28%', size: '1.5rem', delay: 1.0, rotate: -12 },
  { emoji: '🎶', x: '20%', y: '45%', size: '1.4rem', delay: 1.2, rotate: 15 },
  { emoji: '💐', x: '78%', y: '42%', size: '1.4rem', delay: 0.9, rotate: -10 },
];

// ─────────────────────────────────────────────────────────────
// Floating Sticker Component
// ─────────────────────────────────────────────────────────────
function FloatingSticker({ emoji, x, y, size, delay, rotate, isExtinguished }) {
  const [duration] = useState(() => 3 + Math.random() * 2);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, rotate: rotate - 30 }}
      animate={{ 
        opacity: isExtinguished ? 0 : 1, 
        scale: isExtinguished ? 0 : 1, 
        rotate: rotate,
        y: [0, -8, 0, 6, 0],  // gentle float
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        scale: { duration: 0.6, delay, type: 'spring', stiffness: 200 },
        rotate: { duration: 0.6, delay },
        y: { duration: duration, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.5 },
      }}
      className="absolute pointer-events-none select-none z-5"
      style={{ 
        left: x, 
        top: y, 
        fontSize: size,
        filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.1))',
        transform: `rotate(${rotate}deg)`,
      }}
    >
      {emoji}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Pastel Gradient Blobs (background decoration)
// ─────────────────────────────────────────────────────────────
function PastelBlobs({ isExtinguished }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Pink blob top-left */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 15, 0],
          y: [0, 10, 0],
          opacity: isExtinguished ? 0 : 0.4,
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-20 -left-20 w-80 h-80 rounded-full"
        style={{ background: 'radial-gradient(circle, #fce7f3 0%, transparent 70%)' }}
      />
      {/* Lavender blob top-right */}
      <motion.div
        animate={{ 
          scale: [1, 1.15, 1],
          x: [0, -10, 0],
          y: [0, 15, 0],
          opacity: isExtinguished ? 0 : 0.35,
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -top-10 -right-20 w-96 h-96 rounded-full"
        style={{ background: 'radial-gradient(circle, #ede9fe 0%, transparent 70%)' }}
      />
      {/* Mint blob bottom-left */}
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          x: [0, 20, 0],
          opacity: isExtinguished ? 0 : 0.3,
        }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full"
        style={{ background: 'radial-gradient(circle, #d1fae5 0%, transparent 70%)' }}
      />
      {/* Peach blob bottom-right */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, -15, 0],
          opacity: isExtinguished ? 0 : 0.35,
        }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute -bottom-10 -right-20 w-80 h-80 rounded-full"
        style={{ background: 'radial-gradient(circle, #fff7ed 0%, transparent 70%)' }}
      />
      {/* Center soft glow behind cake */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: isExtinguished ? 0 : 0.25 }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full"
        style={{ background: 'radial-gradient(circle, #fdf2f8 0%, transparent 60%)' }}
      />
    </div>
  );
}


// ─────────────────────────────────────────────────────────────
// Doodle-Style Cute 3D Cake Component
// Uses meshToonMaterial for flat cartoon shading + low-poly
// for hand-drawn charm + cute decorations
// ─────────────────────────────────────────────────────────────

// Tiny 3D heart shape for decorations
function TinyHeart({ position, color = '#f9a8d4', scale = 0.12 }) {
  return (
    <group position={position} scale={scale}>
      <Sphere args={[1, 8, 8]} position={[-0.55, 0, 0]}>
        <meshStandardMaterial color={color} roughness={0.8} />
      </Sphere>
      <Sphere args={[1, 8, 8]} position={[0.55, 0, 0]}>
        <meshStandardMaterial color={color} roughness={0.8} />
      </Sphere>
      <Cone args={[1.35, 1.6, 8]} position={[0, -1, 0]} rotation={[Math.PI, 0, 0]}>
        <meshStandardMaterial color={color} roughness={0.8} />
      </Cone>
    </group>
  );
}

// Cute chunky doodle candle
function Candle({ position, flameRef, isExtinguished }) {
  return (
    <group position={position}>
      {/* Chunky candle body — low-poly for doodle feel */}
      <Cylinder args={[0.08, 0.08, 0.55, 8]} position={[0, 0.28, 0]}>
        <meshStandardMaterial color="#fde68a" roughness={0.8} />
      </Cylinder>
      {/* Cute stripe on candle */}
      <Cylinder args={[0.085, 0.085, 0.08, 8]} position={[0, 0.3, 0]}>
        <meshStandardMaterial color="#f9a8d4" roughness={0.8} />
      </Cylinder>
      <Cylinder args={[0.085, 0.085, 0.08, 8]} position={[0, 0.15, 0]}>
        <meshStandardMaterial color="#f9a8d4" roughness={0.8} />
      </Cylinder>
      {/* Wick */}
      <Cylinder args={[0.015, 0.015, 0.12, 6]} position={[0, 0.6, 0]}>
        <meshStandardMaterial color="#4b5563" roughness={0.8} />
      </Cylinder>
      
      <group position={[0, 0.75, 0]}>
          <group ref={flameRef}>
            {/* Outer glow */}
            <mesh position={[0, 0.05, 0]}>
               <sphereGeometry args={[0.18, 8, 8]} />
               <meshBasicMaterial color="#fbbf24" transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
            {/* Inner flame — tear drop shape */}
            <mesh position={[0, 0.02, 0]}>
               <coneGeometry args={[0.07, 0.28, 8]} />
               <meshBasicMaterial color="#fffbeb" />
            </mesh>
            {/* Flame base */}
            <mesh position={[0, -0.05, 0]}>
               <sphereGeometry args={[0.065, 8, 8]} />
               <meshBasicMaterial color="#fb923c" />
            </mesh>
            <pointLight intensity={isExtinguished ? 0 : 2.5} distance={6} decay={2} color="#fef3c7" />
          </group>
          
          {/* Smoke wisps when extinguished */}
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
}

function Cake3D({ isExtinguished }) {
  const flame1Ref = useRef();
  const flame2Ref = useRef();
  const flame3Ref = useRef();

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (!isExtinguished) {
      const flicker1 = 1 + Math.sin(t * 10) * 0.1;
      const flicker2 = 1 + Math.cos(t * 12) * 0.1;
      const flicker3 = 1 + Math.sin(t * 15) * 0.1;
      
      if (flame1Ref.current) flame1Ref.current.scale.set(flicker1, flicker1, flicker1);
      if (flame2Ref.current) flame2Ref.current.scale.set(flicker2, flicker2, flicker2);
      if (flame3Ref.current) flame3Ref.current.scale.set(flicker3, flicker3, flicker3);
    } else {
      if (flame1Ref.current) {
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

  return (
    <group position={[0, -1, 0]}>
      {/* Plate — low poly, chubby, doodle style */}
      <Cylinder args={[2.5, 2.7, 0.2, 16]} position={[0, 0.1, 0]}>
         <meshStandardMaterial color="#fef3c7" roughness={0.7} />
      </Cylinder>

      {/* Bottom Tier — baby pink, low-poly doodle */}
      <Cylinder args={[2, 2.05, 0.9, 12]} position={[0, 0.6, 0]}>
         <meshStandardMaterial color="#fbcfe8" roughness={0.9} />
      </Cylinder>
      {/* Bottom tier wavy icing drip */}
      <Cylinder args={[2.08, 2.08, 0.15, 12]} position={[0, 1.05, 0]}>
         <meshStandardMaterial color="#f9a8d4" roughness={0.6} metalness={0.1} />
      </Cylinder>

      {/* Top Tier — soft lavender, low-poly doodle */}
      <Cylinder args={[1.5, 1.55, 0.85, 12]} position={[0, 1.45, 0]}>
         <meshStandardMaterial color="#e9d5ff" roughness={0.9} />
      </Cylinder>
      {/* Top tier wavy icing drip */}
      <Cylinder args={[1.58, 1.58, 0.12, 12]} position={[0, 1.88, 0]}>
         <meshStandardMaterial color="#c4b5fd" roughness={0.6} metalness={0.1} />
      </Cylinder>
      
      {/* Thick cream frosting top */}
      <Cylinder args={[1.55, 1.55, 0.22, 12]} position={[0, 1.95, 0]}>
         <meshStandardMaterial color="#fefce8" roughness={0.8} />
      </Cylinder>

      {/* Puffy frosting dollops — bigger, cuter */}
      {[...Array(8)].map((_, i) => (
        <Sphere key={`dollop-${i}`} args={[0.25, 8, 8]} position={[
          Math.cos((i * Math.PI) / 4) * 1.3,
          2.05,
          Math.sin((i * Math.PI) / 4) * 1.3
        ]}>
          <meshStandardMaterial color={i % 2 === 0 ? '#fefce8' : '#fce7f3'} roughness={0.7} />
        </Sphere>
      ))}

      {/* Cherry on top! 🍒 */}
      <group position={[0, 2.35, 0]}>
        <Sphere args={[0.22, 8, 8]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#f43f5e" roughness={0.4} metalness={0.2} />
        </Sphere>
        {/* Cherry stem */}
        <Cylinder args={[0.02, 0.02, 0.3, 6]} position={[0.05, 0.3, 0]} rotation={[0, 0, 0.2]}>
          <meshStandardMaterial color="#65a30d" roughness={0.9} />
        </Cylinder>
        {/* Cherry leaf */}
        <Sphere args={[0.08, 6, 6]} position={[0.12, 0.42, 0]} scale={[1, 0.5, 1]}>
          <meshStandardMaterial color="#84cc16" roughness={0.8} />
        </Sphere>
        {/* Cherry shine */}
        <Sphere args={[0.06, 6, 6]} position={[-0.06, 0.08, 0.15]}>
          <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
        </Sphere>
      </group>

      {/* Cute heart decorations around bottom tier */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <TinyHeart
          key={`heart-${i}`}
          position={[
            Math.cos((i * Math.PI) / 3) * 2.05,
            0.6,
            Math.sin((i * Math.PI) / 3) * 2.05
          ]}
          color={['#f9a8d4', '#c4b5fd', '#fda4af'][i % 3]}
          scale={0.08}
        />
      ))}

      {/* Star-shaped sprinkles on bottom tier */}
      {[...Array(10)].map((_, i) => (
        <Sphere key={`sprinkle-${i}`} args={[0.06, 4, 4]} position={[
          Math.cos(i * 0.7) * 2.04,
          0.35 + Math.sin(i * 2.5) * 0.35,
          Math.sin(i * 0.7) * 2.04
        ]}>
           <meshStandardMaterial color={['#fbbf24', '#60a5fa', '#f472b6', '#a78bfa', '#34d399'][i % 5]} roughness={0.6} />
        </Sphere>
      ))}

      {/* Little dots on top tier */}
      {[...Array(8)].map((_, i) => (
        <Sphere key={`dot-${i}`} args={[0.04, 4, 4]} position={[
          Math.cos(i * 0.8) * 1.56,
          1.25 + Math.sin(i * 2) * 0.25,
          Math.sin(i * 0.8) * 1.56
        ]}>
           <meshStandardMaterial color={['#fbbf24', '#f472b6', '#60a5fa'][i % 3]} roughness={0.6} />
        </Sphere>
      ))}

      {/* Candles — cuter and chunkier */}
      <Candle position={[-0.4, 2.05, 0.4]} flameRef={flame1Ref} isExtinguished={isExtinguished} />
      <Candle position={[0.4, 2.05, 0.3]} flameRef={flame2Ref} isExtinguished={isExtinguished} />
      <Candle position={[0, 2.05, -0.5]} flameRef={flame3Ref} isExtinguished={isExtinguished} />
    </group>
  );
}

// Lighting setup (added environment map to blend with background scenery)
function EnvironmentSetup({ isExtinguished }) {
  const ambientRef = useRef();
  
  useFrame((state, delta) => {
     if (ambientRef.current) {
        const targetIntensity = isExtinguished ? 0.05 : 0.6;
        ambientRef.current.intensity = THREE.MathUtils.lerp(ambientRef.current.intensity, targetIntensity, delta * 2);
     }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.6} color="#ffffff" />
      <Environment preset="park" blur={0.5} opacity={0.6} />
      <directionalLight position={[5, 10, 2]} intensity={isExtinguished ? 0 : 1} color="#fdf4ff" castShadow />
      <ContactShadows position={[0, -0.9, 0]} opacity={0.5} scale={10} blur={2.5} far={4} color="#1e1b4b" />
    </>
  );
}


// ─────────────────────────────────────────────────────────────
// Main CakeSection Export
// ─────────────────────────────────────────────────────────────
export default function CakeSection({ onBlowCandles }) {
  const [isBlowing, setIsBlowing] = useState(false);
  const [isExtinguished, setIsExtinguished] = useState(false);
  const [micError, setMicError] = useState(false);
  
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);
  const animationFrameRef = useRef(null);

  function triggerExtinguish() {
    setIsExtinguished(true);
    setIsBlowing(false);
    
    if (microphoneRef.current) {
      microphoneRef.current.mediaStream.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // 🎊 Confetti celebration burst!
    const pastelColors = ['#fbcfe8', '#e9d5ff', '#bfdbfe', '#fef08a', '#fecaca', '#a7f3d0', '#c4b5fd'];
    
    // First burst — center explosion
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.4, x: 0.5 },
      colors: pastelColors,
      startVelocity: 40,
      gravity: 0.8,
      ticks: 200,
      scalar: 1.2,
    });

    // Second burst — left side (delayed)
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 70,
        origin: { x: 0.15, y: 0.5 },
        colors: pastelColors,
        startVelocity: 35,
        gravity: 0.7,
        ticks: 180,
      });
    }, 300);

    // Third burst — right side (delayed)
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 70,
        origin: { x: 0.85, y: 0.5 },
        colors: pastelColors,
        startVelocity: 35,
        gravity: 0.7,
        ticks: 180,
      });
    }, 500);

    // Final sparkle burst
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 160,
        origin: { y: 0.35, x: 0.5 },
        colors: pastelColors,
        startVelocity: 25,
        gravity: 0.5,
        ticks: 250,
        scalar: 0.8,
      });
    }, 800);

    setTimeout(() => {
      onBlowCandles();
    }, 3500); 
  }

  useEffect(() => {
    let isWarmupComplete = false;
    const warmupTimer = setTimeout(() => {
      isWarmupComplete = true;
    }, 2500);

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
          if (peak > 230 || averageVolume > 60) {
            triggerExtinguish();
            return;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBlowing, isExtinguished]);

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
        if (!isExtinguished) triggerExtinguish();
      }}
    >
      {/* Anime Scenery Background Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-2000"
        style={{ 
          backgroundImage: "url('/scenery_background.jpg')",
          opacity: isExtinguished ? 0.2 : 0.95,
          filter: isExtinguished ? 'blur(6px) brightness(0.3)' : 'blur(0px) brightness(1.1) saturate(1.2)'
        }} 
      />

      {/* Pastel blobs slightly toned down */}
      <div className="opacity-50 mix-blend-overlay">
        <PastelBlobs isExtinguished={isExtinguished} />
      </div>

      {/* Floating stickers & emojis */}
      {FLOATING_STICKERS.map((sticker, idx) => (
        <FloatingSticker key={idx} {...sticker} isExtinguished={isExtinguished} />
      ))}
      
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
