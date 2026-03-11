import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import confetti from 'canvas-confetti';

export default function HeroLetter() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      
      // Trigger confetti from the center of the screen
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FEE1E8', '#D4F1E1', '#C5E8E8', '#FEF3C7']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FEE1E8', '#D4F1E1', '#C5E8E8', '#FEF3C7']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-white/20 backdrop-blur-sm relative overflow-hidden py-20 cursor-pointer" onClick={handleOpen}>
      
      {/* Canvas/Dotted Background Overlay */}
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(74, 85, 104, 0.15) 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>
      
      {/* Background cute elements */}
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-10 left-10 opacity-60 text-4xl"
      >
        🌸
      </motion.div>
      <motion.div 
        animate={{ y: [-10, 10, -10] }} 
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-20 opacity-60 text-4xl"
      >
        ✨
      </motion.div>

      <div className="relative w-full max-w-lg mx-auto flex flex-col items-center z-10">
        
        {/* Envelope */}
        <div className="relative w-80 h-60 z-20 mt-32">
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            className={`w-full h-full relative transition-transform duration-700 ${isOpen ? 'translate-y-10' : ''}`}
          >
            {/* Back of Envelope */}
            <div className="absolute inset-0 bg-pink-300 rounded-md shadow-lg"></div>
            
            {/* Envelope Flap (Top) */}
            <motion.div 
              className="absolute top-0 w-full h-full origin-top z-30"
              animate={{ rotateX: isOpen ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="w-0 h-0 border-l-[160px] border-r-[160px] border-t-[100px] border-l-transparent border-r-transparent border-t-pink-400 drop-shadow-md"></div>
            </motion.div>

            {/* Envelope Body (Front Front) */}
            <div className="absolute bottom-0 w-full h-full z-40 pointer-events-none">
              <div className="absolute bottom-0 w-0 h-0 border-l-[160px] border-r-[160px] border-b-[140px] border-l-transparent border-r-transparent border-b-pink-200"></div>
              <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[160px] border-r-transparent border-b-[140px] border-b-transparent border-l-pink-300"></div>
              <div className="absolute bottom-0 right-0 w-0 h-0 border-r-[160px] border-l-transparent border-b-[140px] border-b-transparent border-r-pink-300"></div>
              
              {!isOpen && (
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center text-white shadow-md animate-pulse">
                     ❤️
                   </div>
                </div>
              )}
            </div>
            
            {/* The Letter/Canvas */}
            <AnimatePresence>
              {isOpen && (
                <motion.div 
                  initial={{ y: 50, opacity: 0, zIndex: 25 }}
                  animate={{ y: -240, opacity: 1, zIndex: 50, scale: 1.05 }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="absolute left-0 right-0 mx-auto w-11/12 bg-[#FFFCF5] rounded-md shadow-2xl p-8 border border-yellow-200 overflow-hidden"
                  style={{ transformOrigin: 'bottom center' }}
                >
                  {/* Paper Texture Noise Overlay */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="text-center space-y-4 relative z-10"
                  >
                    <h2 className="text-3xl font-display text-pink-500 font-bold">Happy Birthday!</h2>
                    <p className="text-gray-600 font-sans leading-relaxed">
                      Wishing you the sweetest, happiest, and most amazing birthday ever! 
                      May your day be filled with joy, laughter, and lots of cake. 🎂✨
                    </p>
                    <div className="text-xl pt-2">
                       🥰🐾🎈
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </div>

        {!isOpen && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-10 text-slate-600 font-semibold tracking-wide animate-pulse"
          >
            Tap the envelope to open! 💌
          </motion.p>
        )}
      </div>
    </section>
  );
}
