import { motion, AnimatePresence } from 'framer-motion';
import { assetUrl } from '../utils/assetUrl';

const cards = [
  {
    title: "Super Cute",
    desc: "Inside and out, you radiate the cutest energy! 🐰",
    icon: assetUrl("/assets/icons/super_cute.png"),
  },
  {
    title: "Amazing Smile",
    desc: "Your smile lights up the whole room! 🌸",
    icon: assetUrl("/assets/icons/amazing_smile.png"),
  },
  {
    title: "Kind Heart",
    desc: "Always caring and bringing warmth everywhere. 🧸",
    icon: assetUrl("/assets/icons/kind_heart.png"),
  },
  {
    title: "Brilliant Mind",
    desc: "So smart, creative, and always full of wonderful ideas! 💡",
    icon: assetUrl("/assets/icons/brilliant_mind.png"),
  },
  {
    title: "Great Listener",
    desc: "Always there to listen and give the best advice. 🎧",
    icon: assetUrl("/assets/icons/great_listener.png"),
  },
  {
    title: "Fun Spirit",
    desc: "Every moment spent with you is filled with laughs and joy! 🎈",
    icon: assetUrl("/assets/icons/fun_spirit.png"),
  },
  {
    title: "Absolutely Unique",
    desc: "There is truly no one else like you in the whole world. 🌟",
    icon: assetUrl("/assets/icons/unique_diamond.png"),
  }
];

export default function AboutYou({ activeCardIndex }) {
  return (
    <section 
      className="min-h-screen py-24 relative overflow-hidden flex flex-col justify-center"
      style={{
        backgroundImage: `url('${assetUrl('/assets/back_1.jpg')}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-white/10 z-0"></div>

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
              className="absolute inset-0 rounded-[40px] p-8 overflow-hidden flex flex-col items-center justify-center text-center"
              style={{
                background: 'rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(20px) saturate(1.8)',
                WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
                border: '2px solid rgba(255, 255, 255, 0.5)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 0 80px rgba(255, 255, 255, 0.15), 0 0 0 1px rgba(255,255,255,0.1)',
              }}
            >
              {/* Liquid glass inner glow blobs */}
              <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/30 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -left-6 -bottom-6 w-36 h-36 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-pink-100/15 rounded-full blur-3xl pointer-events-none"></div>
              
              {/* Top highlight streak */}
              <div className="absolute top-0 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full pointer-events-none"></div>
              
              {/* Icon */}
              <div className="w-24 h-24 rounded-full flex justify-center items-center mb-6 relative z-10 transition-transform hover:scale-110 cursor-pointer overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.45)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.6)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.06), inset 0 0 20px rgba(255,255,255,0.2)',
                }}
              >
                <img src={cards[activeCardIndex].icon} alt={cards[activeCardIndex].title} className="w-16 h-16 object-contain drop-shadow-md" />
              </div>

              <h3 className="text-3xl font-display font-bold text-white mb-4 relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">{cards[activeCardIndex].title}</h3>
              <p className="text-white/90 font-medium text-lg leading-relaxed relative z-10 drop-shadow-[0_1px_3px_rgba(0,0,0,0.12)]">{cards[activeCardIndex].desc}</p>
              
              {/* Card indicator dots */}
              <div className="absolute bottom-6 flex space-x-2">
                 {cards.map((_, i) => (
                   <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === activeCardIndex ? 'bg-white shadow-md' : 'bg-white/40'}`} />
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
