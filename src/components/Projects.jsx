import { motion } from 'motion/react'
import { ArrowUpRight } from 'lucide-react'

/* lucide v1 dropped brand logos, so this one mark is inlined. */
function GithubMark(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 1.8a10.2 10.2 0 0 0-3.2 19.9c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.4-3.4-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10.2 10.2 0 0 0 12 1.8Z" />
    </svg>
  )
}

/**
 * Edit this array to manage the showcase — nothing below it needs touching.
 * Swap `url` and `source` per card to point at real projects.
 *
 * `image` is optional: drop a file in `public/projects/` and set the path
 * (e.g. '/projects/dashboard.jpg'). Without one the card renders a tinted
 * placeholder built from `accent`, so the grid never shows a broken image.
 * Set `url` or `source` to null to hide that button on a card.
 */
const PROJECTS = [
  {
    name: 'TruBoard Partners',
    category: 'Corporate Website',
    description:
      'Marketing site for an asset-management firm — clean editorial layout, considered typography and a calm content hierarchy.',
    tech: ['React', 'TypeScript', 'Tailwind CSS'],
    image: null,
    accent: '#ff2a2a',
    url: 'https://truboardpartners.com/',
    source: 'https://truboardpartners.com/',
  },
  {
    name: 'TruBoard Platform',
    category: 'Web Application',
    description:
      'Dashboard interface with filterable data views, saved states and a layout that stays legible at high information density.',
    tech: ['React', 'JavaScript', 'Tailwind CSS'],
    image: null,
    accent: '#2a6bff',
    url: 'https://truboardpartners.com/',
    source: 'https://truboardpartners.com/',
  },
  {
    name: 'TruBoard Landing',
    category: 'Landing Page',
    description:
      'Focused conversion page built mobile-first, with scroll-driven reveals and a performance budget held from the start.',
    tech: ['React', 'Tailwind CSS', 'Motion'],
    image: null,
    accent: '#00a37a',
    url: 'https://truboardpartners.com/',
    source: 'https://truboardpartners.com/',
  },
]

function Thumbnail({ project }) {
  if (project.image) {
    return (
      <img
        src={project.image}
        alt={project.name}
        loading="lazy"
        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    )
  }

  // Placeholder: initials over a wash of the project's accent colour.
  const initials = project.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')

  return (
    <div
      className="flex size-full items-center justify-center transition-transform duration-500 group-hover:scale-105"
      style={{
        background: `radial-gradient(120% 120% at 25% 15%, ${project.accent}38, transparent 60%), #16161a`,
      }}
    >
      <span
        className="text-5xl font-black tracking-tighter"
        style={{ color: `${project.accent}cc` }}
      >
        {initials}
      </span>
    </div>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="relative bg-ink py-28 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl">
          <span className="inline-block rounded-full border border-white/15 bg-white/5 px-5 py-2 font-mono text-[11px] tracking-[0.2em] text-white/70 uppercase">
            Recent Work
          </span>

          <h2 className="mt-8 text-4xl leading-[1.05] font-black tracking-tighter sm:text-5xl">
            Projects I&apos;ve built
          </h2>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60">
            A selection of frontend work — interfaces, landing pages and design
            systems, each built to stay fast and easy to maintain.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, i) => (
            <motion.article
              key={project.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1.5 hover:border-white/25 hover:bg-white/[0.06]"
            >
              <div className="aspect-[16/10] overflow-hidden bg-neutral-900">
                <Thumbnail project={project} />
              </div>

              <div className="flex flex-1 flex-col p-6">
                <p className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
                  {project.category}
                </p>
                <h3 className="mt-1.5 text-lg font-bold tracking-tight">
                  {project.name}
                </h3>

                <p className="mt-2.5 text-sm leading-relaxed text-white/60">
                  {project.description}
                </p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] tracking-[0.1em] text-white/70 uppercase"
                    >
                      {t}
                    </li>
                  ))}
                </ul>

                {/* mt-auto keeps the buttons aligned across cards of unequal height */}
                <div className="mt-auto flex gap-3 pt-6">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-xs font-bold text-black transition-transform duration-300 hover:scale-[1.03]"
                    >
                      Live Demo
                      <ArrowUpRight size={14} />
                    </a>
                  )}
                  {project.source && (
                    <a
                      href={project.source}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${project.name} source code`}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-white/25 px-4 py-2.5 text-xs font-bold text-white transition-colors duration-300 hover:border-white/60 hover:bg-white/10"
                    >
                      <GithubMark className="size-3.5" />
                      Code
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
