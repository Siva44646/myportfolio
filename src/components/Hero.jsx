import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import axios from 'axios'

const TransparentAvatar = ({ src, className }) => {
  const [dataUrl, setDataUrl] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // The background is around #0a0a0a (RGB ~10). We remove dark pixels smoothly.
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        const max = Math.max(r, g, b);
        
        // If the pixel is very dark (background)
        if (max < 25) {
          // Hard threshold to completely remove the background without creating gray artifacts
          data[i+3] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      setDataUrl(canvas.toDataURL('image/png'));
    };
    img.src = src;
  }, [src]);

  if (!dataUrl) return null;

  return (
    <motion.div 
      className="absolute inset-0 z-10 w-full h-full flex justify-center"
    >
      <motion.img 
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        src={dataUrl} 
        alt="Profile Avatar" 
        className={className}
      />
    </motion.div>
  );
};

export default function Hero() {
  const [profile, setProfile] = useState(null)
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/content/profile');
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!profile || !profile.roles || profile.roles.length === 0) return;
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % profile.roles.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [profile])

  if (!profile) return null;

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-neutral-950">
        <div className="absolute top-0 -translate-y-12 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full mt-10 md:mt-0">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* LEFT CONTENT: TEXT */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-md mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-sm font-medium text-neutral-300">{profile.availability}</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
            >
              Hi, I'm <br className="hidden md:block lg:hidden" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                {profile.name}
              </span>
            </motion.h1>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-12 mb-6"
            >
              <motion.p
                key={currentRoleIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-2xl md:text-3xl font-medium text-cyan-400"
              >
                {profile.roles?.[currentRoleIndex] || 'Developer'}
              </motion.p>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg md:text-xl text-neutral-400 mb-10 max-w-xl"
            >
              {profile.tagline}
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <a 
                href="#projects" 
                className="group flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-neutral-200 transition-colors"
              >
                View Projects
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>

          {/* RIGHT CONTENT: AVATAR */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-2 mt-10 lg:mt-0">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[360px] lg:h-[360px] flex justify-center items-center"
            >
              <TransparentAvatar 
                src="/avatar_final.png" 
                className="w-[110%] h-[110%] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)] absolute bottom-0"
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
