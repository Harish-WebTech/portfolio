import { useEffect, useState } from 'react'
import Preloader from './components/Preloader.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Services from './components/Services.jsx'
import Process from './components/Process.jsx'
import Projects from './components/Projects.jsx'
import Footer from './components/Footer.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import HireMeModal from './components/HireMeModal.jsx'

export default function App() {
  const [loaded, setLoaded] = useState(false)
  // Lifted here so both the header's Hire Me and the hero's Contact Me open the
  // one existing enquiry form rather than each owning a copy of it.
  const [hireOpen, setHireOpen] = useState(false)

  // Browsers restore the previous scroll position on refresh, which would drop
  // the visitor mid-page behind the preloader. Always start at the hero.
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }, [])

  // Hold the page still until the preloader is done, then make sure we are
  // still at the top before revealing the hero.
  useEffect(() => {
    if (!loaded) {
      document.body.style.overflow = 'hidden'
      return
    }
    document.body.style.overflow = ''
    window.scrollTo(0, 0)
  }, [loaded])

  const openHire = () => setHireOpen(true)

  return (
    <>
      <Preloader onComplete={() => setLoaded(true)} />
      <div
        className={`transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      >
        <ScrollProgress />
        <Navbar onHire={openHire} hireOpen={hireOpen} ready={loaded} />
        <main>
          {/* Playback waits for `ready` so the reel never runs behind the preloader. */}
          <Hero ready={loaded} onHire={openHire} />
          <About />
          <Services />
          <Process />
          <Projects />
        </main>
        <Footer />
      </div>

      <HireMeModal open={hireOpen} onClose={() => setHireOpen(false)} />
    </>
  )
}
