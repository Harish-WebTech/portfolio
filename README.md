# Harish Sai — Portfolio

React 19 + Vite + Tailwind CSS v4 + Motion.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Sections

| Component | Notes |
|---|---|
| `Preloader` | Logotype fills upward via `clip-path`, then the red panel lifts away as a shutter. |
| `Navbar` | Transparent → blurred on scroll; red slide-down panel on mobile. |
| `Hero` | Fullscreen video. Starts after the preloader finishes and the file is buffered; plays once with sound, then holds its final frame. |
| `About` | Hanging ID badge, six-skill grid (`SkillIcons.jsx`), torn-paper divider. |
| `Services` | Eight frontend services, lucide icons, 4-up grid. |
| `Projects` | Showcase cards. Edit the `PROJECTS` array at the top of the file. |
| `ScrollProgress` | Spring-driven reading bar; custom scrollbar lives in `index.css`. |
| `Process` | Curved SVG path drawn on scroll; each tag card turns red as the line passes it. |
| `Footer` | Oversized signature with parallax lift. |
| `OutlineText` | Hollow display text — see note below. |

## Assets

`public/hero.mp4` and `public/profile.jpg` are in place.

Still optional: **`hero-poster.jpg`** — the still shown while the video buffers.
The `poster` attribute is currently removed from `Hero.jsx` because the file does
not exist (it was logging a 404). Generate it, then add `poster="/hero-poster.jpg"`
back to the `<video>`.
Extract it from the video's first frame so there is no jump when playback starts
(needs ffmpeg: `winget install Gyan.FFmpeg`):

```bash
ffmpeg -i public/hero.mp4 -frames:v 1 -q:v 2 public/hero-poster.jpg
```

## Hero playback

Playback is driven from an effect, not the `autoPlay` attribute — with `autoPlay`
the reel would run behind the preloader and be half over before anyone saw it. It
starts once `App` reports the preloader is done *and* `canplaythrough` fires.

Audio is on by default (`volume = 1`, unmuted). Browsers may still refuse
sound-on playback for a visitor with no prior engagement, so if `play()` rejects
the component retries muted — the reel always runs — and lifts the mute on the
first scroll, click, key or tap. No `loop`: it plays once and holds its final
frame until the next page load.

`App` also sets `history.scrollRestoration = 'manual'` and locks body scroll while
the preloader is up, so a refresh always lands on the hero rather than restoring
the previous scroll position.

## Note on `OutlineText`

The hollow "Frontend Developer" headline does **not** use `-webkit-text-stroke`.
Chrome strokes each glyph contour separately, so fonts whose letters are built from
overlapping contours — Inter's `e` and `D` among many others — render stray internal
lines that read as a strikethrough. This was reproduced across Inter, Archivo,
Montserrat, Manrope, Figtree and system Arial, and in SVG `stroke` too, so it is the
stroking implementation rather than the typeface.

`OutlineText` instead masks a fattened copy of the text with the plain copy knocked
out of it. That outlines the *union* of the contours and stays genuinely transparent
inside, so the background shows through.
