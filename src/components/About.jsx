import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Cpu, Code2, Rocket, Briefcase, GraduationCap } from 'lucide-react'
import axios from 'axios'

const iconMap = {
  Cpu, Code2, Rocket, Briefcase, GraduationCap
};

export default function About() {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get('/api/content/about');
        setAboutData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAbout();
  }, []);

  if (!aboutData) return null;

  return (
    <section id="about" className="py-32 bg-neutral-950 relative">
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-cyan-900/20 rounded-full blur-[128px] -translate-y-1/2 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm font-semibold tracking-widest text-cyan-400 uppercase mb-4">
              About Me
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
              Engineering the future of web experiences.
            </h3>
            
            <div className="space-y-6 text-neutral-400 text-lg leading-relaxed">
              <p>{aboutData.story}</p>
            </div>
          </motion.div>

          <div className="grid gap-6">
            {aboutData.highlights.map((item, index) => {
              const Icon = iconMap[item.icon] || Cpu;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="glass p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-colors group"
                >
                  <div className="flex gap-4">
                    <div className="mt-1 w-12 h-12 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                      <Icon className="text-cyan-400" size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                      <p className="text-neutral-500 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  )
}
