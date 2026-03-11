import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import CakeSection from './sections/CakeSection';
import HeroLetter from './sections/HeroLetter';
import AboutYou from './sections/AboutYou';
import MyThoughts from './sections/MyThoughts';
import Gallery from './sections/Gallery';
import WishesClimax from './sections/WishesClimax';
import ParallaxBackground from './components/ParallaxBackground';

const sectionVariants = {
  initial: {
    opacity: 0,
    scale: 0.97, // Subtle zoom-in from just-below full size
    y: 40,       // Slide up 40px — feels natural without being disorienting
    zIndex: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    zIndex: 10,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94], // cubic-bezier ease-out-quart — snappy but smooth
    }
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: -20,
    zIndex: 0,
    transition: {
      duration: 0.4,
      ease: "easeIn",
    }
  }
};

function App() {
  const [step, setStep] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [aboutYouCardIndex, setAboutYouCardIndex] = useState(0);

  const totalSteps = 6;
  const totalAboutYouCards = 7;

  // Handle wheel scrolling
  useEffect(() => {
    const handleWheel = (e) => {
      // Don't allow scroll out of cake section until blown
      if (step === 0) return;
      if (isScrolling) return;

      const target = e.target.closest('.scrollable-container');
      if (target) {
        // If scrolling down and not at bottom, allow
        if (e.deltaY > 0 && target.scrollTop + target.clientHeight < target.scrollHeight - 1) {
           return; 
        }
        // If scrolling up and not at top, allow
        if (e.deltaY < 0 && target.scrollTop > 0) {
           return; 
        }
      }

      // Handle custom internal scrolling for AboutYou section
      if (step === 2) {
        if (e.deltaY > 30) {
          if (aboutYouCardIndex < totalAboutYouCards - 1) {
            setIsScrolling(true);
            setAboutYouCardIndex(prev => prev + 1);
            setTimeout(() => setIsScrolling(false), 800); // Shorter debounce for slider
            return;
          }
        } else if (e.deltaY < -30) {
          if (aboutYouCardIndex > 0) {
            setIsScrolling(true);
            setAboutYouCardIndex(prev => prev - 1);
            setTimeout(() => setIsScrolling(false), 800);
            return;
          }
        }
      }

      if (e.deltaY > 30 && step < totalSteps - 1) {
        setIsScrolling(true);
        setStep(prev => prev + 1);
        setTimeout(() => setIsScrolling(false), 1200); // Main section transition debounce
      } else if (e.deltaY < -30 && step > 1) { // Prevents going back to cake
        setIsScrolling(true);
        setStep(prev => prev - 1);
        setTimeout(() => setIsScrolling(false), 1200);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [step, isScrolling, aboutYouCardIndex]);

  // Handle touch interactions
  useEffect(() => {
    let touchStartY = 0;
    
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e) => {
      if (step === 0) return;
      if (isScrolling) return;
      
      const target = e.target.closest('.scrollable-container');
      if (target) {
        return; 
      }
      
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      // Handle custom internal swipe for AboutYou section
      if (step === 2) {
        if (deltaY > 40) {
          if (aboutYouCardIndex < totalAboutYouCards - 1) {
            setIsScrolling(true);
            setAboutYouCardIndex(prev => prev + 1);
            setTimeout(() => setIsScrolling(false), 800);
            return;
          }
        } else if (deltaY < -40) {
          if (aboutYouCardIndex > 0) {
            setIsScrolling(true);
            setAboutYouCardIndex(prev => prev - 1);
            setTimeout(() => setIsScrolling(false), 800);
            return;
          }
        }
      }
      
      if (deltaY > 50 && step < totalSteps - 1) {
        setIsScrolling(true);
        setStep(prev => prev + 1);
        setTimeout(() => setIsScrolling(false), 1200);
      } else if (deltaY < -50 && step > 1) {
        setIsScrolling(true);
        setStep(prev => prev - 1);
        setTimeout(() => setIsScrolling(false), 1200);
      }
    };
    
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [step, isScrolling, aboutYouCardIndex]);

  const components = [
    <CakeSection onBlowCandles={() => setStep(1)} />,
    <HeroLetter />,
    <AboutYou activeCardIndex={aboutYouCardIndex} />,
    <MyThoughts />,
    <div className="flex flex-col min-h-full">
      <Gallery />
      <footer className="py-8 bg-cute-yellow text-center text-slate-500 text-sm mt-auto">
        <p>Made with ❤️ for someone special</p>
      </footer>
    </div>,
    <WishesClimax />
  ];

  // Calculate global progress for the parallax background (0.0 to 1.0)
  let sectionProgress = 0;
  if (step === 2) sectionProgress = aboutYouCardIndex / totalAboutYouCards;
  
  // The parallax spans from step 0 to step 5 (length 5)
  const globalProgress = (step + sectionProgress) / 5;

  return (
    <div className="bg-[#e8f4f8] h-screen w-screen overflow-hidden text-slate-800 font-sans selection:bg-pink-300 selection:text-white relative">
      <ParallaxBackground globalProgress={globalProgress} />
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={sectionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="scrollable-container absolute inset-0 w-full h-full overflow-y-auto overflow-x-hidden"
        >
          {components[step]}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Indicators */}
      {step > 0 && step < 5 && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`w-3 h-3 rounded-full transition-all duration-300 ${step === i ? 'bg-pink-400 scale-125' : 'bg-white/50 backdrop-blur-sm shadow-md'}`}
            />
          ))}
        </div>
      )}

      {/* Scroll indicator hint */}
      {step === 1 && !isScrolling && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 3, duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 text-slate-500 font-bold bg-white/70 px-4 py-2 rounded-full shadow-sm backdrop-blur-sm pointer-events-none"
        >
          Scroll Down to Continue ↓
        </motion.div>
      )}
    </div>
  );
}

export default App;
