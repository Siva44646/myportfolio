import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Briefcase, GraduationCap, Code2, Rocket, Cpu } from 'lucide-react'
import axios from 'axios'

const iconMap = {
  Briefcase, GraduationCap, Code2, Rocket, Cpu
};

export default function Timeline() {
  const containerRef = useRef(null)
  const [timelineEvents, setTimelineEvents] = useState([]);
  
  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await axios.get('/api/content/timeline');
        setTimelineEvents(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTimeline();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  })

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  if (timelineEvents.length === 0) return null;

  return (
    <section id="experience" className="py-32 bg-neutral-950 relative" ref={containerRef}>
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <div className="mb-20 text-center">
          <h2 className="text-sm font-semibold tracking-widest text-cyan-400 uppercase mb-4">
            Journey
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight">
            Experience & Education
          </h3>
        </div>

        <div className="relative">
          {/* Main vertical line */}
          <div className="absolute left-[27px] md:left-1/2 top-0 bottom-0 w-[2px] bg-white/5 md:-translate-x-1/2" />
          
          {/* Animated drawing line */}
          <motion.div 
            style={{ height: lineHeight }}
            className="absolute left-[27px] md:left-1/2 top-0 w-[2px] bg-gradient-to-b from-cyan-400 to-purple-500 md:-translate-x-1/2" 
          />

          <div className="space-y-12 md:space-y-24">
            {timelineEvents.map((event, index) => {
              const isEven = index % 2 === 0
              const Icon = iconMap[event.icon] || Briefcase;
              
              return (
                <div key={index} className="relative flex items-center md:justify-center">
                  
                  {/* Timeline Node */}
                  <motion.div 
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                    className="absolute left-0 md:left-1/2 w-14 h-14 rounded-full bg-neutral-950 border-4 border-cyan-400/20 flex items-center justify-center z-10 md:-translate-x-1/2"
                  >
                    <div className="w-8 h-8 rounded-full bg-cyan-400/10 flex items-center justify-center">
                      <Icon size={16} className="text-cyan-400" />
                    </div>
                  </motion.div>

                  {/* Content Card */}
                  <div className={`w-full ml-20 md:ml-0 md:w-1/2 ${isEven ? 'md:pr-16 md:text-right md:mr-auto' : 'md:pl-16 md:ml-auto'}`}>
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? -50 : 50, y: 30 }}
                      whileInView={{ opacity: 1, x: 0, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6 }}
                      className="glass p-8 rounded-3xl border border-white/5 hover:border-white/10 transition-colors group relative overflow-hidden"
                    >
                      <div className={`absolute top-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none ${isEven ? 'right-0' : 'left-0'}`} />
                      
                      <span className="inline-block px-3 py-1 rounded-full bg-white/5 text-cyan-400 text-xs font-semibold mb-4 border border-white/10">
                        {event.date}
                      </span>
                      <h4 className="text-2xl font-bold mb-1">{event.title}</h4>
                      <h5 className="text-neutral-400 font-medium mb-4">{event.company}</h5>
                      
                      <ul className={`space-y-2 text-sm text-neutral-500 ${isEven ? 'md:flex md:flex-col md:items-end' : ''}`}>
                        {event.highlights.map((highlight, i) => (
                          <li key={i} className="flex items-start gap-2 max-w-sm">
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-cyan-400 shrink-0" />
                            <span className={isEven ? 'md:text-right' : 'text-left'}>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
