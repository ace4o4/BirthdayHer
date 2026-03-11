import { motion } from 'framer-motion';
import { useMemo } from 'react';

export default function FloatingParticles({ count = 20 }) {
  // Generate random properties AND animation keyframes once — stable across renders
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.4 + 0.1,
      // Pre-compute animation keyframes so they never change between renders
      animX: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
      animY: [0, Math.random() * -100 - 50, Math.random() * -100 - 50, 0],
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/60"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            willChange: 'transform, opacity',
          }}
          animate={{
            x: p.animX,
            y: p.animY,
            // Cap peak opacity to 0.8 to prevent excessive brightness/overdraw during animation
            opacity: [p.opacity, Math.min(p.opacity * 2, 0.8), p.opacity * 0.5, p.opacity],
            scale: [1, 1.4, 0.8, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
