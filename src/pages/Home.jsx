import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Skills from '../components/Skills'
import Projects from '../components/Projects'
import Timeline from '../components/Timeline'
import Achievements from '../components/Achievements'
import Contact from '../components/Contact'

export default function Home() {
  const lenisRef = useRef()

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenisRef.current = lenis

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Sync GSAP with Lenis
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0, 0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf)
    }
  }, [])

  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Timeline />
      <Achievements />
      <Contact />
      
      {/* Footer */}
      <footer className="py-8 text-center text-neutral-500 text-sm border-t border-white/5">
        <p>&copy; {new Date().getFullYear()} A. Siva Kumar. All rights reserved.</p>
      </footer>
    </>
  )
}
