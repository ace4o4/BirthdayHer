import { motion } from 'framer-motion';

export default function Gallery() {
  const images = [
    { src: "https://images.unsplash.com/photo-1542442828-287217bfb8e0?q=80&w=600&auto=format&fit=crop", rot: "-rotate-3" },
    { src: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?q=80&w=600&auto=format&fit=crop", rot: "rotate-2" },
    { src: "https://images.unsplash.com/photo-1581577712398-35cbcd12b323?q=80&w=600&auto=format&fit=crop", rot: "-rotate-2" },
    { src: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop", rot: "rotate-3" },
    { src: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=600&auto=format&fit=crop", rot: "-rotate-1" },
    { src: "https://images.unsplash.com/photo-1621252179027-9dbf90e3cd29?q=80&w=600&auto=format&fit=crop", rot: "rotate-2" },
  ];

  return (
    <section className="py-24 bg-cute-yellow relative overflow-hidden">
      <div className="container mx-auto px-6">
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-orange-500 font-bold tracking-widest uppercase text-sm mb-2 block">Sweet Memories</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-800">
            Gallery of Joy 📸
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6, type: "spring" }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
              className={`relative p-4 bg-white shadow-xl rounded-sm ${img.rot} border border-gray-100 transition-all duration-300`}
            >
              {/* Cute tape */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-pink-200 opacity-60 rotate-2 z-10"></div>
              
              <div className="overflow-hidden rounded-sm aspect-square bg-gray-100">
                <img 
                  src={img.src} 
                  alt="Memory" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" 
                  loading="lazy"
                />
              </div>
              <div className="mt-4 text-center">
                <p className="font-display text-gray-400 font-medium">~ memory {idx + 1} ~</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h3 className="text-3xl font-display text-pink-500 font-bold py-10">
            Once again, Happy Birthday! 🎂✨
          </h3>
        </motion.div>

      </div>
    </section>
  );
}
