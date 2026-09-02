import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'

const LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#footer' },
]

export default function Navbar({ onHire, hireOpen = false, ready = false }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock the page behind the mobile panel so the body doesn't scroll under it.
  // The hire dialog is checked too: opening it from the mobile menu closes the
  // panel in the same commit, and this parent effect runs *after* the dialog's
  // own lock — without `hireOpen` here it would immediately clear it again.
  useEffect(() => {
    document.body.style.overflow = open || hireOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open, hireOpen])

  /**
   * Navigate to a section.
   *
   * The default anchor jump is unreliable from the mobile panel: the browser
   * acts on the click while `body` is still `overflow: hidden` from the open
   * menu, so the scroll is swallowed and the tap appears to do nothing. Closing
   * the menu first and scrolling on the next frame — once the lock is released
   * — makes every link work on touch.
   */
  const goTo = useCallback((e, href) => {
    e.preventDefault()
    setOpen(false)
    requestAnimationFrame(() => {
      const target = document.querySelector(href)
      if (!target) return
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // Keep the URL in step without triggering a second, instant jump.
      history.replaceState(null, '', href)
    })
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[9000] transition-all duration-500 ${
        scrolled
          ? 'border-b border-white/10 bg-black/50 py-2.5 backdrop-blur-xl'
          : 'border-b border-transparent py-4 sm:py-6'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 sm:px-6 lg:px-10">
        <a
          href="#home"
          onClick={(e) => goTo(e, '#home')}
          className="shrink-0"
          aria-label="Harish Sai — Frontend Developer, back to top"
        >
          {/* Rises into place once the cover has lifted, echoing the
              opening animation rather than just appearing. */}
          <span className="block overflow-hidden">
            <motion.img
              src="/logo.png"
              alt="Harish Sai — Frontend Dev"
              width={1053}
              height={508}
              initial={{ y: '110%', opacity: 0 }}
              animate={ready ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="h-10 w-auto sm:h-11 lg:h-12"
            />
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-9 md:flex">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={(e) => goTo(e, link.href)}
                className="group relative text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                {link.label}
                <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-brand transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex shrink-0 items-center gap-2.5">
          {/* Stays visible at every width — only the padding tightens on mobile. */}
          <button
            type="button"
            onClick={onHire}
            className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold whitespace-nowrap text-white backdrop-blur-md transition-all duration-300 hover:border-white/50 hover:bg-white/20 hover:shadow-[0_0_28px_-4px] hover:shadow-brand focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none sm:px-6 sm:py-2.5 sm:text-sm"
          >
            Hire Me
          </button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="flex size-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden bg-brand md:hidden"
          >
            <ul className="flex flex-col px-5 py-3">
              {LINKS.map((link, i) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.3 }}
                  className="border-b border-black/10 last:border-0"
                >
                  <a
                    href={link.href}
                    onClick={(e) => goTo(e, link.href)}
                    className="block py-3.5 text-xl font-bold text-white"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
              <li className="pt-4 pb-2">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    onHire?.()
                  }}
                  className="block w-full rounded-full bg-white py-3.5 text-center text-base font-bold text-brand"
                >
                  Hire Me
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
