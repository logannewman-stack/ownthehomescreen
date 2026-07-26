import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { useContactModal } from './useContactModal'
import { BrandIcon } from './ui'

/**
 * The booking sheet. Swap FORM_SRC for whichever form or scheduler you want
 * every CTA on the page to open — nothing else needs to change.
 */
const FORM_SRC = 'https://link.virsalabs.io/widget/form/gobc1SHBoXDUXsieNLL9'

export default function ContactModal() {
  const { isOpen, close } = useContactModal()

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [isOpen, close])

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-8"
          style={{ background: 'rgba(245,245,247,0.72)', backdropFilter: 'blur(24px) saturate(180%)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Book a strategy call"
        >
          <motion.div
            className="relative my-auto w-full max-w-[620px] overflow-hidden rounded-[28px] border border-black/[0.07] bg-white shadow-[0_60px_120px_-50px_rgba(0,0,0,0.4)]"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 px-7 pt-7 sm:px-9 sm:pt-8">
              <div className="flex items-center gap-3.5">
                <BrandIcon size={40} className="rounded-[10px]" />
                <div>
                  <p className="font-display text-[1.0625rem] font-semibold leading-none tracking-[-0.025em] text-ink-900">
                    Book a strategy call
                  </p>
                  <p className="mt-1.5 text-[0.8125rem] text-mute">
                    Forty-five minutes. Your numbers. No obligation.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="-mr-2 -mt-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-700 transition-colors duration-300 hover:bg-black/[0.05]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
              </button>
            </div>

            <div className="mt-6 border-t border-black/[0.07] px-2 pb-3 pt-3 sm:px-4">
              <iframe
                src={FORM_SRC}
                title="Book a strategy call"
                style={{ width: '100%', height: 680, border: 'none', borderRadius: 18, background: '#fff' }}
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
