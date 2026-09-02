import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

const WORD = 'HARISH SAI'
const CHARS = WORD.split('')

// Phase timings, in seconds.
const ENTER = 0.55
const ENTER_STAGGER = 0.04
const HOLD = 0.4
const EXIT = 0.45
const EXIT_STAGGER = 0.025

const enterDone = ENTER + ENTER_STAGGER * CHARS.length
const exitDone = EXIT + EXIT_STAGGER * CHARS.length

const EASE = [0.65, 0, 0.35, 1]

/**
 * Opening cover.
 *
 * The logotype rises into place letter by letter, holds, then leaves the same
 * way before the red panel lifts away as a shutter. Each letter sits in an
 * overflow-hidden box and only its inner span moves, so the reveal is a genuine
 * mask rather than a fade — and it animates transform only.
 */
export default function Preloader({ onComplete }) {
  const [phase, setPhase] = useState('in') // 'in' | 'out'
  const [visible, setVisible] = useState(true)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion) {
      const t = setTimeout(() => setVisible(false), 500)
      return () => clearTimeout(t)
    }

    const toOut = setTimeout(() => setPhase('out'), (enterDone + HOLD) * 1000)
    const toGone = setTimeout(
      () => setVisible(false),
      (enterDone + HOLD + exitDone) * 1000,
    )
    return () => {
      clearTimeout(toOut)
      clearTimeout(toGone)
    }
  }, [reduceMotion])

  const letter = {
    in: (i) => ({
      y: '0%',
      transition: { duration: ENTER, ease: EASE, delay: i * ENTER_STAGGER },
    }),
    out: (i) => ({
      y: '-115%',
      transition: { duration: EXIT, ease: EASE, delay: i * EXIT_STAGGER },
    }),
  }

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-brand"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        >
          <div className="flex select-none items-end">
            {CHARS.map((char, i) => (
              <span
                key={`${char}-${i}`}
                // The mask each letter rises through.
                className="block overflow-hidden"
              >
                <motion.span
                  custom={i}
                  variants={letter}
                  initial={reduceMotion ? { y: '0%' } : { y: '115%' }}
                  animate={reduceMotion ? 'in' : phase}
                  className="block text-[15vw] leading-[0.9] tracking-[0.01em] text-white md:text-[11vw]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {char === ' ' ? ' ' : char}
                </motion.span>
              </span>
            ))}
          </div>

          {/* Thin rule that draws under the word, then retracts with it. */}
          <motion.span
            className="mt-5 block h-px bg-black/35"
            initial={{ width: 0 }}
            animate={{ width: phase === 'in' ? '42vw' : 0 }}
            transition={{
              duration: phase === 'in' ? enterDone : EXIT,
              ease: EASE,
              delay: phase === 'in' ? 0.15 : 0,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
