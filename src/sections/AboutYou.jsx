import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

export default function AboutYou({ activeCardIndex }) {
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
      color: "bg-cute-blue",
    }
  ];

  return (
    <section className="min-h-screen py-24 bg-cute-blue relative overflow-hidden flex flex-col justify-center">
      
      {/* Decorative Stickers */}
      <img src="https://api.dicebear.com/8.x/fun-emoji/svg?seed=Felix" alt="cute emoji" className="sticker top-10 right-10 w-20 h-20 animate-float-slow opacity-80" />
      <img src="https://api.dicebear.com/8.x/fun-emoji/svg?seed=Bella" alt="cute emoji" className="sticker bottom-10 left-10 w-24 h-24 animate-float-fast opacity-80" />
      <div className="sticker top-1/2 left-4 text-5xl opacity-50">🍓</div>
      <div className="sticker top-1/4 right-20 text-4xl opacity-50">🎀</div>

      <div className="container mx-auto px-6 relative z-20 flex-grow flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-pink-500 font-bold tracking-widest uppercase text-sm mb-2 block">All About You</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-800">
            Why You Are Special!
          </h2>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative w-full max-w-sm md:max-w-md mx-auto h-80">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeCardIndex}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1, zIndex: 10 }}
              exit={{ opacity: 0, x: -100, scale: 0.9, zIndex: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`absolute inset-0 ${cards[activeCardIndex].color} rounded-[40px] p-8 shadow-xl border-4 border-white relative overflow-hidden flex flex-col items-center justify-center text-center`}
            >
              {/* Card background blob */}
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-white opacity-40 rounded-full blur-2xl"></div>
              
              <div className="w-20 h-20 bg-white/80 rounded-full flex justify-center items-center text-4xl mb-6 shadow-sm border-2 border-white relative z-10">
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
        
        <div className="text-center mt-8 text-slate-500 font-medium animate-pulse">
          Scroll down to see more! ✨
        </div>
      </div>
    </section>
  );
}
