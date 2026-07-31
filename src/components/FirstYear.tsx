import { motion, useMotionValueEvent, useReducedMotion, useTransform, type MotionValue } from 'framer-motion'
import { useRef, useState, type ReactNode } from 'react'
import { linePath } from '../lib/chart'
import { APP_AOV, APP_RATE, FREQ_LIFT_PCT, LTV_RATIO, OPEN_RATES, OPEN_RATE_AXIS_MAX, WEB_RATE, WEEK1_INSTALLS } from '../lib/model'
import { stops, useSmoothProgress } from '../lib/motion'
import { BrandIcon, Button, Counter, Eyebrow, TextLink } from './ui'

/* ------------------------------------------------------------------ *
 * The first year, told as five moments. The reader scrolls; the film
 * advances. Every number is the site's one shared model.
 * ------------------------------------------------------------------ */

type Moment = {
  when: string
  tick: string
  title: string
  body: string
  visual?: (on: boolean) => ReactNode
  finale?: boolean
}

const MOMENTS: Moment[] = [
  {
    when: 'Week 1',
    tick: 'W1',
    title: 'The email goes out.',
    body: 'Every customer you already have gets one message: the app is live, and there’s a reward waiting inside. No ads, no algorithm — by Friday, your icon is sitting on a thousand home screens.',
    visual: (on) => <LaunchVisual on={on} />,
  },
  {
    when: 'Week 6',
    tick: 'W6',
    title: 'Ordering becomes a habit.',
    body: 'The usual is saved, the card is saved, reordering is one tap. The same customers start showing up more often — and spending a little more every time they do.',
    visual: (on) => <HabitVisual on={on} />,
  },
  {
    when: 'Month 3',
    tick: 'M3',
    title: 'Your ad budget starts to breathe.',
    body: 'A push notification reaches every phone your app is installed on — and sending it costs nothing. You stop paying for ads just to talk to your own customers.',
    visual: (on) => <PushVisual on={on} />,
  },
  {
    when: 'Month 8',
    tick: 'M8',
    title: 'They stay.',
    body: 'Customers drift when coming back takes effort. Yours are one tap away, so they don’t. Eight months in, app customers are still ordering at 93% of a new customer’s pace — everyone else is down to 59%, and still falling.',
    visual: (on) => <StayVisual on={on} />,
  },
  {
    when: 'Month 12',
    tick: 'M12',
    title: 'You realize what you own.',
    body: `Revenue per customer is ${LTV_RATIO.toFixed(2)}× what it was. Your busiest channel costs nothing per send. And the thing making it all compound is yours outright — after your people, the hardest-working asset you own.`,
    finale: true,
  },
]

const N = MOMENTS.length

export default function FirstYear() {
  const reduce = useReducedMotion()
  return reduce ? <FirstYearStatic /> : <Cinema />
}

function Cinema() {
  const ref = useRef<HTMLDivElement>(null)
  // Spring-smoothed like the journey, so a mid-pin browser-chrome resize
  // glides instead of snapping a crossfade. Starts at -1: nothing counts or
  // lights up until the pin actually engages.
  const p = useSmoothProgress(ref, ['start start', 'end end'])
  const [active, setActive] = useState(-1)

  useMotionValueEvent(p, 'change', (v) => {
    const i = Math.min(N - 1, Math.max(0, Math.floor(v * N + 0.0001)))
    setActive((prev) => (prev === i ? prev : i))
  })

  return (
    <section id="after-launch" data-nav="dark" className="relative bg-ink-800 text-white">
      <div ref={ref} className="relative" style={{ height: `${N * 84}svh` }}>
        <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pb-[max(3.5svh,20px)] pt-[72px]">
          {/* One soft spotlight */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(80% 50% at 50% 0%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 60%)',
            }}
          />

          {/* Pinned header + the year's clock */}
          <div className="shell relative shrink-0">
            <Eyebrow tone="dark">After launch</Eyebrow>
            <h2 className="mt-4 max-w-[26ch] font-display text-[clamp(1.5rem,2.9vw,2.5rem)] font-semibold leading-[1.06] tracking-[-0.035em] text-white">
              See what happens when you own their home screens.
            </h2>
            <div className="mt-5 flex max-w-[36rem] items-center gap-2.5">
              {MOMENTS.map((m, i) => (
                <span key={m.when} className="flex items-center gap-2.5">
                  <span
                    className={`num whitespace-nowrap text-[0.625rem] font-semibold uppercase tracking-[0.13em] transition-colors duration-500 ${
                      i === active ? 'text-white' : 'text-white/35'
                    }`}
                  >
                    <span className="sm:hidden">{m.tick}</span>
                    <span className="hidden sm:inline">{m.when}</span>
                  </span>
                  {i < N - 1 ? (
                    <span className="relative h-px w-4 overflow-hidden bg-white/15 sm:w-7">
                      <motion.span
                        className="absolute inset-y-0 left-0 w-full bg-white"
                        initial={false}
                        animate={{ scaleX: i < active ? 1 : 0 }}
                        style={{ originX: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </span>
                  ) : null}
                </span>
              ))}
            </div>
          </div>

          {/* The moments */}
          <div className="relative min-h-0 flex-1">
            {MOMENTS.map((m, i) => (
              <Beat key={m.when} i={i} p={p} live={active === i}>
                {m.finale ? (
                  <div className="shell flex h-full flex-col items-center justify-center pb-[2svh] text-center">
                    <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-white/40">
                      {m.when}
                    </p>
                    <h3 className="mt-4 max-w-[16ch] text-balance font-display text-[clamp(2rem,5vw,4rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-white">
                      {m.title}
                    </h3>
                    <p className="mt-5 max-w-[52ch] text-balance text-[clamp(0.9375rem,1.2vw,1.125rem)] leading-relaxed text-white/60">
                      {m.body}
                    </p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
                      <Button variant="light" size="lg">
                        Book a strategy call
                      </Button>
                      <TextLink href="#model" tone="dark">
                        Run it on your numbers
                      </TextLink>
                    </div>
                  </div>
                ) : (
                  <div className="shell grid h-full [align-content:safe_center] items-center gap-6 pb-[2svh] sm:gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-20">
                    <div>
                      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-white/40">
                        {m.when}
                      </p>
                      <h3 className="mt-3 max-w-[16ch] text-balance font-display text-[clamp(1.75rem,3.8vw,3.25rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-white">
                        {m.title}
                      </h3>
                      <p className="mt-4 max-w-[50ch] text-[clamp(0.9375rem,1.15vw,1.0625rem)] leading-relaxed text-white/60">
                        {m.body}
                      </p>
                    </div>
                    <div className="min-w-0">{m.visual?.(active === i)}</div>
                  </div>
                )}
              </Beat>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * One moment of the film. Windows are pinned to 0 and 1 with held values —
 * framer extrapolates past the outermost stop rather than clamping, and an
 * unpinned window lets a faded layer climb back into view.
 */
function Beat({ children, i, p, live }: { children: ReactNode; i: number; p: MotionValue<number>; live: boolean }) {
  const step = 1 / N
  const s = i * step
  const first = i === 0
  const last = i === N - 1

  // Narrow swap around the boundary, matching the showcase: each moment holds
  // pure for most of its dwell instead of double-exposing with its neighbour.
  const inA = first ? 0 : s - step * 0.16
  const inB = first ? 0 : s + step * 0.12
  const mid = s + step * 0.5
  const outA = last ? 1 : s + step * 0.88
  const outB = last ? 1 : s + step * 1.16

  const win = stops(0, inA, inB, mid, outA, outB, 1)
  const opacity = useTransform(
    p,
    win,
    [first ? 1 : 0, first ? 1 : 0, 1, 1, 1, last ? 1 : 0, last ? 1 : 0],
  )
  const y = useTransform(p, win, [first ? 0 : 30, first ? 0 : 30, 0, 0, 0, last ? 0 : -30, last ? 0 : -30])

  return (
    // `inert` removes the invisible beats from tab order and the a11y tree —
    // opacity + pointer-events alone left the finale's links Tab-reachable
    // while fully invisible.
    <motion.div inert={!live} style={{ opacity, y, pointerEvents: live ? 'auto' : 'none' }} className="absolute inset-0">
      {children}
    </motion.div>
  )
}

/* ------------------------------------------------------------------ *
 * The visuals — one per moment, white on black, no images.
 * Each replays whenever its moment comes back on screen.
 * ------------------------------------------------------------------ */

const spring = { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const }

/** Week 1: the launch email, and the install counter it sets off. */
function LaunchVisual({ on }: { on: boolean }) {
  const seen = useRef(false)
  if (on) seen.current = true
  return (
    <div className="mx-auto w-full max-w-[420px]">
      <motion.div
        initial={false}
        animate={{ opacity: on ? 1 : 0.4, y: on ? 0 : 10 }}
        transition={spring}
        className="rounded-2xl border border-white/10 bg-white/[0.06] p-5"
      >
        <div className="flex items-center gap-3">
          <BrandIcon size={34} className="rounded-[9px]" tone="light" />
          <div className="min-w-0">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/40">
              To: every customer you have
            </p>
            <p className="mt-1 truncate text-[0.9375rem] font-semibold tracking-[-0.01em] text-white">
              Our app is live — your first reward is inside
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
          <span className="rounded-full bg-white px-3.5 py-1.5 text-[0.75rem] font-semibold text-ink-900">
            Download the app
          </span>
          <span className="text-[0.6875rem] text-white/35">sent 9:02 am</span>
        </div>
      </motion.div>

      <div className="mt-4 flex items-end justify-between [@media(min-height:760px)]:mt-6">
        <div>
          <p className="num font-display text-[clamp(2.5rem,4.6vw,3.75rem)] font-semibold leading-none tracking-[-0.04em] text-white">
            {seen.current ? <Counter to={WEEK1_INSTALLS} group duration={2.2} /> : '0'}
          </p>
          <p className="mt-2 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-white/40">
            installs in week one
          </p>
        </div>
        <InstallDots on={on} />
      </div>
    </div>
  )
}

/** A little constellation of home screens lighting up. */
function InstallDots({ on }: { on: boolean }) {
  const cells = [3, 9, 1, 11, 5, 7, 0, 10, 4, 8, 2, 6]
  return (
    <div className="mb-1 grid grid-cols-4 gap-1.5">
      {cells.map((order, i) => (
        <motion.span
          key={i}
          initial={false}
          animate={{ opacity: on ? 1 : 0.15, scale: on ? 1 : 0.6 }}
          transition={{ ...spring, delay: on ? 0.5 + order * 0.09 : 0 }}
          className="h-2 w-2 rounded-[2.5px] bg-white"
        />
      ))}
    </div>
  )
}

/** Week 6: order frequency climbing, week by week. */
function HabitVisual({ on }: { on: boolean }) {
  const weeks = [38, 42, 40, 50, 56, 62, 74, 100]
  return (
    <div className="mx-auto w-full max-w-[420px]">
      <div className="flex h-[110px] items-end gap-[6px] [@media(min-height:760px)]:h-[150px]">
        {weeks.map((h, i) => (
          <motion.span
            key={i}
            initial={false}
            animate={{ scaleY: on ? 1 : 0 }}
            transition={{ ...spring, delay: on ? i * 0.07 : 0 }}
            className={`flex-1 origin-bottom rounded-t-[4px] ${i === weeks.length - 1 ? 'bg-white' : 'bg-[#5a5a5e]'}`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <div className="mt-3 flex items-baseline justify-between border-t border-white/10 pt-3">
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/40">
          Orders per week
        </span>
        <span className="num text-[0.75rem] text-white/35">weeks 1–8</span>
      </div>
      <div className="mt-4 hidden flex-wrap gap-2 [@media(min-height:720px)]:flex">
        <span className="rounded-full border border-white/15 px-3.5 py-1.5 text-[0.75rem] font-medium text-white/85">
          +{FREQ_LIFT_PCT}% more orders a year
        </span>
        <span className="rounded-full border border-white/15 px-3.5 py-1.5 text-[0.75rem] font-medium text-white/85">
          ${Math.round(APP_AOV)} average ticket, up from $58
        </span>
      </div>
    </div>
  )
}

/** Month 3: what it now costs to reach them. */
function PushVisual({ on }: { on: boolean }) {
  const channels = OPEN_RATES.map((c) => ({ n: c.own ? 'Push, from your app' : c.name, v: c.value, own: c.own }))
  return (
    <div className="mx-auto w-full max-w-[420px]">
      <div className="flex items-end gap-4">
        <motion.p
          initial={false}
          animate={{ opacity: on ? 1 : 0.35, y: on ? 0 : 8 }}
          transition={spring}
          className="num font-display text-[clamp(3.25rem,6.4vw,5rem)] font-semibold leading-none tracking-[-0.045em] text-white"
        >
          $0
        </motion.p>
        <p className="mb-1.5 max-w-[18ch] text-[0.8125rem] leading-snug text-white/50">
          per message, to every phone you&apos;re installed on
        </p>
      </div>
      <div className="mt-7 space-y-4">
        {channels.map((c, i) => (
          <div key={c.n}>
            <div className="flex items-baseline justify-between">
              <span className={`text-[0.8125rem] font-medium ${c.own ? 'text-white' : 'text-white/50'}`}>{c.n}</span>
              <span className={`num text-[0.8125rem] font-semibold ${c.own ? 'text-white' : 'text-white/40'}`}>
                {c.v}% opened
              </span>
            </div>
            <div className="mt-1.5 h-[8px] w-full">
              <motion.div
                initial={false}
                animate={{ scaleX: on ? 1 : 0 }}
                style={{ width: `${(c.v / OPEN_RATE_AXIS_MAX) * 100}%`, originX: 0 }}
                transition={{ ...spring, delay: on ? 0.15 + i * 0.12 : 0 }}
                className={`h-full rounded-r-[3px] ${c.own ? 'bg-white' : 'bg-[#5a5a5e]'}`}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[0.6875rem] leading-snug text-white/30">Commonly reported industry averages.</p>
    </div>
  )
}

/** Month 8: the pace they keep — straight from the shared model. */
function StayVisual({ on }: { on: boolean }) {
  const W = 340
  const H = 150
  const toPts = (rates: number[]) =>
    rates.map((v, i) => [12 + (i * (W - 40)) / (rates.length - 1), H - 14 - (v / 1.05) * (H - 34)] as [number, number])
  const appPts = toPts(APP_RATE)
  const webPts = toPts(WEB_RATE)
  return (
    <div className="mx-auto w-full max-w-[420px]">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" fill="none">
        <line x1="12" x2={W - 28} y1={H - 14} y2={H - 14} stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
        <motion.g initial={false} animate={{ opacity: on ? 1 : 0.25 }} transition={spring}>
          <path d={linePath(webPts)} stroke="#5a5a5e" strokeWidth="2" strokeLinecap="round" />
          <path d={linePath(appPts)} stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <circle cx={appPts[11][0]} cy={appPts[11][1]} r="4" fill="#fff" stroke="#0b0b0c" strokeWidth="2" />
          <circle cx={webPts[11][0]} cy={webPts[11][1]} r="3.5" fill="#5a5a5e" stroke="#0b0b0c" strokeWidth="2" />
          <text x={appPts[11][0] + 10} y={appPts[11][1] + 4} className="fill-white text-[13px] font-semibold">
            92%
          </text>
          <text x={webPts[11][0] + 10} y={webPts[11][1] + 4} className="fill-[#8a8a8e] text-[13px] font-semibold">
            30%
          </text>
        </motion.g>
      </svg>
      <div className="mt-3 flex items-baseline justify-between border-t border-white/10 pt-3">
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/40">
          Order pace vs. a new customer’s first month
        </span>
        <span className="num text-[0.75rem] text-white/35">months 1–12</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        <span className="flex items-center gap-2.5 text-[0.8125rem] font-medium text-white/85">
          <span className="h-[3px] w-5 rounded-full bg-white" /> With your app
        </span>
        <span className="flex items-center gap-2.5 text-[0.8125rem] font-medium text-white/45">
          <span className="h-[3px] w-5 rounded-full bg-[#5a5a5e]" /> Web &amp; email only
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Reduced motion: the same story, stacked and still.
 * ------------------------------------------------------------------ */

function FirstYearStatic() {
  return (
    <section id="after-launch" data-nav="dark" className="relative bg-ink-800 py-[clamp(96px,11vw,176px)] text-white">
      <div className="shell">
        <Eyebrow tone="dark">After launch</Eyebrow>
        <h2 className="type-1 mt-6 max-w-[24ch] text-balance text-white">
          See what happens when you own their home screens.
        </h2>
        <div className="mt-16 space-y-16">
          {MOMENTS.map((m) => (
            <div key={m.when} className="border-t border-white/10 pt-8">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-white/40">{m.when}</p>
              <h3 className="type-2 mt-3 text-white">{m.title}</h3>
              <p className="mt-4 max-w-[56ch] text-[1.0625rem] leading-relaxed text-white/60">{m.body}</p>
              {m.visual ? <div className="mt-8 max-w-[420px]">{m.visual(true)}</div> : null}
              {m.finale ? (
                <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                  <Button variant="light" size="lg">
                    Book a strategy call
                  </Button>
                  <TextLink href="#model" tone="dark">
                    Run it on your numbers
                  </TextLink>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
