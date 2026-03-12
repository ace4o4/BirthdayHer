import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import CakeSection from './sections/CakeSection';
import MagicalEnvelopeReveal from './sections/MagicalEnvelopeReveal';
import AboutYou from './sections/AboutYou';
import CosmicConstellation from './components/CosmicConstellation';
import MapGallery from './components/MapGallery';
import WishesClimax from './sections/WishesClimax';
import ParallaxBackground from './components/ParallaxBackground';

// GPU-accelerated section transitions using transform + opacity only
// (No clipPath — it triggers CPU-bound repaints and causes jank)
const sectionVariants = {
  initial: {
    opacity: 0,
    scale: 1.06,
    y: 60,
    filter: "blur(8px)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad — smooth deceleration
    }
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: -40,
    filter: "blur(6px)",
    transition: {
      duration: 0.5,
      ease: [0.55, 0.085, 0.68, 0.53], // easeInQuad — smooth acceleration out
    }
  }
};

const TOTAL_STEPS = 6;
const TOTAL_ABOUT_YOU_CARDS = 7;

// Animation lock durations (ms) — scroll is blocked for this long after triggering
const LOCK_SECTION_TRANSITION = 1200;   // Main section switch
const LOCK_ENVELOPE_ANIM = 5000;        // Letter SVG handwriting animation (~4.5s)
const LOCK_ENVELOPE_CLOSE = 1500;       // Closing the letter
const LOCK_CARD_SLIDE = 600;            // AboutYou card carousel slide

function App() {
  const [step, setStep] = useState(0);
  const [aboutYouCardIndex, setAboutYouCardIndex] = useState(0);
  
  // Magical Envelope Reveal States
  const [isSwirling, setIsSwirling] = useState(false);
  const [envelopeStep, setEnvelopeStep] = useState(0);

  // Scroll lock ref — using ref instead of state to avoid re-renders and stale closures
  const scrollLocked = useRef(false);

  const lockScroll = useCallback((durationMs) => {
    scrollLocked.current = true;
    setTimeout(() => { scrollLocked.current = false; }, durationMs);
  }, []);

  // Handle wheel scrolling
  useEffect(() => {
    const handleWheel = (e) => {
      // Block all scrolling on step 0 (cake) and when animations are active
      if (step === 0 || scrollLocked.current) return;

      // Allow internal scrollable containers to scroll normally
      const target = e.target.closest('.scrollable-container');
      if (target) {
        if (e.deltaY > 0 && target.scrollTop + target.clientHeight < target.scrollHeight - 1) return;
        if (e.deltaY < 0 && target.scrollTop > 0) return;
      }

      const delta = e.deltaY;

      // Magical Envelope internal scroll
      if (step === 1) {
        if (delta > 30 && envelopeStep < 1 && isSwirling) {
          lockScroll(LOCK_ENVELOPE_ANIM); // Lock for full letter animation
          setEnvelopeStep(1);
          return;
        }
        if (delta < -30 && envelopeStep > 0) {
          lockScroll(LOCK_ENVELOPE_CLOSE);
          setEnvelopeStep(0);
          return;
        }
      }

      // AboutYou card carousel scroll
      if (step === 2) {
        if (delta > 30 && aboutYouCardIndex < TOTAL_ABOUT_YOU_CARDS - 1) {
          lockScroll(LOCK_CARD_SLIDE);
          setAboutYouCardIndex(prev => prev + 1);
          return;
        }
        if (delta < -30 && aboutYouCardIndex > 0) {
          lockScroll(LOCK_CARD_SLIDE);
          setAboutYouCardIndex(prev => prev - 1);
          return;
        }
      }

      // Main section transitions
      if (delta > 30 && step < TOTAL_STEPS - 1) {
        lockScroll(LOCK_SECTION_TRANSITION);
        setStep(prev => prev + 1);
      } else if (delta < -30 && step > 1) {
        lockScroll(LOCK_SECTION_TRANSITION);
        setStep(prev => prev - 1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [step, aboutYouCardIndex, envelopeStep, isSwirling, lockScroll]);

  // Handle touch interactions
  useEffect(() => {
    let touchStartY = 0;
    
    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e) => {
      if (step === 0 || scrollLocked.current) return;
      
      const target = e.target.closest('.scrollable-container');
      if (target) return;
      
      const deltaY = touchStartY - e.changedTouches[0].clientY;

      // Magical Envelope internal swipe
      if (step === 1) {
        if (deltaY > 40 && envelopeStep < 1 && isSwirling) {
          lockScroll(LOCK_ENVELOPE_ANIM);
          setEnvelopeStep(1);
          return;
        }
        if (deltaY < -40 && envelopeStep > 0) {
          lockScroll(LOCK_ENVELOPE_CLOSE);
          setEnvelopeStep(0);
          return;
        }
      }

      // AboutYou card carousel swipe
      if (step === 2) {
        if (deltaY > 40 && aboutYouCardIndex < TOTAL_ABOUT_YOU_CARDS - 1) {
          lockScroll(LOCK_CARD_SLIDE);
          setAboutYouCardIndex(prev => prev + 1);
          return;
        }
        if (deltaY < -40 && aboutYouCardIndex > 0) {
          lockScroll(LOCK_CARD_SLIDE);
          setAboutYouCardIndex(prev => prev - 1);
          return;
        }
      }
      
      // Main section transitions
      if (deltaY > 50 && step < TOTAL_STEPS - 1) {
        lockScroll(LOCK_SECTION_TRANSITION);
        setStep(prev => prev + 1);
      } else if (deltaY < -50 && step > 1) {
        lockScroll(LOCK_SECTION_TRANSITION);
        setStep(prev => prev - 1);
      }
    };
    
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [step, aboutYouCardIndex, envelopeStep, isSwirling, lockScroll]);

  const components = [
    <CakeSection onBlowCandles={() => setStep(1)} />,
    <MagicalEnvelopeReveal 
        envelopeStep={envelopeStep} 
        isSwirling={isSwirling} 
        setIsSwirling={setIsSwirling} 
    />,
    <AboutYou activeCardIndex={aboutYouCardIndex} />,
    <CosmicConstellation />,
    <MapGallery />,
    <WishesClimax />
  ];

  // Calculate global progress for parallax background (0.0 to 1.0)
  let sectionProgress = 0;
  if (step === 2) sectionProgress = aboutYouCardIndex / TOTAL_ABOUT_YOU_CARDS;
  const globalProgress = (step + sectionProgress) / (TOTAL_STEPS - 1);

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
          className="scrollable-container absolute inset-0 w-full h-full overflow-y-auto overflow-x-hidden will-change-transform"
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

      {/* Scroll indicator hint for step 1 */}
      {step === 1 && isSwirling && envelopeStep === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 3, duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 text-slate-500 font-bold bg-white/70 px-4 py-2 rounded-full shadow-sm backdrop-blur-sm pointer-events-none"
        >
          Scroll Down to Read Letter ↓
        </motion.div>
      )}
    </div>
  );
}

export default App;
