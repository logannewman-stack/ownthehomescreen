import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState, type FormEvent } from 'react'
import { useContactModal } from './useContactModal'
import { BrandIcon } from './ui'

/**
 * The booking sheet. Submissions are emailed straight to INBOX via
 * FormSubmit's AJAX endpoint — no account, no third-party branding.
 * The first live submission triggers a one-time activation email to
 * that inbox; after it's confirmed, every request lands there.
 */
const INBOX = 'newmanlogan13@gmail.com'
const ENDPOINT = `https://formsubmit.co/ajax/${INBOX}`

type Status = 'idle' | 'sending' | 'sent' | 'error'

const FIELD =
  'w-full rounded-xl border border-black/[0.1] bg-white px-4 py-3 text-[0.9375rem] text-ink-900 placeholder:text-faint outline-none transition-[border-color,box-shadow] duration-200 focus:border-ink-900/60 focus:shadow-[0_0_0_3px_rgba(29,29,31,0.08)]'
const LABEL = 'mb-2 block text-[0.8125rem] font-medium text-ink-700'

export default function ContactModal() {
  const { isOpen, close } = useContactModal()
  const [status, setStatus] = useState<Status>('idle')

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

  // A fresh sheet next time it opens, but never mid-exit-animation.
  useEffect(() => {
    if (isOpen) setStatus('idle')
  }, [isOpen])

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    // Honeypot: real visitors never fill this — drop the bot quietly.
    if (data._honey) {
      setStatus('sent')
      return
    }
    setStatus('sending')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: data.name,
          business: data.business,
          email: data.email,
          phone: data.phone || '—',
          message: data.message || '—',
          _subject: `Strategy call request — ${data.business}`,
          _template: 'table',
          _captcha: 'false',
        }),
      })
      const json = await res.json().catch(() => null)
      if (res.ok && json && String(json.success) === 'true') setStatus('sent')
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

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
            className="relative my-auto w-full max-w-[560px] overflow-hidden rounded-[28px] border border-black/[0.07] bg-white shadow-[0_60px_120px_-50px_rgba(0,0,0,0.4)]"
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

            <div className="mt-6 border-t border-black/[0.07] px-7 pb-8 pt-7 sm:px-9">
              {status === 'sent' ? (
                <div className="flex flex-col items-center py-10 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-900 text-white">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  </span>
                  <p className="mt-6 font-display text-[1.375rem] font-semibold tracking-[-0.03em] text-ink-900">
                    Got it.
                  </p>
                  <p className="mt-2.5 max-w-[34ch] text-[0.9375rem] leading-relaxed text-mute">
                    Your request is in. We&apos;ll reach out within one business day to set up your call.
                  </p>
                  <button
                    type="button"
                    onClick={close}
                    className="mt-8 inline-flex h-11 select-none items-center justify-center rounded-full bg-ink-700 px-6 text-[0.9375rem] font-medium tracking-[-0.01em] text-white transition-all duration-300 ease-apple hover:bg-ink-900 active:scale-[0.98]"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} noValidate={false}>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="cm-name" className={LABEL}>
                        Your name
                      </label>
                      <input id="cm-name" name="name" type="text" required autoComplete="name" placeholder="Jordan Lee" className={FIELD} />
                    </div>
                    <div>
                      <label htmlFor="cm-business" className={LABEL}>
                        Business name
                      </label>
                      <input id="cm-business" name="business" type="text" required autoComplete="organization" placeholder="Lee's Coffee Co." className={FIELD} />
                    </div>
                    <div>
                      <label htmlFor="cm-email" className={LABEL}>
                        Email
                      </label>
                      <input id="cm-email" name="email" type="email" required autoComplete="email" placeholder="you@business.com" className={FIELD} />
                    </div>
                    <div>
                      <label htmlFor="cm-phone" className={LABEL}>
                        Phone <span className="font-normal text-faint">(optional)</span>
                      </label>
                      <input id="cm-phone" name="phone" type="tel" autoComplete="tel" placeholder="(555) 000-0000" className={FIELD} />
                    </div>
                  </div>

                  <div className="mt-5">
                    <label htmlFor="cm-message" className={LABEL}>
                      Anything we should know? <span className="font-normal text-faint">(optional)</span>
                    </label>
                    <textarea
                      id="cm-message"
                      name="message"
                      rows={3}
                      placeholder="What you run, how customers order today, what you want the app to do…"
                      className={`${FIELD} resize-none`}
                    />
                  </div>

                  {/* Honeypot — hidden from people, tempting to bots */}
                  <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" />

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="mt-7 inline-flex h-[3.25rem] w-full select-none items-center justify-center rounded-full bg-ink-700 px-8 text-base font-medium tracking-[-0.01em] text-white transition-all duration-300 ease-apple hover:bg-ink-900 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
                  >
                    {status === 'sending' ? 'Sending…' : 'Request my call'}
                  </button>

                  {status === 'error' ? (
                    <p className="mt-4 text-center text-[0.8125rem] leading-relaxed text-mute" role="alert">
                      That didn&apos;t go through. Please try again, or email{' '}
                      <a href={`mailto:${INBOX}`} className="font-medium text-ink-900 underline underline-offset-2">
                        {INBOX}
                      </a>{' '}
                      directly.
                    </p>
                  ) : (
                    <p className="mt-4 text-center text-[0.8125rem] text-faint">
                      No spam, no obligation — just a conversation about your numbers.
                    </p>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
