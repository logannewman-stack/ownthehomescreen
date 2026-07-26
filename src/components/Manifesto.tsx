import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { Counter, Eyebrow, Reveal, ScrollLit } from './ui'

/** Reported open / engagement rates by channel. Emphasis on the one you own. */
const CHANNELS = [
  { name: 'Push notification', value: 20.4, own: true },
  { name: 'Email', value: 3.2, own: false },
  { name: 'Paid social', value: 1.1, own: false },
]
const AXIS_MAX = 25

export default function Manifesto() {
  return (
    <section
      data-nav="dark"
      className="relative overflow-hidden bg-ink-800 py-[clamp(88px,10.4vw,164px)] text-white"
    >
      {/* One soft spotlight, top centre */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(75% 45% at 50% 0%, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0) 62%), radial-gradient(60% 40% at 85% 100%, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 60%)',
        }}
      />

      <div className="shell relative">
        <Reveal>
          <Eyebrow tone="dark">The thesis</Eyebrow>
        </Reveal>

        <ScrollLit
          tone="dark"
          text="You don't own your place in a feed. You don't own your spot in an inbox. You rent both, at auction, forever. The home screen is the one place a customer puts you on purpose — and never takes you off."
          className="mt-8 max-w-[42ch] font-display text-[clamp(1.75rem,4.1vw,3.5rem)] font-semibold leading-[1.06] tracking-[-0.04em] text-white"
        />

        <div className="mt-20 grid gap-14 lg:mt-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-24">
          {/* The chart */}
          <ChannelChart />

          {/* The consequence */}
          <div className="lg:pt-2">
            <h3 className="type-2 max-w-[28ch] text-balance text-white">
              You stop paying, forever, to reach people who already chose you.
            </h3>
            <p className="mt-6 max-w-[44ch] text-[1.0625rem] leading-relaxed text-white/60">
              Every campaign you run to an installed base is free. Every reminder, every restock, every
              cancellation you fill — sent from an asset you own, to a screen you already earned.
            </p>
            <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-white/10 pt-10">
              {[
                { v: 96, suffix: '×', l: 'Times a day the average person checks their phone' },
                { v: 0, prefix: '$', l: 'Media spend to reach an installed customer' },
              ].map((s) => (
                <div key={s.l}>
                  <dd className="font-display text-[clamp(2.25rem,3.4vw,3.25rem)] font-semibold leading-none tracking-[-0.045em] text-white">
                    <Counter to={s.v} prefix={s.prefix} suffix={s.suffix} />
                  </dd>
                  <dt className="mt-3 max-w-[22ch] text-[0.8125rem] leading-snug text-white/50">{s.l}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}

function ChannelChart() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const reduce = useReducedMotion()
  const on = reduce || inView

  return (
    <figure ref={ref} className="rounded-[26px] border border-white/10 bg-white/[0.035] p-7 sm:p-9">
      <figcaption>
        <h3 className="font-display text-[1.375rem] font-semibold tracking-[-0.025em] text-white">
          Where a message actually lands
        </h3>
        <p className="mt-1.5 text-[0.875rem] text-white/45">Average open rate by channel</p>
      </figcaption>

      <div className="mt-9 space-y-7">
        {CHANNELS.map((c, i) => (
          <div key={c.name}>
            <div className="flex items-baseline justify-between gap-4">
              <span className={`text-[0.9375rem] font-medium ${c.own ? 'text-white' : 'text-white/55'}`}>
                {c.name}
              </span>
              <span
                className={`num text-[1.0625rem] font-semibold tracking-[-0.02em] ${
                  c.own ? 'text-white' : 'text-white/45'
                }`}
              >
                {c.value}%
              </span>
            </div>
            {/* Bar: 10px thick, rounded data-end, square at the baseline */}
            <div className="mt-2.5 h-[10px] w-full">
              <motion.div
                className={`h-full origin-left rounded-r-[4px] ${c.own ? 'bg-white' : 'bg-[#5a5a5e]'}`}
                style={{ width: `${(c.value / AXIS_MAX) * 100}%` }}
                initial={{ scaleX: 0 }}
                animate={on ? { scaleX: 1 } : undefined}
                transition={{ duration: 1.1, delay: 0.15 + i * 0.14, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-9 border-t border-white/10 pt-6 text-[0.75rem] leading-relaxed text-white/35">
        Commonly reported industry ranges. Push open rates vary by segment and send discipline — we plan
        yours so the channel stays welcome.
      </p>

      <table className="sr-only">
        <caption>Average open rate by channel</caption>
        <tbody>
          {CHANNELS.map((c) => (
            <tr key={c.name}>
              <th scope="row">{c.name}</th>
              <td>{c.value}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}
