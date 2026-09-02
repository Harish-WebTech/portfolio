import { useState } from 'react'
import { motion } from 'motion/react'
import { SKILLS, ReactMark, JsMark, TailwindMark } from './SkillIcons.jsx'

/* Chips that float around the mobile portrait, echoing the reference layout. */
const CHIPS = [
  { Mark: ReactMark, style: { top: '4%', right: '2%' }, delay: 0 },
  { Mark: JsMark, style: { top: '44%', left: '-3%' }, delay: 0.7 },
  { Mark: TailwindMark, style: { bottom: '6%', right: '8%' }, delay: 1.3 },
]


/* Decorative four-point stars scattered behind the content. */
const STARS = [
  { top: '8%', left: '6%', size: 34, delay: 0 },
  { top: '22%', right: '10%', size: 22, delay: 0.6 },
  { bottom: '30%', left: '46%', size: 18, delay: 1.2 },
  { top: '58%', right: '5%', size: 28, delay: 0.3 },
  { bottom: '18%', left: '14%', size: 20, delay: 0.9 },
]

function Star({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c.6 6.3 5.1 10.8 12 12-6.9 1.2-11.4 5.7-12 12-.6-6.3-5.1-10.8-12-12C6.9 10.8 11.4 6.3 12 0Z" />
    </svg>
  )
}

export default function About() {
  const [photoFailed, setPhotoFailed] = useState(false)

  return (
    <section id="about" className="relative overflow-hidden bg-brand pt-28 pb-44">
      {/* Floating star decorations */}
      {STARS.map((star, i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          className="pointer-events-none absolute text-black/25"
          style={{
            top: star.top,
            left: star.left,
            right: star.right,
            bottom: star.bottom,
          }}
          animate={{ scale: [1, 1.25, 1], opacity: [0.45, 0.9, 0.45] }}
          transition={{
            duration: 3.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: star.delay,
          }}
        >
          <Star size={star.size} />
        </motion.div>
      ))}

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 sm:gap-20 lg:grid-cols-2 lg:px-10">
        {/* Left, on mobile: circular portrait with a gradient ring and floating
            skill chips. The hanging badge is beautiful at desktop widths but
            gets tall and cramped on a phone, so small screens get this instead. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="relative mx-auto w-full max-w-[19rem] lg:hidden"
        >
          <div className="relative aspect-square w-full">
            {/* Ring: a near-complete arc, rotating slowly. */}
            <motion.svg
              viewBox="0 0 200 200"
              className="absolute inset-0 size-full"
              aria-hidden="true"
              animate={{ rotate: 360 }}
              transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
            >
              <defs>
                <linearGradient id="aboutRing" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="55%" stopColor="#ffffff" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#111111" />
                </linearGradient>
              </defs>
              <circle
                cx="100"
                cy="100"
                r="94"
                fill="none"
                stroke="url(#aboutRing)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="520 70"
              />
            </motion.svg>

            {/* Portrait */}
            <div className="absolute inset-[9%] overflow-hidden rounded-full bg-neutral-800 shadow-[0_24px_50px_-18px_rgba(0,0,0,0.7)]">
              {photoFailed ? (
                <div className="flex size-full items-center justify-center text-5xl font-black tracking-tight text-neutral-500">
                  HS
                </div>
              ) : (
                <img
                  src="/portfolio/profile.jpg"
                  alt="Harish Sai"
                  onError={() => setPhotoFailed(true)}
                  className="size-full object-cover"
                />
              )}
            </div>

            {/* Floating skill chips around the ring */}
            {CHIPS.map(({ Mark, style, delay }, i) => (
              <motion.span
                key={i}
                aria-hidden="true"
                className="absolute flex size-12 items-center justify-center rounded-2xl bg-white text-ink shadow-[0_10px_24px_-10px_rgba(0,0,0,0.65)]"
                style={style}
                animate={{ y: [0, -7, 0] }}
                transition={{
                  duration: 3.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay,
                }}
              >
                <Mark className="size-6" />
              </motion.span>
            ))}
          </div>

          <div className="mt-7 text-center">
            <p className="text-2xl font-extrabold tracking-tight text-black">
              Harish Sai
            </p>
            <p className="mt-1.5 font-mono text-[10px] tracking-[0.28em] text-white/85 uppercase">
              Frontend Developer
            </p>
          </div>
        </motion.div>

        {/* Left, on desktop: hanging ID badge */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="hidden flex-col items-center lg:flex"
        >
          {/* Lanyard: two straps meeting at the clip */}
          <svg width="150" height="104" viewBox="0 0 150 104" aria-hidden="true">
            <path d="M8 0l58 92h-13L0 4z" fill="#0a0a0a" />
            <path d="M142 0L84 92h13L150 4z" fill="#0a0a0a" />
          </svg>
          {/* Metal clip */}
          <div className="-mt-2 h-5 w-16 rounded-sm border border-neutral-500 bg-gradient-to-b from-neutral-200 via-neutral-400 to-neutral-600 shadow-md" />
          <div className="h-4 w-2 bg-neutral-500" />

          <motion.div
            whileHover={{ rotate: 0, scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="w-72 -rotate-3 rounded-3xl bg-neutral-800 p-5 shadow-[0_35px_70px_-15px_rgba(0,0,0,0.55)] sm:w-80"
          >
            {/* Punch hole */}
            <div className="mx-auto mb-5 h-2.5 w-16 rounded-full bg-black/60" />

            {photoFailed ? (
              // Stand-in until public/profile.jpg is supplied.
              <div className="flex aspect-[4/5] w-full items-center justify-center rounded-2xl bg-neutral-700 text-5xl font-black tracking-tight text-neutral-500">
                HS
              </div>
            ) : (
              <img
                src="/portfolio/profile.jpg"
                alt="Harish Sai"
                onError={() => setPhotoFailed(true)}
                className="aspect-[4/5] w-full rounded-2xl bg-neutral-700 object-cover"
              />
            )}

            <div className="mt-5 text-center">
              <p className="text-xl font-extrabold tracking-tight text-white">
                Harish Sai
              </p>
              <p className="mt-1 font-mono text-[10px] tracking-[0.28em] text-brand uppercase">
                Frontend Developer
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right: introduction */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <h2 className="text-6xl font-black tracking-tighter text-black sm:text-7xl">
            Hello!
          </h2>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-white">
            I&apos;m <span className="font-black text-black uppercase">Harish Sai</span>,
            a frontend developer who turns ideas into real products. My journey started
            with curiosity and grew into a passion for building clean, responsive,
            user-friendly applications.
          </p>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-red-100">
            I care about the details that make an interface feel right — accessible markup,
            considered motion, and layouts that hold up on every screen size. Always
            sharpening how I build and how I solve problems.
          </p>

          {/* Skills. Six marks in a grid rather than a row, so nothing crowds
              on narrow screens. Entrance is staggered once, then still — six
              perpetually bobbing icons would pull focus off the copy. */}
          <p className="mt-12 font-mono text-[10px] tracking-[0.28em] text-black/60 uppercase">
            What I work with
          </p>

          <ul className="mt-5 mb-10 grid max-w-xl grid-cols-3 gap-3 sm:mb-14 sm:grid-cols-6 sm:gap-4">
            {SKILLS.map(({ name, Mark }, i) => (
              <motion.li
                key={name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                whileHover={{ y: -6 }}
                className="group flex flex-col items-center gap-2 rounded-2xl bg-black/10 px-2 py-4 text-black/75 transition-colors duration-300 hover:bg-black/20 hover:text-black"
                title={name}
              >
                <Mark className="size-8 sm:size-9" />
                <span className="text-center font-mono text-[9px] leading-tight tracking-[0.12em] uppercase">
                  {name}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Torn-paper divider into the next (white) section */}
      <svg
        className="absolute inset-x-0 bottom-0 w-full"
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          fill="#ffffff"
          d="M0 45.5 L26.6 33.3 L52.4 37.7 L98.5 28.3 L143.6 32.7 L171.5 37.5 L214.2 41.9 L250.3 58.7 L284.0 34.3 L317.2 56.6 L347.9 36.6 L385.5 31.7 L432.6 47.1 L475.9 47.7 L498.4 53.0 L544.5 49.0 L577.7 50.6 L623.6 52.6 L670.9 45.1 L709.7 39.4 L748.8 53.6 L778.0 28.5 L809.0 56.4 L850.4 43.5 L874.7 28.4 L900.9 37.4 L945.7 50.9 L992.6 52.8 L1018.3 31.4 L1047.3 60.8 L1073.6 54.0 L1098.9 40.5 L1143.5 40.9 L1169.8 41.3 L1214.6 53.5 L1255.6 54.1 L1301.0 35.2 L1342.2 57.0 L1389.4 37.8 L1425.1 41.4 L1440.0 37.7 L1440 90 L0 90 Z"
        />
      </svg>
    </section>
  )
}
