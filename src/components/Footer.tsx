import { contactModal } from './useContactModal'
import { Wordmark } from './ui'

const COLUMNS = [
  {
    title: 'The app',
    links: [
      { l: 'What we build', h: '#build' },
      { l: 'The results', h: '#results' },
      { l: 'Run the model', h: '#model' },
      { l: 'Process', h: '#process' },
    ],
  },
  {
    title: 'Engagements',
    links: [
      { l: 'Signature', h: '#engagements' },
      { l: 'Signature Plus', h: '#engagements' },
      { l: 'Enterprise', h: '#engagements' },
      { l: 'Book a call', h: '#contact' },
    ],
  },
]

export default function Footer() {
  return (
    <footer data-nav="dark" className="relative bg-ink-800 pb-12 pt-16 text-white sm:pt-20">
      <div className="shell">
        <div className="grid gap-12 border-t border-white/10 pt-14 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,1fr))_minmax(0,1.2fr)] lg:gap-16">
          <div>
            <Wordmark tone="dark" />
            <p className="mt-5 max-w-[30ch] text-[0.875rem] leading-relaxed text-white/45">
              We build the mobile app your customers keep — and the retention, frequency and lifetime value
              that follows it.
            </p>
          </div>

          {COLUMNS.map((c) => (
            <div key={c.title}>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white/35">{c.title}</p>
              <ul className="mt-5 space-y-3">
                {c.links.map((l) => (
                  <li key={l.l}>
                    <a
                      href={l.h}
                      onClick={
                        l.h === '#contact'
                          ? (e) => {
                              e.preventDefault()
                              contactModal.open()
                            }
                          : undefined
                      }
                      className="text-[0.875rem] text-white/70 transition-colors duration-300 hover:text-white"
                    >
                      {l.l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white/35">Start</p>
            <p className="mt-5 max-w-[26ch] text-[0.875rem] leading-relaxed text-white/60">
              Forty-five minutes, your numbers, no obligation.
            </p>
            <button
              type="button"
              onClick={() => contactModal.open()}
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-[0.9375rem] font-medium text-ink-700 transition-colors duration-300 hover:bg-white/90"
            >
              Book a strategy call
            </button>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.75rem] text-white/35">
            © {new Date().getFullYear()} Own The Home Screen. All rights reserved.
          </p>
          <p className="max-w-[62ch] text-[0.75rem] leading-relaxed text-white/30">
            Retention, lifetime value and open-rate figures shown on this site are illustrative models based
            on published app-versus-web benchmarks, not guarantees of performance.
          </p>
        </div>
      </div>
    </footer>
  )
}
