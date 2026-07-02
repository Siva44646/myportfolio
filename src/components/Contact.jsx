import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, MapPin, Mail } from 'lucide-react'
import { FiGithub, FiLinkedin } from 'react-icons/fi'
import axios from 'axios'

export default function Contact() {
  const [profile, setProfile] = useState(null);

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

  if (!profile) return null;

  return (
    <section id="contact" className="py-32 bg-neutral-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-sm font-semibold tracking-widest text-cyan-400 uppercase mb-4">
              Get In Touch
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
              Let's build something extraordinary together.
            </h3>
            
            <p className="text-neutral-400 leading-relaxed mb-12 max-w-md">
              Whether you have a question, a project idea, or just want to say hi, my inbox is always open. I'll try my best to get back to you!
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-neutral-300">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <Mail size={20} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Email</p>
                  <a href={`mailto:${profile.email}`} className="font-medium hover:text-cyan-400 transition-colors">{profile.email}</a>
                </div>
              </div>

              <div className="flex items-center gap-4 text-neutral-300">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <MapPin size={20} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Location</p>
                  <p className="font-medium">India</p>
                </div>
              </div>
            </div>

            <div className="mt-12 flex gap-4">
              <a href={profile.github?.startsWith('http') ? profile.github : `https://${profile.github}`} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group">
                <FiGithub size={20} className="text-neutral-400 group-hover:text-white transition-colors" />
              </a>
              <a href={profile.linkedin?.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group">
                <FiLinkedin size={20} className="text-neutral-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass p-8 md:p-12 rounded-[2.5rem] relative"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
            
            <form className="relative z-10 space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2 group">
                <label className="text-sm font-medium text-neutral-400 ml-1 group-focus-within:text-cyan-400 transition-colors">Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-neutral-900/50 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-400/50 focus:bg-neutral-900 transition-all"
                />
              </div>

              <div className="space-y-2 group">
                <label className="text-sm font-medium text-neutral-400 ml-1 group-focus-within:text-cyan-400 transition-colors">Email</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full bg-neutral-900/50 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-400/50 focus:bg-neutral-900 transition-all"
                />
              </div>

              <div className="space-y-2 group">
                <label className="text-sm font-medium text-neutral-400 ml-1 group-focus-within:text-cyan-400 transition-colors">Message</label>
                <textarea
                  rows={4}
                  placeholder="Tell me about your project..."
                  className="w-full bg-neutral-900/50 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-cyan-400/50 focus:bg-neutral-900 transition-all resize-none"
                />
              </div>

              <button className="w-full py-4 px-8 rounded-2xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors group">
                Send Message
                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
