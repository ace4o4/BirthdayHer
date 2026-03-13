import { motion } from 'framer-motion';
import { assetUrl } from '../utils/assetUrl';

export default function ParallaxBackground({ globalProgress }) {
  // globalProgress is 0 at the start (cake) and 1 at the end (gallery)
  // We'll move the layers vertically based on this progress.
  
  // Slower movement for sky/background
  const cloudsY = -globalProgress * 300; 
  // Medium movement for mountains
  const mountainsY = -globalProgress * 600;
  // Faster movement for foreground flowers
  const flowersY = -globalProgress * 1000;

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
      {/* Sky/Background Layer (Slowest) */}
      <motion.div 
        className="absolute inset-0 w-full h-[150%] top-[-5%]"
        style={{ y: cloudsY }}
      >
        <img 
          src={assetUrl('/assets/back_1.png')} 
          alt="Sky background" 
          className="w-full h-full object-cover opacity-60 mix-blend-multiply"
        />
      </motion.div>

      {/* Mountains/Landscape Layer (Medium) */}
      <motion.div 
        className="absolute inset-x-0 w-full h-[150%] bottom-[-50%]"
        style={{ y: mountainsY }}
      >
        <img 
          src={assetUrl('/assets/anime_landscape.png')} 
          alt="Landscape" 
          className="w-full h-full object-cover opacity-80"
        />
      </motion.div>

      {/* Foreground Flowers Layer (Fastest) */}
      <motion.div 
        className="absolute inset-x-0 w-full h-[150%] bottom-[-100%]"
        style={{ y: flowersY }}
      >
        <img 
          src={assetUrl('/assets/anime_landscape_flowers.png')} 
          alt="Flowers" 
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Slight tint overlay to mesh with the rest of the site's palette */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>
    </div>
  );
}
