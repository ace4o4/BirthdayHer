import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function CakeSection({ onBlowCandles }) {
  const [isBlowing, setIsBlowing] = useState(false);
  const [candlesLit, setCandlesLit] = useState(true);
  const [audioContext, setAudioContext] = useState(null);
  const [analyser, setAnalyser] = useState(null);
  const [microphone, setMicrophone] = useState(null);

  useEffect(() => {
    let animationFrameId;

    if (isBlowing && analyser) {
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const checkVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        
        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const averageVolume = sum / dataArray.length;

        // Threshold for blowing (adjust as needed, typically a loud noise like blowing reaches > 40-50)
        if (averageVolume > 50) {
          extinguishCandles();
        } else {
          animationFrameId = requestAnimationFrame(checkVolume);
        }
      };
      
      checkVolume();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isBlowing, analyser]);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyserNode = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      
      analyserNode.fftSize = 256;
      source.connect(analyserNode);

      setAudioContext(audioCtx);
      setAnalyser(analyserNode);
      setMicrophone(source);
      setIsBlowing(true);
    } catch (err) {
      console.error('Microphone access denied or not supported', err);
      // Fallback: just allow clicking
      alert("Microphone access is needed to blow the candles! But you can also just tap the cake.");
    }
  };

  const extinguishCandles = () => {
    setCandlesLit(false);
    setIsBlowing(false);
    
    // Stop microphone access
    if (microphone) {
      microphone.mediaStream.getTracks().forEach(track => track.stop());
    }
    if (audioContext) {
      audioContext.close();
    }

    setTimeout(() => {
      onBlowCandles();
    }, 2000); // Wait 2s before passing control back
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-white/20 backdrop-blur-sm relative overflow-hidden">
      {/* Background decorations */}
      <motion.div 
        animate={{ y: [0, -20, 0] }} 
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 text-4xl opacity-50"
      >
        ✨
      </motion.div>
      <motion.div 
        animate={{ y: [0, -30, 0] }} 
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 right-10 text-5xl opacity-50"
      >
        🎈
      </motion.div>

      <div className="z-10 text-center">
        <h1 className="text-4xl md:text-5xl font-display text-slate-800 mb-8 drop-shadow-sm font-bold">
          Happy Birthday!
        </h1>
        
        {/* Cake Container */}
        <motion.div 
          className="relative cursor-pointer w-64 h-64 mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (!isBlowing && candlesLit) {
              extinguishCandles(); // Fallback on click
            }
          }}
        >
          {/* Cake SVG Graphic */}
          <div className="absolute bottom-0 w-full flex justify-center flex-col items-center">
            {/* Candles */}
            <div className="flex space-x-4 mb-[-10px] z-20">
              {[0, 1, 2].map((i) => (
                <div key={i} className="relative">
                  <div className="w-3 h-12 bg-pink-300 rounded-sm border-2 border-pink-400"></div>
                  {/* The flame */}
                  {candlesLit && (
                    <motion.div 
                      initial={{ scale: 1 }}
                      animate={{ 
                        scale: [1, 1.2, 0.9, 1.1, 1],
                        rotate: [-5, 5, -3, 3, 0]
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 0.5,
                        delay: i * 0.1
                      }}
                      className="absolute -top-6 -left-1.5 w-6 h-8 bg-yellow-400 rounded-full"
                      style={{ 
                        boxShadow: '0 0 10px #facc15, 0 0 20px #fb923c',
                        borderTopLeftRadius: '50%',
                        borderTopRightRadius: '50%',
                        borderBottomLeftRadius: '10px',
                        borderBottomRightRadius: '10px'
                      }}
                    />
                  )}
                  {/* Smoke if extinguished */}
                  {!candlesLit && (
                    <motion.div 
                      initial={{ opacity: 1, y: 0, scale: 0.5 }}
                      animate={{ opacity: 0, y: -40, scale: 2 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="absolute -top-4 w-4 h-4 rounded-full bg-gray-300 filter blur-sm"
                    />
                  )}
                </div>
              ))}
            </div>
            
            {/* Cake Base */}
            <div className="w-56 h-20 bg-cute-pink rounded-t-xl border-4 border-pink-300 relative z-10 
                            flex justify-center items-center overflow-hidden">
               {/* Frosting Drips */}
               <div className="absolute top-0 w-full h-8 bg-white opacity-80 rounded-b-xl" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 20%, 80% 100%, 60% 40%, 40% 100%, 20% 30%, 0 80%)'}}></div>
            </div>
            <div className="w-64 h-12 bg-pink-400 rounded-b-xl border-4 border-pink-500 shadow-lg"></div>
          </div>
        </motion.div>

        {candlesLit && (
          <div className="mt-12 space-y-4">
            {!isBlowing ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startListening}
                className="px-6 py-3 bg-white text-pink-500 font-bold rounded-full shadow-md hover:shadow-lg transition-shadow border-2 border-pink-200"
              >
                Make a wish & turn on Mic to blow! 💨
              </motion.button>
            ) : (
              <motion.p 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-pink-600 font-bold text-lg"
              >
                Waiting for a big blow... 😮💨
              </motion.p>
            )}
            <p className="text-gray-500 text-sm italic">Or just tap the cake to blow them out</p>
          </div>
        )}
      </div>
    </section>
  );
}
