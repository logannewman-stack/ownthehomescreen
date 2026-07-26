import { motion, useMotionValueEvent, useReducedMotion, useTransform, type MotionValue } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useSmoothProgress } from '../lib/motion'
import { Eyebrow, Reveal, Section } from './ui'

const STEPS = [
  {
    n: '01',
    when: 'Week one',
    short: 'Week 1',
    title: 'Blueprint',
    body: 'We map how your customers actually come back — the systems you run, the behaviours worth engineering, the revenue sitting in your repeat rate. You leave with a spec, a fixed price, and the growth model built on your own order data.',
    deliver: ['Customer journey map', 'Fixed scope and price', 'Revenue model on your numbers'],
  },
  {
    n: '02',
    when: 'Weeks two to three',
    short: 'Weeks 2–3',
    title: 'Design',
    body: 'Every screen designed to your brand — typography, motion, icon, the lot. A clickable prototype lands on your own phone before any production code exists, and we iterate until it feels inevitable.',
    deliver: ['Full visual design', 'Clickable prototype', 'App icon and store assets'],
  },
  {
    n: '03',
    when: 'Weeks four to eight',
    short: 'Weeks 4–8',
    title: 'Build',
    body: 'Native iOS and Android, your integrations wired in, tested on real devices. Weekly builds land on your phone, so nothing is a surprise at the end.',
    deliver: ['iOS and Android builds', 'Integrations and payments', 'Weekly review builds'],
  },
  {
    n: '04',
    when: 'Week nine',
    short: 'Week 9',
    title: 'Launch',
    body: 'Store submission, review, listing and screenshots handled. Then the install campaign — in-store, email, SMS and social — engineered to put your icon on your customers’ home screens inside the first thirty days.',
    deliver: ['App Store and Play submission', 'Install campaign kit', 'Staff training'],
  },
  {
    n: '05',
    when: 'Ongoing',
    short: 'Ongoing',
    title: 'Grow',
    body: 'One page a month: who came back, how often they bought, what each customer is now worth. Plus the roadmap — new features, OS updates, seasonal campaigns — shipped without you chasing anyone.',
    deliver: ['Monthly retention report', 'Roadmap and releases', 'OS and store maintenance'],
  },
]

const N = STEPS.length

/* Geometry in vw — panel width, gap between panels. Everything else derives. */
const DESK = { panel: 44, gap: 9 }
const MOB = { panel: 86, gap: 8 }
/* A short dwell at each end of the pin, so the track isn't already moving
   the instant the section catches. */
const LEAD = 0.05
const TAIL = 0.05

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

export default function Process() {
  const reduce = useReducedMotion()
  return reduce ? <ProcessStatic /> : <Journey />
}

/* ------------------------------------------------------------------ *
 * The journey: the reader scrolls down, the timeline travels sideways.
 * One pinned viewport; vertical scroll is the only input.
 * ------------------------------------------------------------------ */

function Journey() {
  const ref = useRef<HTMLDivElement>(null)
  const p = useSmoothProgress(ref, ['start start', 'end end'])

  const [geo, setGeo] = useState(DESK)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const apply = () => setGeo(mq.matches ? MOB : DESK)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  const step = geo.panel + geo.gap
  const total = step * (N - 1)
  const pad = (100 - geo.panel) / 2
  const trackW = 100 + total

  // Journey progress 0→1 across the pinned scroll, with the end dwells cut out.
  const t = useTransform(p, (v) => clamp01((v - LEAD) / (1 - LEAD - TAIL)))
  // Function transforms stay on the main thread, so there are no native
  // keyframe offsets to violate — and the units can be pure vw.
  const x = useTransform(t, (v) => `${(-total * v).toFixed(4)}vw`)
  // The ink fill's right edge rides the fixed centre of the screen.
  const fillScale = useTransform(t, (v) => (50 + total * v) / trackW)

  const [active, setActive] = useState(0)
  useMotionValueEvent(t, 'change', (v) => {
    const i = Math.min(N - 1, Math.max(0, Math.round(v * (N - 1))))
    setActive((prev) => (prev === i ? prev : i))
  })

  return (
    <Section id="process" tone="mist">
      <div ref={ref} className="relative" style={{ height: `${N * 92}vh` }}>
        <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pb-[max(4svh,24px)] pt-[72px]">
          {/* Header stays put while the world moves underneath it */}
          <div className="shell flex shrink-0 items-end justify-between gap-6">
            <div>
              <Eyebrow>How it goes</Eyebrow>
              <h2 className="mt-4 font-display text-[clamp(1.75rem,3.4vw,2.875rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-ink-900">
                Nine weeks, start to store.
              </h2>
            </div>
            <div className="hidden shrink-0 pb-1.5 text-right sm:block">
              <p className="num text-[0.6875rem] font-semibold tracking-[0.14em] text-faint">
                {String(active + 1).padStart(2, '0')}
                <span className="text-black/20"> / {String(N).padStart(2, '0')}</span>
              </p>
              <p className="mt-1 text-[0.8125rem] font-medium text-mute">{STEPS[active].when}</p>
            </div>
          </div>

          {/* The travelling track */}
          <div className="relative mt-2 min-h-0 flex-1">
            <motion.div style={{ x }} className="absolute inset-y-0 left-0 flex will-change-transform">
              <div className="shrink-0" style={{ width: `${pad}vw` }} />
              {STEPS.map((s, i) => (
                <Panel key={s.n} s={s} i={i} t={t} geo={geo} last={i === N - 1} active={active === i} />
              ))}
              <div className="shrink-0" style={{ width: `${pad}vw` }} />

              {/* The route: a hairline under every station, its ink fill
                  always reaching exactly the centre of the screen */}
              <div className="absolute bottom-[15%] left-0 h-px bg-black/10" style={{ width: `${trackW}vw` }} />
              <motion.div
                className="absolute bottom-[15%] left-0 h-[2px] origin-left bg-ink-900"
                style={{ width: `${trackW}vw`, scaleX: fillScale, marginBottom: -0.5 }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </Section>
  )
}

function Panel({
  s,
  i,
  t,
  geo,
  last,
  active,
}: {
  s: (typeof STEPS)[number]
  i: number
  t: MotionValue<number>
  geo: { panel: number; gap: number }
  last: boolean
  active: boolean
}) {
  const tk = i / (N - 1)

  // 1 when this station is centred, 0 by the time its neighbour is.
  const focus = useTransform(t, (v) => Math.max(0, 1 - Math.abs(v - tk) * (N - 1)))
  const opacity = useTransform(focus, [0, 1], [0.3, 1])
  const y = useTransform(focus, [0, 1], [16, 0])
  // The ghost number drifts slower than the track — quiet depth.
  const ghostX = useTransform(t, (v) => `${((v - tk) * (N - 1) * 4.5).toFixed(3)}vw`)

  return (
    <div
      className="relative h-full shrink-0"
      style={{ width: `${geo.panel}vw`, marginRight: last ? 0 : `${geo.gap}vw` }}
    >
      {/* Ghost week number, behind everything */}
      <motion.span
        aria-hidden="true"
        style={{ x: ghostX, WebkitTextStroke: '1.5px rgba(29,29,31,0.09)' }}
        className="pointer-events-none absolute -top-[2%] left-0 select-none font-display text-[clamp(7.5rem,17vw,13rem)] font-semibold leading-none text-transparent"
      >
        {s.n}
      </motion.span>

      {/* Station content */}
      <motion.div style={{ opacity, y }} className="flex h-full flex-col justify-center pb-[19%]">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-faint">{s.when}</p>
        <h3 className="mt-3 font-display text-[clamp(1.75rem,3vw,2.625rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-ink-900">
          {s.title}
        </h3>
        <p className="mt-4 max-w-[52ch] text-[clamp(0.9375rem,1.1vw,1.0625rem)] leading-relaxed text-mute">
          {s.body}
        </p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {s.deliver.map((d) => (
            <li
              key={d}
              className="rounded-full border border-black/[0.09] bg-white/70 px-3.5 py-1.5 text-[0.75rem] font-medium text-ink-700"
            >
              {d}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Station marker on the route */}
      <span
        className={`absolute bottom-[15%] left-1/2 z-10 h-[11px] w-[11px] -translate-x-1/2 translate-y-1/2 rounded-full border-2 transition-colors duration-500 ${
          active ? 'border-ink-900 bg-ink-900' : 'border-black/25 bg-mist'
        }`}
      />
      <span className="num absolute bottom-[15%] left-1/2 -translate-x-1/2 translate-y-[26px] whitespace-nowrap text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-faint">
        {s.short}
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Reduced motion: the same stations, stacked and still.
 * ------------------------------------------------------------------ */

function ProcessStatic() {
  return (
    <Section id="process" tone="mist" className="py-[clamp(84px,10vw,156px)]">
      <div className="shell">
        <Reveal className="max-w-[46rem]">
          <Eyebrow>How it goes</Eyebrow>
          <h2 className="type-1 mt-6 text-balance text-ink-900">Nine weeks, start to store.</h2>
        </Reveal>
        <div className="mt-14 space-y-14">
          {STEPS.map((s) => (
            <div key={s.n} className="border-t border-black/[0.08] pt-8">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="num font-display text-[0.8125rem] font-semibold tracking-[0.14em] text-faint">
                  {s.n}
                </span>
                <h3 className="type-2 text-ink-900">{s.title}</h3>
                <span className="text-[0.8125rem] font-medium text-faint">{s.when}</span>
              </div>
              <p className="mt-4 max-w-[52ch] text-[1.0625rem] leading-relaxed text-mute">{s.body}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {s.deliver.map((d) => (
                  <li
                    key={d}
                    className="rounded-full border border-black/[0.09] bg-white/70 px-3.5 py-1.5 text-[0.8125rem] font-medium text-ink-700"
                  >
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
