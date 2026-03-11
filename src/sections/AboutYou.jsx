import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import confetti from 'canvas-confetti';

export default function AboutYou({ activeCardIndex, onWakeCat, isCatAwake }) {
  const [isRabbitFlipping, setIsRabbitFlipping] = useState(false);
  const rabbitRef = useRef(null);

  const handleRabbitClick = () => {
    setIsRabbitFlipping(true);
    
    // Normalize coordinates for confetti origin
    let originX = 0.2;
    let originY = 0.8;
    
    if (rabbitRef.current) {
      const rect = rabbitRef.current.getBoundingClientRect();
      originX = (rect.left + rect.width / 2) / window.innerWidth;
      originY = (rect.top + rect.height / 2) / window.innerHeight;
    }

    // High-performance Particle Physics (Confetti) per PRD constraints
    confetti({
      particleCount: 65, // Moderate number 50-80
      spread: 75, // Angle 60-90
      origin: { x: originX, y: originY },
      colors: ['#A0E8AF', '#D4F1E1', '#E8F5E9', '#b3e8c9', '#ffffff'], // Strictly pastel mint/green
      startVelocity: 45,
      decay: 0.9,
      gravity: 1.2,
      disableForReducedMotion: true,
      zIndex: 200
    });

    // Reset flip state
    setTimeout(() => setIsRabbitFlipping(false), 1000);
  };
  const cards = [
    {
      title: "Super Cute",
      desc: "Inside and out, you radiate the cutest energy! 🐰",
      icon: "🐱",
      color: "bg-cute-pink",
    },
    {
      title: "Amazing Smile",
      desc: "Your smile lights up the whole room! 🌸",
      icon: "✨",
      color: "bg-cute-purple",
    },
    {
      title: "Kind Heart",
      desc: "Always caring and bringing warmth everywhere. 🧸",
      icon: "💖",
      color: "bg-cute-yellow",
    },
    {
      title: "Brilliant Mind",
      desc: "So smart, creative, and always full of wonderful ideas! 💡",
      icon: "🧠",
      color: "bg-[#E0F2F1]", // cute teal
    },
    {
      title: "Great Listener",
      desc: "Always there to listen and give the best advice. 🎧",
      icon: "👂",
      color: "bg-[#FFF3E0]", // cute light orange
    },
    {
      title: "Fun Spirit",
      desc: "Every moment spent with you is filled with laughs and joy! 🎈",
      icon: "🤣",
      color: "bg-[#E8F5E9]", // cute light green
    },
    {
      title: "Absolutely Unique",
      desc: "There is truly no one else like you in the whole world. 🌟",
      icon: "💎",
      color: "bg-[#D4E6F1]", // soft blue
    }
  ];

  return (
    <section className="min-h-screen py-24 bg-white/20 backdrop-blur-sm relative overflow-hidden flex flex-col justify-center">
      
      {/* Interactive Sleeping Cat Easter Egg (Lerp triggering) */}
      <AnimatePresence>
        {!isCatAwake && (
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0, border: 'none', transition: { duration: 0.3 } }} 
            className="absolute top-10 right-10 z-[30] cursor-pointer"
            onClick={onWakeCat}
            whileHover={{ scale: 1.1 }}
          >
            <motion.div 
               animate={{ y: [0, -5, 0] }} 
               transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
               className="relative"
            >
              <img src="https://api.dicebear.com/8.x/fun-emoji/svg?seed=Felix" alt="sleeping cat" className="w-20 h-20 opacity-80" />
              <div className="absolute -top-4 -right-4 text-xs font-bold text-slate-500 animate-pulse bg-white/50 px-2 rounded-full backdrop-blur-sm pointer-events-none shadow-sm">Zzz...</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Flipping Rabbit Easter Egg (Particle Physics) */}
      <motion.div 
        ref={rabbitRef}
        onClick={handleRabbitClick}
        animate={isRabbitFlipping ? { rotateY: 360, y: [-20, -100, 0], scale: 1.2 } : { rotateY: 0, y: 0, scale: 1 }}
        transition={isRabbitFlipping ? { duration: 0.8, ease: "anticipate" } : {}}
        whileHover={!isRabbitFlipping ? { scale: 1.2, rotate: [0, 10, -10, 0] } : {}}
        className="absolute bottom-10 left-10 w-24 h-24 z-[30] cursor-pointer flex items-center justify-center opacity-90 drop-shadow-md bg-white/40 rounded-full backdrop-blur-sm border-2 border-white/50" 
      >
        <span className="text-5xl select-none">🐰</span>
      </motion.div>
      <motion.div 
        whileHover={{ y: -10, scale: 1.3, rotate: 10 }}
        className="sticker top-1/2 left-4 text-5xl opacity-60 cursor-pointer"
      >
        🍓
      </motion.div>
      <motion.div 
        whileHover={{ y: -10, scale: 1.3, rotate: -10 }}
        className="sticker top-1/4 right-20 text-4xl opacity-60 cursor-pointer"
      >
        🎀
      </motion.div>

      <div className="container mx-auto px-6 relative z-20 flex-grow flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-pink-500 font-bold tracking-widest uppercase text-sm mb-2 block drop-shadow-sm">All About You</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-800 drop-shadow-sm">
            Why You Are Special!
          </h2>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative w-full max-w-sm md:max-w-md mx-auto h-80">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeCardIndex}
              initial={{ opacity: 0, y: 100, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0, zIndex: 10 }}
              exit={{ opacity: 0, y: -100, scale: 0.8, rotate: 5, zIndex: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 10, bounce: 0.5 }}
              className={`absolute inset-0 ${cards[activeCardIndex].color} backdrop-blur-md bg-opacity-80 rounded-[40px] p-8 shadow-2xl border-4 border-white/70 relative overflow-hidden flex flex-col items-center justify-center text-center`}
            >
              {/* Card background blob */}
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-white opacity-40 rounded-full blur-2xl"></div>
              
              <div className="w-20 h-20 bg-white/90 rounded-full flex justify-center items-center text-4xl mb-6 shadow-sm border-2 border-white relative z-10 transition-transform hover:scale-110 cursor-pointer">
                {cards[activeCardIndex].icon}
              </div>
              <h3 className="text-3xl font-display font-bold text-slate-800 mb-4 relative z-10">{cards[activeCardIndex].title}</h3>
              <p className="text-slate-700 font-medium text-lg leading-relaxed relative z-10">{cards[activeCardIndex].desc}</p>
              
              {/* Card indicator dots inside the card */}
              <div className="absolute bottom-6 flex space-x-2">
                 {cards.map((_, i) => (
                   <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === activeCardIndex ? 'bg-slate-800' : 'bg-slate-300'}`} />
                 ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="text-center mt-8 text-slate-600 font-bold animate-pulse drop-shadow-md bg-white/30 backdrop-blur-sm self-center px-4 py-2 rounded-full">
          Scroll down to see more! ✨
        </div>
      </div>
    </section>
  );
}
