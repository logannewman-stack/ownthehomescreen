import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useEffect, useState } from 'react'
import { contactModal } from './useContactModal'
import { BrandIcon } from './ui'

const LINKS = [
  { label: 'The app', href: '#product' },
  { label: 'Results', href: '#results' },
  { label: 'What we build', href: '#build' },
  { label: 'Process', href: '#process' },
  { label: 'Engagements', href: '#engagements' },
]

export default function Nav() {
  const { scrollY } = useScroll()
  const [lifted, setLifted] = useState(false)
  const [open, setOpen] = useState(false)
  const [onDark, setOnDark] = useState(false)

  useMotionValueEvent(scrollY, 'change', (v) => setLifted(v > 12))

  /**
   * Sections that mark themselves `data-nav="dark"` flip the bar to its dark
   * livery while they sit behind it, so the navigation never reads as a grey
   * smudge over a black frame.
   */
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-nav="dark"]'))
    if (!els.length) return
    let raf = 0
    const check = () => {
      raf = 0
      const y = 26 // the bar's vertical centre
      const dark = els.some((el) => {
        const r = el.getBoundingClientRect()
        return r.top <= y && r.bottom >= y
      })
      setOnDark((prev) => (prev === dark ? prev : dark))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check)
    }
    check()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-apple ${
          lifted || open
            ? onDark
              ? 'frost-dark border-b border-white/10'
              : 'frost border-b border-black/[0.07]'
            : 'border-b border-transparent bg-white/0'
        }`}
      >
        <nav className="shell flex h-[52px] items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5" aria-label="Own The Home Screen — home">
            <BrandIcon size={24} className="rounded-[6px]" tone={onDark ? 'light' : 'dark'} />
            <span
              className={`font-display text-[0.9375rem] font-semibold tracking-[-0.02em] transition-colors duration-500 ${
                onDark ? 'text-white' : 'text-ink-700'
              }`}
            >
              Own The Home Screen
            </span>
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`relative text-[0.8125rem] font-medium tracking-[-0.005em] transition-colors duration-300 ${
                    onDark ? 'text-white/70 hover:text-white' : 'text-ink-700/75 hover:text-ink-900'
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => contactModal.open()}
              className={`hidden h-8 items-center rounded-full px-4 text-[0.8125rem] font-medium transition-colors duration-500 sm:inline-flex ${
                onDark ? 'bg-white text-ink-700 hover:bg-white/90' : 'bg-ink-700 text-white hover:bg-ink-900'
              }`}
            >
              Book a call
            </button>
            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="relative flex h-8 w-8 flex-col items-center justify-center gap-[5px] lg:hidden"
            >
              <motion.span
                className={`block h-[1.5px] w-[18px] rounded-full ${onDark && !open ? 'bg-white' : 'bg-ink-700'}`}
                animate={open ? { rotate: 45, y: 3.25 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.span
                className={`block h-[1.5px] w-[18px] rounded-full ${onDark && !open ? 'bg-white' : 'bg-ink-700'}`}
                animate={open ? { rotate: -45, y: -3.25 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open ? (
          <motion.div
            className="frost fixed inset-0 z-40 flex flex-col justify-center px-8 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="space-y-1">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-black/[0.07] py-5 font-display text-[2rem] font-semibold tracking-[-0.035em] text-ink-900"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => {
                setOpen(false)
                contactModal.open()
              }}
              className="mt-10 inline-flex h-12 items-center justify-center rounded-full bg-ink-700 px-8 text-[0.9375rem] font-medium text-white"
            >
              Book a call
            </motion.button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
