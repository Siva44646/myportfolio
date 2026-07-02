import { useRef, useState, useEffect } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { FiGithub } from 'react-icons/fi'
import axios from 'axios'

function ProjectCard({ project, index }) {
  const ref = useRef(null)
  
  // 3D Tilt Effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

  const rotateX = useMotionTemplate`${mouseYSpring}deg`
  const rotateY = useMotionTemplate`${mouseXSpring}deg`

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct * 15) // Max rotation angle
    y.set(yPct * -15)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const techArray = project.tech ? project.tech.split(',').map(t => t.trim()) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      style={{ perspective: 1000 }}
      className="group relative"
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative h-full p-8 rounded-[2.5rem] bg-neutral-900 border border-white/10 overflow-hidden"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
        
        <div style={{ transform: 'translateZ(50px)' }} className="relative z-10 h-full flex flex-col">
          <h3 className="text-3xl font-bold mb-4">{project.title}</h3>
          <p className="text-neutral-400 leading-relaxed mb-8 flex-grow">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            {techArray.map((t) => (
              <span key={t} className="px-3 py-1 rounded-full text-xs font-medium border border-white/20 text-neutral-300">
                {t}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-auto">
            <a href={project.demo?.startsWith('http') ? project.demo : `https://${project.demo}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium hover:text-cyan-400 transition-colors">
              <ExternalLink size={18} />
              Open Project
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('/api/projects');
        setProjects(res.data);
      } catch (err) {
        console.error('Failed to fetch projects', err);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="py-32 bg-neutral-950 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="mb-20 md:text-center">
          <h2 className="text-sm font-semibold tracking-widest text-cyan-400 uppercase mb-4">
            Selected Work
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight">
            Featured Projects
          </h3>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
