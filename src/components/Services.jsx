import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  useVelocity,
  useSpring,
  wrap,
} from 'motion/react'

const ROWS = [
  {
    items: [
      'Responsive Websites',
      'React Development',
      'UI Engineering',
      'Landing Pages',
    ],
    baseVelocity: -3.2,
  },
  {
    items: [
      'Website Redesign',
      'Performance Tuning',
      'Interactive Experiences',
      'Design Systems',
    ],
    baseVelocity: 3.2,
  },
  {
    items: [
      'Cross-Browser Builds',
      'Accessibility',
      'Motion & Micro-interactions',
      'Component Libraries',
    ],
    baseVelocity: -2.4,
  },
]

/**
 * One marquee row.
 *
 * Runs continuously on its own, and scrolling adds to it: scroll velocity is
 * folded into the per-frame delta, so the row speeds up, and reverses, with the
 * page. Position is driven through a transform on a motion value, so nothing
 * here touches layout or triggers paint per frame.
 */
function MarqueeRow({ items, baseVelocity, reduceMotion }) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)

  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], {
    clamp: false,
  })

  // The strip below repeats its content 4x, so wrapping over a quarter of its
  // width makes the loop seamless whatever the text measures.
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`)

  const directionRef = useRef(1)

  useAnimationFrame((_, delta) => {
    if (reduceMotion) return

    let moveBy = directionRef.current * baseVelocity * (delta / 1000)

    // Scrolling one way pushes the row that way, and past zero it flips.
    const factor = velocityFactor.get()
    if (factor < 0) directionRef.current = -1
    else if (factor > 0) directionRef.current = 1

    moveBy += directionRef.current * moveBy * factor

    baseX.set(baseX.get() + moveBy)
  })

  const strip = (
    <span className="flex shrink-0 items-center">
      {items.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-5 sm:px-8">{item}</span>
          <span aria-hidden="true" className="text-brand">
            &bull;
          </span>
        </span>
      ))}
    </span>
  )

  return (
    <div className="flex flex-nowrap overflow-hidden">
      <motion.div
        style={reduceMotion ? undefined : { x }}
        className="flex flex-nowrap whitespace-nowrap will-change-transform"
      >
        {/* Four copies: one on screen, the rest feeding the wrap. */}
        {strip}
        {strip}
        {strip}
        {strip}
      </motion.div>
    </div>
  )
}

export default function Services() {
  const reduceMotion = useReducedMotion()

  return (
    <section
      id="services"
      className="relative overflow-x-clip border-y border-white/10 bg-ink py-20 text-white sm:py-28"
    >
      <div className="mx-auto mb-12 max-w-7xl px-5 sm:mb-16 sm:px-6 lg:px-10">
        <span className="inline-block rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-mono text-[10px] tracking-[0.2em] text-white/70 uppercase sm:px-5 sm:py-2 sm:text-[11px]">
          Services
        </span>

        <h2 className="mt-6 text-3xl leading-[1.05] font-black tracking-tighter sm:mt-8 sm:text-4xl lg:text-5xl">
          What I build
        </h2>

        <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/55 sm:mt-6 sm:text-base">
          Frontend work end to end — from turning a design into production markup
          to making an existing site faster and easier to use.
        </p>
      </div>

      <div
        className="flex flex-col gap-2 text-4xl font-black tracking-tighter sm:gap-3 sm:text-6xl lg:text-7xl"
        aria-label="Services offered"
      >
        {ROWS.map((row, i) => (
          <div
            key={row.baseVelocity}
            // Alternate rows sit hollow, echoing the hero's outlined headline.
            className={i % 2 === 1 ? 'text-white/25' : 'text-white/85'}
          >
            <MarqueeRow {...row} reduceMotion={reduceMotion} />
          </div>
        ))}
      </div>
    </section>
  )
}
