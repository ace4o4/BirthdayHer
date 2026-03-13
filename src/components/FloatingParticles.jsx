import { motion } from 'framer-motion';
import { useState } from 'react';

export default function FloatingParticles({ count = 30 }) {
  // Generate random properties for particles once
  const [particles] = useState(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.4 + 0.1,
      animX1: Math.random() * 100 - 50,
      animX2: Math.random() * 100 - 50,
      animY1: Math.random() * -100 - 50,
      animY2: Math.random() * -100 - 50,
    }));
  });

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            filter: 'blur(2px)',
            boxShadow: '0 0 10px 2px rgba(255, 255, 255, 0.4)',
          }}
          animate={{
            x: [0, p.animX1, p.animX2, 0],
            y: [0, p.animY1, p.animY2, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity * 0.5, p.opacity],
            scale: [1, 1.5, 0.8, 1],
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
