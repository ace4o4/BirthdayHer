import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Howl } from 'howler';

import CakeSection from './sections/CakeSection';
import HeroLetter from './sections/HeroLetter';
import AboutYou from './sections/AboutYou';
import CosmicConstellation from './components/CosmicConstellation';
import MapGallery from './components/MapGallery';
import WishesClimax from './sections/WishesClimax';
import ParallaxBackground from './components/ParallaxBackground';

const sectionVariants = {
  initial: {
    clipPath: "circle(0% at 50% 100%)",
    opacity: 0,
    zIndex: 20,
  },
  animate: {
    clipPath: "circle(150% at 50% 50%)",
    opacity: 1,
    zIndex: 10,
    transition: {
      type: "spring",
      stiffness: 20,
      damping: 20,
      duration: 1.5,
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    zIndex: 0,
    transition: {
      duration: 0.8
    }
  }
};

function App() {
  const [step, setStep] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [aboutYouCardIndex, setAboutYouCardIndex] = useState(0);

  const totalSteps = 6;
  const totalAboutYouCards = 7;

  // High-Performance Ambient Pet State
  const [isCatAwake, setIsCatAwake] = useState(false);
  const catRef = useRef(null);
  
  // Audio state
  const meowSound = useRef(null);

  useEffect(() => {
    // Initialize Howler audio exactly as PRD requested
    meowSound.current = new Howl({
      src: ['https://cdn.freesound.org/previews/110/110011_1537434-lq.mp3'], // Reliable free cat meow
      volume: 0.5,
      preload: true
    });
  }, []);

  const handleWakeCat = () => {
    if (!isCatAwake) {
      setIsCatAwake(true);
    }
    // Defensive playback: check if already playing to prevent overlap
    if (meowSound.current && !meowSound.current.playing()) {
      meowSound.current.play();
    }
  };

  // Dedicated RequestAnimationFrame Loop for GPU-Accelerated Lerp Tracking
  useEffect(() => {
    if (!isCatAwake) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let animationFrameId;

    const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

    const handleMouseMove = (e) => {
      // Offset slightly to the right of the cursor
      targetX = e.clientX + 20; 
      targetY = e.clientY + 20;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const renderLoop = () => {
      // Linear interpolation to calculate weighted acceleration
      currentX = lerp(currentX, targetX, 0.08);
      currentY = lerp(currentY, targetY, 0.08);

      if (catRef.current) {
        // Hardware Accelerated Transform
        catRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isCatAwake]);

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
        setTimeout(() => setIsScrolling(false), 2000); // Main section transition debounce
      } else if (e.deltaY < -30 && step > 1) { // Prevents going back to cake
        setIsScrolling(true);
        setStep(prev => prev - 1);
        setTimeout(() => setIsScrolling(false), 2000);
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
        setTimeout(() => setIsScrolling(false), 2000);
      } else if (deltaY < -50 && step > 1) {
        setIsScrolling(true);
        setStep(prev => prev - 1);
        setTimeout(() => setIsScrolling(false), 2000);
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
    <AboutYou activeCardIndex={aboutYouCardIndex} onWakeCat={handleWakeCat} isCatAwake={isCatAwake} />,
    <CosmicConstellation />,
    <MapGallery />,
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
      
      {/* Global Easter Egg: GPU Accelerated Cat */}
      <AnimatePresence>
        {isCatAwake && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="fixed top-0 left-0 z-[200] pointer-events-none drop-shadow-lg will-change-transform"
          >
            <div ref={catRef} className="absolute top-0 left-0">
               <img src="https://api.dicebear.com/8.x/fun-emoji/svg?seed=Felix" alt="Following Cat" className="w-16 h-16 animate-bounce-slow" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
