import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'

export default function Achievements() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await axios.get('/api/content/achievements');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAchievements();
  }, []);

  if (stats.length === 0) return null;

  return (
    <section className="py-24 bg-neutral-900 border-y border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1, type: "spring" }}
              className="text-center"
            >
              <div className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
                {stat.value}{stat.suffix}
              </div>
              <div className="text-neutral-400 font-medium tracking-wide uppercase text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
