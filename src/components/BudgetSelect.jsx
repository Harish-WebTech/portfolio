import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, ChevronDown } from 'lucide-react'

/** Indian numbering (lakh grouping), starting at ₹5,000. */
export const BUDGET_OPTIONS = [
  '₹5,000 – ₹10,000',
  '₹10,000 – ₹25,000',
  '₹25,000 – ₹50,000',
  '₹50,000 – ₹1,00,000',
  '₹1,00,000+',
  'Not sure yet',
]

const PLACEHOLDER = 'Select a range'

/**
 * Accessible listbox used for the budget field.
 *
 * A native <select> can't be styled to match the rest of the form, so this is a
 * button + listbox pair with full keyboard support. Escape is stopped here so
 * closing the menu doesn't also close the surrounding dialog.
 */
export default function BudgetSelect({ value, onChange, id = 'budget' }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const rootRef = useRef(null)
  const buttonRef = useRef(null)
  const listRef = useRef(null)
  const listId = useId()

  // Close when focus or a pointer goes elsewhere.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  // Keep the highlighted option in view when arrowing through a long list.
  useEffect(() => {
    if (!open) return
    listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  const choose = (option) => {
    onChange(option)
    setOpen(false)
    buttonRef.current?.focus()
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      if (!open) return
      // Keep the parent dialog open — this Escape belongs to the menu.
      e.preventDefault()
      e.stopPropagation()
      setOpen(false)
      buttonRef.current?.focus()
      return
    }

    if (!open) {
      if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault()
        setActive(Math.max(0, BUDGET_OPTIONS.indexOf(value)))
        setOpen(true)
      }
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (i + 1) % BUDGET_OPTIONS.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (i - 1 + BUDGET_OPTIONS.length) % BUDGET_OPTIONS.length)
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActive(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setActive(BUDGET_OPTIONS.length - 1)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      choose(BUDGET_OPTIONS[active])
    } else if (e.key === 'Tab') {
      setOpen(false)
    }
  }

  return (
    <div ref={rootRef} className="relative" onKeyDown={onKeyDown}>
      <button
        ref={buttonRef}
        id={id}
        name="budget"
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => {
          setActive(Math.max(0, BUDGET_OPTIONS.indexOf(value)))
          setOpen((v) => !v)
        }}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-white/[0.03] px-4 py-3 text-left text-sm transition-all duration-200 hover:border-white/30 hover:bg-white/[0.05] focus:border-brand focus:bg-white/[0.06] focus:ring-2 focus:ring-brand/30 focus:outline-none ${
          open ? 'border-brand ring-2 ring-brand/30' : 'border-white/12'
        } ${value ? 'text-white' : 'text-white/30'}`}
      >
        <span className="truncate">{value || PLACEHOLDER}</span>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`shrink-0 text-white/45 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            ref={listRef}
            id={listId}
            role="listbox"
            aria-label="Budget range"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className="absolute z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-white/12 bg-[#1b1b1e] p-1.5 shadow-2xl"
          >
            {BUDGET_OPTIONS.map((option, i) => {
              const selected = option === value
              return (
                <li
                  key={option}
                  role="option"
                  aria-selected={selected}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(option)}
                  // 44px minimum height keeps these comfortable on touch.
                  className={`flex min-h-11 cursor-pointer items-center justify-between gap-2 rounded-lg px-3.5 text-sm transition-colors duration-150 ${
                    i === active ? 'bg-white/10 text-white' : 'text-white/75'
                  }`}
                >
                  <span>{option}</span>
                  {selected && <Check size={15} className="shrink-0 text-brand" />}
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
