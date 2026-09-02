import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Pause, Play, ChevronDown } from 'lucide-react'
import OutlineText from './OutlineText.jsx'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] } },
}

export default function Hero({ ready = false, onHire }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  // The element paints its first frame as soon as data arrives, which reads as a
  // stray thumbnail before playback begins. Keep it hidden until it is really
  // running, then fade it up out of the section background.
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    // Wait for the preloader to finish, so the reel is never running unseen.
    if (!ready) return

    const video = videoRef.current
    if (!video) return

    const events = ['pointerdown', 'keydown', 'touchstart', 'wheel']
    let unmute = null

    const cleanup = () => {
      if (!unmute) return
      events.forEach((e) => window.removeEventListener(e, unmute))
      unmute = null
    }

    const start = () => {
      video.volume = 1
      video.muted = false

      // Play with sound, as intended. Browsers only allow that once the visitor
      // has built up enough engagement with the site; if this load isn't there
      // yet the promise rejects, so fall back to a muted play — the reel still
      // runs — and lift the mute the moment the page gets any interaction.
      video.play().catch(() => {
        video.muted = true
        video.play().catch(() => { })

        unmute = () => {
          video.muted = false
          video.volume = 1
          cleanup()
        }
        events.forEach((e) =>
          window.addEventListener(e, unmute, { once: true, passive: true }),
        )
      })
    }

    // Only start once there is enough buffered to play through without stalling.
    if (video.readyState >= 3) {
      start()
    } else {
      video.addEventListener('canplaythrough', start, { once: true })
    }

    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onPlaying = () => setRevealed(true)
    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    video.addEventListener('playing', onPlaying)

    // Nothing to unmute once it has finished.
    video.addEventListener('ended', cleanup, { once: true })

    return () => {
      cleanup()
      video.removeEventListener('canplaythrough', start)
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('ended', cleanup)
    }
  }, [ready])

  const toggle = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      // Once the reel has finished, the button becomes a replay.
      if (video.ended) video.currentTime = 0
      video.play().catch(() => {
        // Sound may be refused on a manual replay too; fall back to muted.
        video.muted = true
        video.play().catch(() => { })
      })
    } else {
      video.pause()
    }
  }

  return (
    <section
      id="home"
      className="relative flex min-h-screen min-h-[100svh] items-end overflow-hidden bg-ink lg:items-center"
    >
      {/* Background video. Started from the effect above once the preloader has
          finished and enough is buffered — no autoPlay attribute, or it would
          run behind the preloader. No `loop`: it holds on its final frame.
          No `poster` yet — see README to generate one and add it back. */}
      <video
        ref={videoRef}
        className={`absolute inset-0 size-full object-cover object-[68%_26%] transition-opacity duration-500 sm:object-[62%_38%] lg:object-center ${revealed ? 'opacity-100' : 'opacity-0'}`}
        src="/hero.mp4"
        playsInline
        preload="auto"
      />

      {/* Legibility scrim — kept only as strong as the text needs. Weighted to
          the left, where the copy sits, so the footage stays visible on the right. */}
      {/* Mobile: the copy sits on a heavy base wash so the upper half of the
          frame stays clear; only a light top scrim keeps the header legible. */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink from-5% via-ink/80 via-38% to-transparent sm:hidden" />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink/55 to-transparent sm:hidden" />

      {/* Desktop scrim, weighted left where the copy sits. */}
      <div className="absolute inset-0 hidden sm:block sm:bg-gradient-to-r sm:from-black/70 sm:via-black/35 sm:to-transparent" />
      <div className="absolute inset-0 hidden sm:block sm:bg-gradient-to-t sm:from-ink/90 sm:via-transparent sm:to-ink/25" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto flex w-full max-w-7xl flex-col items-start gap-5 px-5 pt-24 pb-14 sm:gap-8 sm:px-6 sm:py-32 lg:flex-row lg:items-center lg:justify-between lg:gap-14 lg:px-10"
      >
        {/* Left: headline, intro, CTAs */}
        <div className="order-last max-w-2xl lg:order-none">
          <motion.p
            variants={fadeUp}
            className="mb-4 font-mono text-[10px] tracking-[0.3em] text-brand uppercase sm:mb-6 sm:text-xs sm:tracking-[0.35em]"
          >
            Portfolio — 2026
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="text-[2.1rem] leading-[1] font-black tracking-tight text-white min-[380px]:text-[2.5rem] sm:text-6xl sm:leading-[0.95] lg:text-7xl"
          >
            Hi, I&apos;m Harish Sai
            <OutlineText className="mt-2 max-w-[19rem] min-[380px]:max-w-[22rem] sm:mt-3 sm:max-w-[38rem]">
              Frontend Developer
            </OutlineText>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-xl text-sm leading-relaxed text-white/75 drop-shadow-lg sm:mt-8 sm:text-base md:text-lg"
          >
            I build modern web interfaces with React, TypeScript and Tailwind CSS —
            responsive, accessible and fast, with the polish that makes them feel
            effortless to use.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-7 flex flex-wrap gap-3 sm:mt-10 sm:gap-4">
            <a
              href="#projects"
              className="rounded-full bg-white px-6 py-3 text-xs font-bold text-black transition-transform duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none sm:px-8 sm:py-4 sm:text-sm"
            >
              View My Work
            </a>
            {/* Opens the existing enquiry form rather than jumping to the footer. */}
            <button
              type="button"
              onClick={onHire}
              className="rounded-full border border-white/40 bg-white/5 px-6 py-3 text-xs font-bold text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none sm:px-8 sm:py-4 sm:text-sm"
            >
              Contact Me
            </button>
          </motion.div>
        </div>

        {/* Right: single play/pause toggle for the reel */}
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.7 },
            show: {
              opacity: 1,
              scale: 1,
              transition: { duration: 0.6, ease: [0.34, 1.56, 0.64, 1], delay: 0.5 },
            },
          }}
          className="order-first flex w-full flex-col items-end gap-2 self-end sm:gap-3 lg:order-none lg:w-auto lg:items-center lg:gap-4 lg:self-auto"
        >
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? 'Pause reel' : 'Play reel'}
            aria-pressed={playing}
            className="group flex size-14 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-lg transition-all duration-400 hover:scale-110 hover:border-brand hover:shadow-[0_0_50px_-6px] hover:shadow-brand focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none sm:size-16 lg:size-20"
          >
            {playing ? (
              <Pause className="size-5 transition-transform group-hover:scale-110 sm:size-6" />
            ) : (
              <Play className="ml-0.5 size-5 transition-transform group-hover:scale-110 sm:size-6" />
            )}
          </button>
          <span className="font-mono text-[11px] tracking-[0.3em] text-white/60 uppercase">
            {playing ? 'Pause' : 'Play Reel'}
          </span>
        </motion.div>
      </motion.div>

      {/* Scroll cue — desktop only, per spec */}
      <motion.a
        href="#about"
        aria-label="Scroll to About"
        className="absolute bottom-10 left-1/2 hidden -translate-x-1/2 text-white/50 transition-colors hover:text-white lg:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown size={30} />
      </motion.a>
    </section>
  )
}
