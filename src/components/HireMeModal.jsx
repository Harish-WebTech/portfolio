import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X, Check, Loader2, AlertCircle } from 'lucide-react'
import BudgetSelect from './BudgetSelect.jsx'

/**
 * Where inquiries are delivered — the same address shown in the footer.
 *
 * Submission goes through FormSubmit's AJAX endpoint, which needs no account
 * and no API key. Note that the FIRST inquiry triggers a confirmation email to
 * CONTACT_EMAIL that must be clicked once before anything is forwarded.
 * To switch providers (Formspree, EmailJS, your own function), only ENDPOINT
 * and the request body below need to change.
 */
const CONTACT_EMAIL = 'harishsai01@gmail.com'
const ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`

const PROJECT_TYPES = [
  'Landing Page',
  'Full Website',
  'Web Application',
  'Website Redesign',
  'UI Development',
  'Something Else',
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Please tell me your name.'
  if (!values.email.trim()) errors.email = 'An email address is required.'
  else if (!EMAIL_RE.test(values.email.trim()))
    errors.email = 'That does not look like a valid email address.'
  if (!values.projectType) errors.projectType = 'Pick the closest option.'
  if (!values.message.trim()) errors.message = 'A short brief helps me reply properly.'
  else if (values.message.trim().length < 20)
    errors.message = 'A little more detail, please — at least 20 characters.'
  return errors
}

const EMPTY = {
  name: '',
  email: '',
  company: '',
  projectType: '',
  budget: '',
  message: '',
}

const fieldBase =
  'w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 transition-all duration-200 focus:border-brand focus:bg-white/[0.06] focus:ring-2 focus:ring-brand/30 focus:outline-none'

function Field({ id, label, error, children, className = '' }) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-2 block font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase"
      >
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-brand">
          {error}
        </p>
      )}
    </div>
  )
}

export default function HireMeModal({ open, onClose }) {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const dialogRef = useRef(null)
  const firstFieldRef = useRef(null)
  const restoreFocusRef = useRef(null)

  // Escape to close, and keep Tab cycling inside the dialog while it is open.
  useEffect(() => {
    if (!open) return

    restoreFocusRef.current = document.activeElement
    const timer = setTimeout(() => firstFieldRef.current?.focus(), 120)

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab') return

      const focusables = dialogRef.current?.querySelectorAll(
        'button, input, select, textarea, a[href]',
      )
      if (!focusables?.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('keydown', onKeyDown)
      restoreFocusRef.current?.focus?.()
    }
  }, [open, onClose])

  // Freeze the page behind the dialog without letting the scrollbar vanish and
  // shift the layout underneath it.
  useEffect(() => {
    if (!open) return
    const gap = window.innerWidth - document.documentElement.clientWidth
    const { overflow, paddingRight } = document.body.style
    document.body.style.overflow = 'hidden'
    if (gap > 0) document.body.style.paddingRight = `${gap}px`
    return () => {
      document.body.style.overflow = overflow
      document.body.style.paddingRight = paddingRight
    }
  }, [open])

  const update = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      // Move focus to the first problem so keyboard users are not stranded.
      dialogRef.current?.querySelector(`[name="${Object.keys(found)[0]}"]`)?.focus()
      return
    }

    setStatus('sending')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          company: values.company || 'Not given',
          projectType: values.projectType,
          budget: values.budget || 'Not specified',
          message: values.message,
          _subject: `New project inquiry from ${values.name}`,
        }),
      })
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      setStatus('success')
      setValues(EMPTY)
    } catch {
      setStatus('error')
    }
  }

  const close = () => {
    onClose()
    // Reset only after the exit animation, so the panel does not flicker.
    setTimeout(() => {
      setStatus('idle')
      setErrors({})
    }, 400)
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="hire-title"
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/12 bg-[#141416] p-6 shadow-2xl sm:p-9"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute top-5 right-5 flex size-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-white/40 hover:text-white focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
            >
              <X size={16} />
            </button>

            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center py-14 text-center"
              >
                <span className="flex size-16 items-center justify-center rounded-full bg-brand/15 text-brand">
                  <Check size={30} />
                </span>
                <h2 className="mt-6 text-2xl font-black tracking-tight text-white">
                  Inquiry sent
                </h2>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">
                  Thanks for reaching out — I&apos;ll get back to you at the address
                  you provided, usually within a day or two.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-8 rounded-full bg-white px-7 py-3 text-sm font-bold text-black transition-transform duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
                >
                  Close
                </button>
              </motion.div>
            ) : (
              <>
                <p className="font-mono text-[10px] tracking-[0.28em] text-brand uppercase">
                  Let&apos;s work together
                </p>
                <h2
                  id="hire-title"
                  className="mt-3 text-3xl font-black tracking-tighter text-white sm:text-4xl"
                >
                  Tell me about your project
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/55">
                  Fill this in and it lands in my inbox at{' '}
                  <span className="text-white/80">{CONTACT_EMAIL}</span>.
                </p>

                <form onSubmit={handleSubmit} noValidate className="mt-8 grid gap-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="name" label="Name *" error={errors.name}>
                      <input
                        ref={firstFieldRef}
                        id="name"
                        name="name"
                        type="text"
                        value={values.name}
                        onChange={update('name')}
                        placeholder="Your name"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                        className={`${fieldBase} ${errors.name ? 'border-brand' : 'border-white/12'}`}
                      />
                    </Field>

                    <Field id="email" label="Email *" error={errors.email}>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={update('email')}
                        placeholder="you@company.com"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        className={`${fieldBase} ${errors.email ? 'border-brand' : 'border-white/12'}`}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="company" label="Company / Brand">
                      <input
                        id="company"
                        name="company"
                        type="text"
                        value={values.company}
                        onChange={update('company')}
                        placeholder="Optional"
                        className={`${fieldBase} border-white/12`}
                      />
                    </Field>

                    <Field id="budget" label="Budget Range">
                      <BudgetSelect
                        value={values.budget}
                        onChange={(budget) => setValues((v) => ({ ...v, budget }))}
                      />
                    </Field>
                  </div>

                  <Field
                    id="projectType"
                    label="What do you need help with? *"
                    error={errors.projectType}
                  >
                    <select
                      id="projectType"
                      name="projectType"
                      value={values.projectType}
                      onChange={update('projectType')}
                      aria-invalid={!!errors.projectType}
                      aria-describedby={
                        errors.projectType ? 'projectType-error' : undefined
                      }
                      className={`${fieldBase} ${errors.projectType ? 'border-brand' : 'border-white/12'}`}
                    >
                      <option value="">Choose one</option>
                      {PROJECT_TYPES.map((t) => (
                        <option key={t} value={t} className="bg-[#141416]">
                          {t}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field id="message" label="Project Details *" error={errors.message}>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={values.message}
                      onChange={update('message')}
                      placeholder="Goals, timeline, anything that helps me understand the work."
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                      className={`${fieldBase} resize-none ${errors.message ? 'border-brand' : 'border-white/12'}`}
                    />
                  </Field>

                  {status === 'error' && (
                    <motion.p
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      role="alert"
                      className="flex items-start gap-2 rounded-xl border border-brand/40 bg-brand/10 px-4 py-3 text-xs text-white/85"
                    >
                      <AlertCircle size={15} className="mt-px shrink-0 text-brand" />
                      <span>
                        That did not go through. Please try again, or email me
                        directly at{' '}
                        <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
                          {CONTACT_EMAIL}
                        </a>
                        .
                      </span>
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="mt-1 flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition-transform duration-300 hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-[#141416] focus-visible:outline-none disabled:scale-100 disabled:opacity-60"
                  >
                    {status === 'sending' ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>Let&apos;s Work Together</>
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
