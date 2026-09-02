import { motion, useScroll, useSpring } from 'motion/react'

/**
 * Thin reading-progress bar pinned to the top of the viewport.
 *
 * Driven by a spring on the scroll progress value, which animates a transform
 * only — no layout or paint work per frame, so it stays smooth on mobile.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 36,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[9500] h-[3px] origin-left bg-brand"
    />
  )
}
