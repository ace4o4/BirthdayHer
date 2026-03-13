import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function ScratchOffReveal({ onReveal }) {
  const canvasRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showPattern, setShowPattern] = useState(true);

  // Use refs for mutable values that shouldn't trigger re-renders
  const isRevealedRef = useRef(false);
  const drawState = useRef({ isDrawing: false, lastX: 0, lastY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // We use a regular context, not willReadFrequently for performance, 
    // unless we strictly do heavy readbacks. Since we readback periodically, let's keep it default
    // or set willReadFrequently as requested by some browsers for imageData.
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    let resizeTimeout;

    const setCanvasSize = () => {
      // Device Pixel Ratio scaling for high fidelity
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      // Scale context to ensure correct drawing operations
      ctx.scale(dpr, dpr);
      
      // CSS size
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      fillCanvas(rect.width, rect.height);
    };

    const fillCanvas = (width, height) => {
      if (isRevealedRef.current) return;
      
      ctx.globalCompositeOperation = 'source-over';
      
      // Solid background
      ctx.fillStyle = '#0f172a'; // Deep slate blue base
      ctx.fillRect(0, 0, width, height);

      // Draw Aipan style geometric pattern as a guide
      ctx.strokeStyle = '#E0F2F1'; // Glowing light teal
      ctx.lineWidth = 4;
      ctx.shadowColor = '#5F9EA0';
      ctx.shadowBlur = 15;

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw a massive glowing mandala/aipan pattern
      for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        for (let j = 0; j < 6; j++) {
          ctx.arc(
            centerX + Math.cos((i * Math.PI) / 6) * (100 + j * 40),
            centerY + Math.sin((i * Math.PI) / 6) * (100 + j * 40),
            20 + j * 5,
            0,
            Math.PI * 2
          );
        }
        ctx.stroke();
      }
      
      // Text hint
      ctx.shadowBlur = 0;
      ctx.font = 'bold 32px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText("Trace the pattern to reveal your gift...", centerX, centerY + 350);
    };

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setCanvasSize, 200); // Debounce resize
    };

    setCanvasSize();
    window.addEventListener('resize', handleResize);

    const scratchRadius = 45; // Eraser size

    const getCoordinates = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const scratch = (startX, startY, endX, endY) => {
      if (isRevealedRef.current) return;
      
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = scratchRadius * 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Check percentage cleared periodically (throttle checks)
      if (Math.random() > 0.85) {
        checkReveal();
      }
    };

    const checkReveal = () => {
      if (isRevealedRef.current) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement.getBoundingClientRect();
      // Only grab a segment to check or downsample for performance
      const imageData = ctx.getImageData(0, 0, rect.width * dpr, rect.height * dpr);
      const pixels = imageData.data;
      
      let transparentPixels = 0;
      const stride = 32; // Check every 32nd pixel to save extreme CPU loops
      let checked = 0;

      for (let i = 0; i < pixels.length; i += 4 * stride) {
        checked++;
        if (pixels[i + 3] < 10) { // Alpha channel almost 0
          transparentPixels++;
        }
      }

      const percentCleared = (transparentPixels / checked) * 100;
      
      // Per PRD, trigger finish at 85%
      if (percentCleared > 75) { 
        isRevealedRef.current = true;
        
        // Remove listeners
        cleanupListeners();
        
        // Fill remaining quickly to show closure visually
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        
        setShowPattern(false);

        // Wait a tiny bit for transition, then set revealed state
        setTimeout(() => {
          setIsRevealed(true);
          if (onReveal) onReveal();
          
          // Victory Confetti
          const duration = 3000;
          const end = Date.now() + duration;
          
          (function frame() {
            confetti({
              particleCount: 5,
              angle: 60,
              spread: 55,
              origin: { x: 0 },
              colors: ['#A0E8AF', '#D4F1E1', '#E8F5E9', '#ffffff']
            });
            confetti({
              particleCount: 5,
              angle: 120,
              spread: 55,
              origin: { x: 1 },
              colors: ['#A0E8AF', '#D4F1E1', '#E8F5E9', '#ffffff']
            });
            if (Date.now() < end) requestAnimationFrame(frame);
          }());
        }, 500);
      }
    };

    const handlePointerDown = (e) => {
      const { x, y } = getCoordinates(e);
      drawState.current = { isDrawing: true, lastX: x, lastY: y };
      
      // Draw single point
      scratch(x, y, x + 0.1, y + 0.1);
    };

    const handlePointerMove = (e) => {
      if (!drawState.current.isDrawing) return;
      e.preventDefault(); // Prevent scrolling on touch
      
      const { x, y } = getCoordinates(e);
      scratch(drawState.current.lastX, drawState.current.lastY, x, y);
      
      drawState.current.lastX = x;
      drawState.current.lastY = y;
    };

    const handlePointerUp = () => {
      drawState.current.isDrawing = false;
    };

    // Attach listeners
    canvas.addEventListener('mousedown', handlePointerDown);
    canvas.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    // Touch events (passive: false is critical for preventDefault)
    canvas.addEventListener('touchstart', handlePointerDown, { passive: false });
    canvas.addEventListener('touchmove', handlePointerMove, { passive: false });
    window.addEventListener('touchend', handlePointerUp);

    const cleanupListeners = () => {
      canvas.removeEventListener('mousedown', handlePointerDown);
      canvas.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      canvas.removeEventListener('touchstart', handlePointerDown);
      canvas.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      cleanupListeners();
    };
  }, [onReveal]);

  return (
    <AnimatePresence>
      {!isRevealed && (
        <motion.div
          className="absolute inset-0 z-[100] cursor-crosshair"
          exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
          animate={{ filter: showPattern ? 'none' : 'brightness(2) blur(10px)' }} // Bloom filter on complete
          style={{ touchAction: 'none' }} // Critical for mobile to stop scrolling
        >
          <canvas 
            ref={canvasRef} 
            className="block w-full h-full"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
