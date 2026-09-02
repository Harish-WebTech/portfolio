import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'

const SERVICES = [
  'Web Applications',
  'Personal & Business Websites',
  'UI/UX Design',
  'Responsive Frontend Development',
  'Landing Pages',
]

const label = 'font-mono text-[10px] uppercase tracking-[0.28em] text-white/50'
const underline =
  'relative inline-block after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-100 after:bg-current after:transition-transform after:duration-400 hover:after:origin-left'

export default function Footer() {
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end end'],
  })

  // Gentle parallax lift on the oversized signature.
  const y = useTransform(scrollYProgress, [0, 1], [60, -20])

  return (
    <footer
      id="footer"
      ref={ref}
      className="relative min-h-[50vh] overflow-hidden bg-ink pt-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Top information grid */}
        <div className="grid gap-12 border-b border-white/10 pb-16 md:grid-cols-3">
          <div>
            <p className={label}>Services</p>
            <ul className="mt-5 space-y-2.5">
              {SERVICES.map((service) => (
                <li key={service} className={`${label} !text-white/80`}>
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:text-center">
            <p className={label}>Experience</p>
            <p className="mt-5 text-2xl font-bold tracking-tight text-[#f4f4f4]">
              7+ Years
            </p>
            <a
              href="#projects"
              className={`mt-3 inline-block text-sm text-white/70 transition-colors hover:text-white ${underline}`}
            >
              View Work
            </a>
          </div>

          <div className="md:text-right">
            <p className={label}>Availability</p>
            <p className="mt-5 text-2xl font-bold tracking-tight text-[#f4f4f4]">
              Available Worldwide
            </p>
            <p className={`mt-3 ${label}`}>{new Date().getFullYear()}</p>
          </div>
        </div>

        {/* Oversized signature */}
        <motion.div style={{ y }} className="py-14">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
            className="cursor-default text-center text-[17vw] leading-[0.8] font-black tracking-tighter text-[#d4d4d4] lowercase transition-colors duration-500 hover:text-white"
          >
            harish sai
          </motion.h2>
        </motion.div>

        {/* Bottom row. No address shown here — the Hire Me form is the way in. */}
        <div className="flex flex-col gap-3 border-t border-white/10 py-9 md:flex-row md:items-center md:justify-between">
          <p className={label}>© {new Date().getFullYear()} Harish Sai</p>
          <span className={label}>Created by Harish</span>
        </div>
      </div>
    </footer>
  )
}
