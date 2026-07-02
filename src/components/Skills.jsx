import { useState, useRef, useEffect } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import axios from 'axios'

function BentoCard({ category, index }) {
  const ref = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group relative flex flex-col rounded-3xl border border-white/5 bg-neutral-900 p-8 overflow-hidden hover:border-white/10 transition-colors ${category.borderColor}`}
      onMouseMove={handleMouseMove}
      ref={ref}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(255,255,255,0.05),
              transparent 80%
            )
          `,
        }}
      />

      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${category.color} rounded-full blur-[50px] pointer-events-none`} />

      <h3 className="text-2xl font-bold mb-6 relative z-10">{category.title}</h3>
      
      <div className="flex flex-wrap gap-3 relative z-10">
        {category.skills.map(skill => (
          <span 
            key={skill}
            className="px-4 py-2 rounded-xl bg-neutral-950 border border-white/5 text-neutral-300 text-sm font-medium"
          >
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export default function Skills() {
  const [skillCategories, setSkillCategories] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get('/api/content/skills');
        setSkillCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSkills();
  }, []);

  return (
    <section id="skills" className="py-32 bg-neutral-950 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-20">
          <h2 className="text-sm font-semibold tracking-widest text-cyan-400 uppercase mb-4">
            Technical Arsenal
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight">
            Tools & Technologies
          </h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, index) => (
            <BentoCard key={category.title} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
