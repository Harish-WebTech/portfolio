import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'

const CURVE = 'M600 40C300 240 900 440 600 720 300 1000 900 1180 600 1440'

const STEPS = [
  {
    no: '01',
    title: 'Define',
    body: 'We map the goal, the audience and the constraints before a single pixel is drawn.',
    side: 'right',
    top: '2%',
    rotate: 3,
  },
  {
    no: '02',
    title: 'Design',
    body: 'Wireframes become a design system — type, colour and spacing that hold together.',
    side: 'left',
    top: '27%',
    rotate: -3,
  },
  {
    no: '03',
    title: 'Build',
    body: 'Clean, accessible, component-driven React with performance budgeted from day one.',
    side: 'right',
    top: '52%',
    rotate: 2.5,
  },
  {
    no: '04',
    title: 'Launch',
    body: 'Ship, measure, iterate. Analytics and feedback loops guide what happens next.',
    side: 'left',
    top: '77%',
    rotate: -2.5,
  },
]

/* Each card lights up once the drawn line has travelled past it. */
const THRESHOLDS = [0.1, 0.35, 0.6, 0.85]

function TagCard({ step, active }) {
  return (
    <motion.article
      initial={{ opacity: 0, x: step.side === 'right' ? 60 : -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ scale: 1.04, rotate: 0 }}
      style={{ rotate: step.rotate }}
      className={`w-full max-w-sm rounded-[2rem] border p-8 shadow-xl transition-colors duration-500 lg:w-[21rem] ${
        active
          ? 'border-transparent bg-brand text-white shadow-[0_25px_60px_-12px] shadow-brand/60'
          : 'border-neutral-200 bg-white text-ink'
      }`}
    >
      {/* Hole punch */}
      <div
        className={`mx-auto mb-6 h-2.5 w-14 rounded-full transition-colors duration-500 ${
          active ? 'bg-black/25' : 'bg-neutral-200'
        }`}
      />

      <span
        className={`font-serif text-4xl italic transition-colors duration-500 ${
          active ? 'text-white/60' : 'text-neutral-300'
        }`}
      >
        {step.no}
      </span>

      <h3 className="mt-3 text-2xl font-bold tracking-tight">{step.title}</h3>

      <p
        className={`mt-3 text-sm leading-relaxed transition-colors duration-500 ${
          active ? 'text-white/85' : 'text-neutral-500'
        }`}
      >
        {step.body}
      </p>
    </motion.article>
  )
}

export default function Process() {
  const trackRef = useRef(null)
  const [activeCount, setActiveCount] = useState(0)

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 0.85', 'end 0.6'],
  })

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1])

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActiveCount(THRESHOLDS.filter((t) => v >= t).length)
  })

  return (
    // overflow-x-clip contains the cards' ±60px entrance offset, which would
    // otherwise push the page sideways on mobile before they animate in.
    // `clip` rather than `hidden` so no scroll container is created here.
    <section id="process" className="relative overflow-x-clip bg-white text-ink">
      <div className="absolute inset-0 grid-paper" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-6 pt-28 lg:px-10">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full border border-neutral-200 bg-white px-5 py-2 font-mono text-[11px] tracking-[0.2em] text-neutral-600 uppercase shadow-sm">
            How we work
          </span>

          <div className="relative mt-8">
            <h2 className="text-4xl leading-[1.05] font-black tracking-tighter sm:text-5xl lg:text-6xl">
              Let us show you how we drive your brand to new heights
            </h2>

            {/* Hand-drawn sketch arrow */}
            <svg
              className="absolute -right-16 -bottom-10 hidden w-28 text-neutral-400 xl:block"
              viewBox="0 0 120 80"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 8c30 6 62 22 84 46"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M74 56l16 2 2-16"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-neutral-500">
            A workflow built on clarity. Every project moves through the same four
            stages, so you always know what is happening and what comes next.
          </p>
        </div>

        {/* Timeline track. On desktop the cards are absolutely placed either side
            of the curve; on mobile they stack down a straight dashed centre line. */}
        <div ref={trackRef} className="relative mt-24 lg:mt-32 lg:h-[1500px]">
          <svg
            className="absolute inset-0 hidden size-full lg:block"
            viewBox="0 0 1200 1500"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Dashed guide showing the whole route */}
            <path
              d={CURVE}
              stroke="#dcdcdc"
              strokeWidth="3"
              strokeDasharray="12 14"
            />
            {/* Progress line. pathLength drives strokeDasharray internally, so this
                one stays solid — it reads as the route being travelled. */}
            <motion.path
              d={CURVE}
              stroke="#111111"
              strokeWidth="3"
              strokeLinecap="round"
              style={{ pathLength }}
            />
          </svg>

          {/* Mobile centre line */}
          <div
            className="absolute inset-y-0 left-1/2 w-0 -translate-x-1/2 border-l-2 border-dashed border-neutral-300 lg:hidden"
            aria-hidden="true"
          />

          <div className="flex flex-col items-center gap-14 lg:block lg:gap-0">
            {STEPS.map((step, i) => (
              <div
                key={step.no}
                className={`flex w-full justify-center lg:absolute lg:w-auto ${
                  step.side === 'right' ? 'lg:left-[54%]' : 'lg:right-[54%]'
                }`}
                style={{ top: step.top }}
              >
                <TagCard step={step} active={i < activeCount} />
              </div>
            ))}
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="pt-20 pb-28 text-center font-serif text-3xl italic -rotate-2 text-neutral-700"
        >
          Ready to be delivered!
        </motion.p>
      </div>
    </section>
  )
}
