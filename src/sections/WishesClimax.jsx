import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function WishesClimax() {
  const containerRef = useRef(null);
  const [hasLanded, setHasLanded] = useState(false);



  // Trigger physics-based confetti when the image lands
  useEffect(() => {
    if (hasLanded) {
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ['#5F9EA0', '#D4F1E1', '#A0E8AF', '#C5E8E8']; // Blue, Green, Mint

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
          zIndex: 15 // Behind the girl (z-20) but in front of text (z-10)
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
          zIndex: 15
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [hasLanded]);

  // Staggered text variants for "BIRTHDAY"
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    show: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 10 }
    }
  };

  return (
    <section 
      ref={containerRef}
      className="min-h-screen relative flex items-center justify-center overflow-hidden cursor-default"
      style={{
        background: 'radial-gradient(circle at center, #E0F2F1 0%, #B2DFDB 100%)' // LagoonWhisper to Breeze
      }}
    >
      {/* Decorative Aipan glowing dots (Z-Index 5) */}
      <div className="absolute inset-0 pointer-events-none z-[5] opacity-40">
        <div className="absolute top-20 left-20 w-8 h-8 rounded-full bg-white blur-md" />
        <div className="absolute bottom-40 right-32 w-12 h-12 rounded-full bg-[#E0F2F1] blur-lg" />
        <div className="absolute top-1/3 right-1/4 w-6 h-6 rounded-full bg-white blur-sm" />
      </div>

      {/* Layer 1: Background Text (Z-Index 10) */}
      <motion.div 
        className="absolute z-10 w-full text-center flex justify-center pointer-events-none"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
      >
        <h1 className="text-[12vw] md:text-[15vw] lg:text-[18vw] font-display font-black tracking-tighter text-[#5F9EA0] opacity-90 drop-shadow-sm select-none leading-none flex">
          {['B', 'I', 'R', 'T', 'H', 'D', 'A', 'Y'].map((letter, i) => (
             <motion.span key={i} variants={letterVariants}>{letter}</motion.span>
          ))}
        </h1>
      </motion.div>

      {/* Layer 2: Transparent PNG Cutout (Z-Index 20) */}
      <motion.div 
        className="absolute z-20 pointer-events-none w-full flex justify-center items-center h-full pl-48 md:pl-64 lg:pl-80 pb-66" // Shifted right significantly to sit on the 'HD'
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 0.95 }} // 95% opacity
        viewport={{ once: true, margin: "-100px" }}
        transition={{ type: "spring", stiffness: 80, damping: 12, delay: 0.8 }}
        onAnimationComplete={() => setHasLanded(true)}
      >
        <img 
          src="/assets/girl_cutout_2.png" // The primary cutout over "HD"
          alt="Birthday Girl" 
          className="max-h-[40vh] object-contain drop-shadow-xl" // Made larger to fit the new position
        />
      </motion.div>

      {/* Alternate Cutout floating in background / side (Left - B) */}
      <motion.div
         className="absolute z-[15] pointer-events-none h-full flex items-center left-[2%] md:left-[5%] lg:left-[76.55%] pt-20"   // Adjusted slightly left due to larger size
         initial={{ y: 200, opacity: 0, rotate: -10 }}
         whileInView={{ y: 0, opacity: 0.95, rotate: 5 }} // Slight rotation so she 'leans' on the B
         viewport={{ once: true }}
         transition={{ type: "spring", stiffness: 60, damping: 15, delay: 1.2 }}
      >
        <img 
          src="/assets/girl_cutout_1.png" // Set to be bigger and on the side
          alt="Birthday Girl Alt" 
          className="max-h-[75vh] md:max-h-[85vh] lg:max-h-[90vh] object-contain drop-shadow-xl" // Increased max-height significantly
        />
      </motion.div>

      {/* Third Cutout attached to the 'Y' */}
      <motion.div
         className="absolute z-[9] pointer-events-none h-full flex items-center justify-end right-[2%] md:right-[5%] lg:right-[78%] pb-10 md:pb-100" 
         initial={{ x: 200, opacity: 0, scale: 0.8 }}
         whileInView={{ x: 0, opacity: 0.95, scale: 1, rotate: -3 }} // Slight inward rotation
         viewport={{ once: true }}
         transition={{ type: "spring", stiffness: 70, damping: 16, delay: 1.5 }}
      >
        <img 
          src="/assets/girl_cutout_3.png" // The new maroon jacket image
          alt="Birthday Girl 3" 
          className="max-h-[40vh] md:max-h-[30vh] object-contain drop-shadow-2xl"
        />
      </motion.div>


      {/* Layer 3: Foreground Details (Z-Index 30) */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        
        {/* "Happy" Cursive Text overlapping top-left */}
        <motion.div 
          className="absolute top-1/4 left-10 md:left-1/4"
          initial={{ opacity: 0, x: -50, rotate: -10 }}
          whileInView={{ opacity: 1, x: 0, rotate: -15 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1.2, type: 'spring' }}
        >
          <span className="font-sans italic text-6xl md:text-8xl lg:text-9xl text-white drop-shadow-lg" style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 700 }}>
            Happy
          </span>
        </motion.div>

        {/* Date top right */}
        <motion.div
           className="absolute top-10 right-10 md:top-20 md:right-32 text-right"
           initial={{ opacity: 0, y: -20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 1.4 }}
        >
          <p className="font-display font-bold text-2xl md:text-3xl text-[#5F9EA0] tracking-widest uppercase">
            {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <p className="font-sans text-[#4A6B6C] tracking-widest text-sm uppercase mt-1">A Special Day</p>
        </motion.div>

        {/* Name bottom right */}
        <motion.div
           className="absolute bottom-10 right-10 md:bottom-20 md:right-32 text-right"
           initial={{ opacity: 0, x: 20 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 1.6 }}
        >
          <p className="font-sans italic text-4xl md:text-5xl text-[#5F9EA0]" style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 700 }}>
            Dear POOJA JI
          </p>
        </motion.div>

        {/* Kawaii Stickers floating around */}
        <motion.div 
          className="absolute top-1/3 right-20 text-5xl"
          animate={{ y: [0, -15, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          🐱
        </motion.div>
        
        <motion.div 
          className="absolute bottom-1/3 left-20 text-6xl"
          animate={{ y: [0, 20, 0], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          🐰
        </motion.div>

        <motion.div 
          className="absolute bottom-20 left-1/3 text-4xl"
          animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          ✨
        </motion.div>
      </div>
      
    </section>
  );
}
