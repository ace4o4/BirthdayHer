import { motion } from 'framer-motion';
import FloatingParticles from './FloatingParticles';

export default function ParallaxBackground({ globalProgress }) {
  // globalProgress is 0 at the start (cake) and 1 at the end (gallery)
  // We'll move the layers vertically based on this progress.
  
  // Slower movement for clouds
  const cloudsY = -globalProgress * 300; 
  // Medium movement for mountains
  const mountainsY = -globalProgress * 600;
  // Faster movement for foreground flowers
  const flowersY = -globalProgress * 1000;

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0 bg-[#e8f4f8]">
      
      {/* Animated Gradient Background Base */}
      <motion.div 
        className="absolute inset-0 w-[200%] h-[200%] -left-1/2 -top-1/2 opacity-70"
        style={{
          background: 'radial-gradient(circle at center, #FEE1E8 0%, #D4F1E1 30%, #C5E8E8 60%, #FEF3C7 100%)',
        }}
        animate={{
          rotate: [0, 90, 180, 270, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      {/* Magical Floating Particles */}
      <FloatingParticles count={60} />

      {/* Sky/Clouds Layer (Slowest) */}
      <motion.div 
        className="absolute inset-0 w-full h-[150%] top-[-5%]"
        style={{ y: cloudsY }}
      >
        <img 
          src="/assets/parallax_clouds_1773219856526.png" 
          alt="Clouds" 
          className="w-full h-full object-cover opacity-60 mix-blend-multiply"
        />
      </motion.div>

      {/* Mountains Layer (Medium) */}
      <motion.div 
        className="absolute inset-x-0 w-full h-[150%] bottom-[-50%]"
        style={{ y: mountainsY }}
      >
        <img 
          src="/assets/parallax_mountains_1773219873040.png" 
          alt="Mountains" 
          className="w-full h-full object-cover opacity-80"
        />
      </motion.div>

      {/* Foreground Flowers Layer (Fastest) */}
      <motion.div 
        className="absolute inset-x-0 w-full h-[150%] bottom-[-100%]"
        style={{ y: flowersY }}
      >
        <img 
          src="/assets/parallax_flowers_1773219887277.png" 
          alt="Flowers" 
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Slight tint overlay to mesh with the rest of the site's palette */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
    </div>
  );
}
