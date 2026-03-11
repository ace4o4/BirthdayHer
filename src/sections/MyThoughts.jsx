import { motion } from 'framer-motion';

export default function MyThoughts() {
  return (
    <section className="py-24 bg-white/20 backdrop-blur-sm relative overflow-hidden">
      
      {/* Decorative stars */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#F472B6 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 150 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 100, damping: 10, bounce: 0.6 }}
          className="max-w-3xl mx-auto bg-white/80 backdrop-blur-md rounded-[40px] p-10 md:p-14 shadow-2xl border-4 border-white text-center relative"
        >
          {/* Cute corner tags */}
          <div className="absolute -top-6 -left-6 w-16 h-16 bg-pink-400 rounded-full flex items-center justify-center text-white text-2xl rotate-12 shadow-md">
             💌
          </div>

          <span className="text-pink-500 font-bold tracking-widest uppercase text-sm mb-4 block">Special Greetings</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-800 mb-8">
            My Thoughts About You
          </h2>
          
          <div className="text-lg md:text-xl text-slate-600 font-sans leading-relaxed space-y-6">
            <p>
              Hey there! Today is all about celebrating the wonderful person you are. 
              I just wanted to take a moment to tell you how truly special you are to me, 
              and to everyone around you. 
            </p>
            <p>
              Your kindness, your laughter, and that amazing energy you bring make the world 
              so much brighter. It's rare to meet someone quite like you—someone with such a 
              big heart and such a beautiful soul.
            </p>
            <p className="font-medium text-pink-600 text-2xl pt-4">
               “The world is better with you in it.” 💕
            </p>
            <p>
              I hope this year brings you as much happiness as you give to others. 
              Dream big, smile often, and never forget how amazing you are!
            </p>
          </div>
          
          <div className="mt-12">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-pink-500 text-white rounded-full font-bold shadow-lg hover:shadow-pink-300 transition-all"
            >
              Lots of Love 💖
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
