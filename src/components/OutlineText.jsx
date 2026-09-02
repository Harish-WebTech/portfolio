import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'

const FONT_SIZE = 100
const PAD = 8

/**
 * Outlined ("hollow") display text.
 *
 * Chrome's -webkit-text-stroke strokes each glyph contour separately, so fonts
 * whose letters are built from overlapping contours (Inter's `e` and `D`, among
 * many others) render stray internal lines that look like a strikethrough. This
 * draws the outline as a mask instead — a fattened copy of the text with the
 * plain copy knocked out of it — which outlines the union of the contours and
 * stays genuinely transparent inside, so the background shows through.
 *
 * The SVG carries an intrinsic aspect ratio from its measured viewBox, so it
 * scales fluidly with its container.
 */
export default function OutlineText({
  children,
  className = '',
  color = '#ffffff',
  weight = 900,
  tracking = '-0.02em',
  thickness = 4,
}) {
  const maskId = useId()
  const textRef = useRef(null)
  const [box, setBox] = useState(null)

  const fontStyle = {
    font: `${weight} ${FONT_SIZE}px Inter, ui-sans-serif, system-ui, sans-serif`,
    letterSpacing: tracking,
  }

  useLayoutEffect(() => {
    const measure = () => {
      const node = textRef.current
      if (!node) return
      const b = node.getBBox()
      if (b.width > 0) {
        setBox({ x: b.x, y: b.y, w: b.width, h: b.height })
      }
    }
    measure()
    // Web fonts land after first paint; re-measure once they do.
    document.fonts?.ready.then(measure).catch(() => {})
  }, [children, weight, tracking])

  // Re-measure on resize so the box stays correct if the font swaps late.
  useEffect(() => {
    const onResize = () => {
      const node = textRef.current
      if (!node) return
      const b = node.getBBox()
      if (b.width > 0) setBox({ x: b.x, y: b.y, w: b.width, h: b.height })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const viewBox = box
    ? `${box.x - PAD} ${box.y - PAD} ${box.w + PAD * 2} ${box.h + PAD * 2}`
    : `0 0 1000 ${FONT_SIZE * 1.3}`

  return (
    <svg
      className={`block w-full ${className}`}
      viewBox={viewBox}
      role="img"
      aria-label={children}
      style={{ visibility: box ? 'visible' : 'hidden' }}
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="-9999" y="-9999" width="19999" height="19999">
          <rect x="-9999" y="-9999" width="19999" height="19999" fill="black" />
          {/* Fattened copy — the outer edge of the outline. */}
          <text
            x="0"
            y={FONT_SIZE}
            fill="white"
            stroke="white"
            strokeWidth={thickness * 2}
            strokeLinejoin="round"
            style={fontStyle}
          >
            {children}
          </text>
          {/* Plain copy knocked back out — leaves only the ring. */}
          <text x="0" y={FONT_SIZE} fill="black" style={fontStyle}>
            {children}
          </text>
        </mask>
      </defs>

      {/* Hidden probe used purely for measuring the text box. */}
      <text
        ref={textRef}
        x="0"
        y={FONT_SIZE}
        fill="none"
        stroke="none"
        style={fontStyle}
        aria-hidden="true"
      >
        {children}
      </text>

      <rect
        x="-9999"
        y="-9999"
        width="19999"
        height="19999"
        fill={color}
        style={{ mask: `url(#${maskId})` }}
      />
    </svg>
  )
}
