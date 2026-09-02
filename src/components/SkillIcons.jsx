/**
 * Inline brand marks for the skills grid.
 *
 * Drawn by hand rather than pulled from an icon package — lucide carries no
 * brand logos, and a dependency just for six glyphs isn't worth the weight.
 * Every mark inherits `currentColor` so the grid stays monochrome against the
 * red panel; the real brand colours would fight that background.
 */

const shield = 'M4 2h16l-1.5 17.2L12 22l-6.5-2.8L4 2z'

export function Html5Mark(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d={shield} stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path
        d="M9.6 8.2 7.6 10.4l2 2.2M14.4 8.2l2 2.2-2 2.2M13 7.2l-2 9.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Css3Mark(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d={shield} stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path
        d="M16 8H9.8a1.8 1.8 0 0 0 0 3.6h4.4a1.8 1.8 0 0 1 0 3.6H8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function JsMark(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="3.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M10.4 8.6v5.7a1.9 1.9 0 0 1-3.5.9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M17.5 9.4a2.3 2.3 0 0 0-3.6.4c-.5 1.2.6 2 1.8 2.4s2.3 1.2 1.8 2.4a2.3 2.3 0 0 1-3.7.3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function TsMark(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="3.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M6.4 9.6h5M8.9 9.6v6.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M17.8 10.3a2.2 2.2 0 0 0-3.5.4c-.5 1.1.6 1.9 1.7 2.3s2.2 1.1 1.7 2.3a2.2 2.2 0 0 1-3.6.3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function ReactMark(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="2.1" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.3">
        <ellipse cx="12" cy="12" rx="10.5" ry="4.2" />
        <ellipse cx="12" cy="12" rx="10.5" ry="4.2" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10.5" ry="4.2" transform="rotate(120 12 12)" />
      </g>
    </svg>
  )
}

export function TailwindMark(props) {
  // Two stacked waves, echoing the Tailwind mark.
  const wave =
    'M6 0c-2.7 0-4.3 1.3-5 4 1-1.3 2.2-1.8 3.5-1.5.8.2 1.3.8 2 1.4C7.7 5 9 6.2 11.7 6.2c2.7 0 4.3-1.3 5-4-1 1.3-2.2 1.8-3.5 1.5-.8-.2-1.3-.8-2-1.4C10 1.2 8.7 0 6 0z'
  return (
    <svg viewBox="0 0 24 16" fill="currentColor" {...props}>
      <g transform="translate(0.5 1)">
        <path d={wave} />
        <path d={wave} transform="translate(6 6.4)" />
      </g>
    </svg>
  )
}

export const SKILLS = [
  { name: 'HTML5', Mark: Html5Mark },
  { name: 'CSS3', Mark: Css3Mark },
  { name: 'JavaScript', Mark: JsMark },
  { name: 'React', Mark: ReactMark },
  { name: 'Tailwind CSS', Mark: TailwindMark },
  { name: 'TypeScript', Mark: TsMark },
]
