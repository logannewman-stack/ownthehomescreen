import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useRef, useState, type ReactNode } from 'react'
import { stops } from '../lib/motion'
import { Phone } from './Phone'
import { BookScreen, HomeScreen, LockScreen, ReorderScreen, RewardsScreen, WalletScreen } from './screens'
import { Eyebrow, Reveal, Section } from './ui'

type Item = {
  kicker: string
  title: string
  body: string
  points: string[]
  outcome: string
  screen: ReactNode
}

const ITEMS: Item[] = [
  {
    kicker: 'Their home screen',
    title: 'Prime real estate, permanently.',
    body: 'Your icon sits between their bank and their messages — on the screen they check 96 times a day. No algorithm decides whether they see you.',
    points: ['Your name and your logo', 'Opens cost you nothing', 'Nobody can outbid you'],
    outcome: 'Always one tap from a purchase',
    screen: <HomeScreen delay={0.1} />,
  },
  {
    kicker: 'Reordering',
    title: 'One tap to buy again.',
    body: 'Their last order, their card and their usual time are already saved. When buying again takes ten seconds, people do it more often.',
    points: ['Saved order + saved card', 'Reorder in a single tap', 'Live prep and delivery status'],
    outcome: '+3.1 orders per customer, per year',
    screen: <ReorderScreen />,
  },
  {
    kicker: 'Loyalty',
    title: 'A reason to come back on a Tuesday.',
    body: 'When a free reward is 300 points away, the next visit is already decided. Points and streaks turn occasional customers into regulars.',
    points: ['Points, tiers and streaks', 'Rewards that bring them back', 'Referral credit built in'],
    outcome: '+38% more orders a year',
    screen: <RewardsScreen />,
  },
  {
    kicker: 'Booking',
    title: 'Bookings without the phone call.',
    body: 'Live availability, instant confirmation, deposits taken up front. The 9pm booking happens at 9pm, and your calendar fills itself.',
    points: ['Real-time availability', 'Deposits and no-show protection', 'Automatic reminders'],
    outcome: 'Fewer no-shows, zero hold music',
    screen: <BookScreen />,
  },
  {
    kicker: 'Spend',
    title: 'A bigger ticket, quietly.',
    body: 'Cards are saved, memberships renew on their own, and add-ons are one tap at checkout. Customers say yes to more when saying yes is effortless.',
    points: ['Stored cards and wallets', 'Memberships and prepaid balances', 'One-tap add-ons at checkout'],
    outcome: 'Higher average order value',
    screen: <WalletScreen />,
  },
  {
    kicker: 'Push',
    title: 'A channel you own, not rent.',
    body: 'A push notification lands on their lock screen in seconds, and sending one costs you nothing. Email gets buried and ads charge you every time — push is free, and it gets seen.',
    points: ['Lands on the lock screen', 'Goes to the right customers automatically', 'No ad spend, ever'],
    outcome: 'Roughly 6× the open rate of email',
    screen: <LockScreen />,
  },
]

export default function Showcase() {
  const gridRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: gridRef, offset: ['start start', 'end end'] })
  const [active, setActive] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    // The copy blocks hand off at (n-1) gaps, so the rail follows the same
    // spread grid as the device screens.
    const i = Math.min(ITEMS.length - 1, Math.max(0, Math.round(v * (ITEMS.length - 1))))
    setActive((prev) => (prev === i ? prev : i))
  })

  return (
    <Section id="product" tone="white">
      <div className="shell pt-[clamp(84px,10vw,156px)]">
        <Reveal className="max-w-[54rem]">
          <Eyebrow>The app</Eyebrow>
          <h2 className="type-1 mt-6 text-balance text-ink-900">Six screens that bring them back.</h2>
          <p className="lede mt-6 max-w-[50ch]">
            Ordering, rewards, booking, payments and push notifications — one app doing the work of a
            loyalty program, a front desk and a marketing budget. Every build is designed around your
            business, not a template — these six screens are the usual shape.
          </p>
        </Reveal>
      </div>

      {/* ---------- Desktop: pinned device, scrolling narrative ---------- */}
      <div ref={gridRef} className="shell mt-16 hidden lg:grid lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-20 xl:gap-28">
        <div>
          <div className="sticky top-0 flex h-[100svh] items-center">
            <div className="flex items-center gap-10">
              {/* Segmented rail */}
              <div className="flex flex-col items-center gap-2.5">
                {ITEMS.map((it, i) => (
                  <span key={it.title} className="relative h-10 w-[2px] overflow-hidden rounded-full bg-black/[0.08]">
                    <motion.span
                      className="absolute inset-x-0 top-0 bg-ink-900"
                      initial={false}
                      animate={{ height: i <= active ? '100%' : '0%' }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </span>
                ))}
                <span className="num mt-2 text-[0.6875rem] font-semibold tracking-[0.14em] text-faint">
                  {String(active + 1).padStart(2, '0')}
                  <span className="text-black/15"> / {String(ITEMS.length).padStart(2, '0')}</span>
                </span>
              </div>

              <div className="relative w-[302px]">
                <Phone>
                  {ITEMS.map((it, i) => (
                    <Layer key={it.title} p={scrollYProgress} i={i} n={ITEMS.length} grid="spread">
                      {it.screen}
                    </Layer>
                  ))}
                </Phone>
                <div className="pointer-events-none absolute -bottom-8 left-1/2 h-14 w-[125%] -translate-x-1/2 rounded-[50%] bg-ink-900/15 blur-3xl" />
              </div>
            </div>
          </div>
        </div>

        <div>
          {ITEMS.map((it) => (
            <div key={it.title} className="flex h-[88svh] flex-col justify-center">
              <Copy item={it} />
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Mobile: the same pinned sequence, stacked ---------- */}
      <MobileStage />

      <div className="h-[clamp(84px,10vw,156px)]" />
    </Section>
  )
}

/**
 * Small screens get the same pinned device and the same crossfade — the screens
 * changing inside the phone is the whole point of the section, so it can't be a
 * desktop-only flourish. Here the copy crossfades in place beneath the device
 * rather than scrolling past it, which is the only way both fit in one viewport.
 */
function MobileStage() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const [active, setActive] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const i = Math.min(ITEMS.length - 1, Math.max(0, Math.floor(v * ITEMS.length + 0.0001)))
    setActive((prev) => (prev === i ? prev : i))
  })

  return (
    <div ref={ref} className="relative mt-8 lg:hidden" style={{ height: `${ITEMS.length * 82}svh` }}>
      {/*
       * The height budget runs bottom-up: the copy gets a fixed, reserved
       * block, the rail a fixed row, and the device flexes into whatever is
       * left. Sizing the phone first was what pushed the description below
       * the fold on real phones — the browser chrome ate the leftover space.
       */}
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden pb-[max(3svh,16px)] pt-[64px]">
        <div className="flex min-h-0 w-full flex-1 items-center justify-center">
          {/* Height-driven: the aspect ratio derives the width, so the device
              is exactly as large as the leftover space allows. */}
          <div className="relative aspect-[393/852] h-full max-h-full">
            <Phone>
              {ITEMS.map((it, i) => (
                <Layer key={it.title} p={scrollYProgress} i={i} n={ITEMS.length}>
                  {it.screen}
                </Layer>
              ))}
            </Phone>
            <div className="pointer-events-none absolute -bottom-4 left-1/2 h-7 w-[120%] -translate-x-1/2 rounded-[50%] bg-ink-900/15 blur-2xl" />
          </div>
        </div>

        {/* Beat counter + segmented rail */}
        <div className="mt-4 flex shrink-0 items-center justify-center gap-3">
          <span className="num text-[0.625rem] font-semibold tracking-[0.14em] text-faint">
            {String(active + 1).padStart(2, '0')}
            <span className="text-black/15"> / {String(ITEMS.length).padStart(2, '0')}</span>
          </span>
          <span className="flex items-center gap-1.5">
            {ITEMS.map((it, i) => (
              <span key={it.title} className="relative h-[2px] w-6 overflow-hidden rounded-full bg-black/[0.09]">
                <motion.span
                  className="absolute inset-y-0 left-0 bg-ink-900"
                  initial={false}
                  animate={{ width: i <= active ? '100%' : '0%' }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>
            ))}
          </span>
        </div>

        {/* Copy crossfading inside its reserved block — sized for the longest
            beat, so no description can ever be cut off by the viewport. */}
        <div className="relative mx-auto mt-4 h-[236px] w-full max-w-[32rem] shrink-0">
          {ITEMS.map((it, i) => (
            <Layer key={it.title} p={scrollYProgress} i={i} n={ITEMS.length} soft>
              <Copy item={it} compact />
            </Layer>
          ))}
        </div>
      </div>
    </div>
  )
}

function Copy({ item, compact = false }: { item: Item; compact?: boolean }) {
  return (
    <div className={compact ? 'mx-auto max-w-[34rem] px-6' : 'max-w-[34rem]'}>
      <Eyebrow>{item.kicker}</Eyebrow>
      <h3
        className={
          compact
            ? 'mt-2.5 font-display text-[1.375rem] font-semibold leading-[1.12] tracking-[-0.03em] text-balance text-ink-900'
            : 'type-2 mt-5 text-balance text-ink-900'
        }
      >
        {item.title}
      </h3>
      <p className={compact ? 'mt-2.5 text-[0.875rem] leading-[1.55] text-mute' : 'lede mt-5'}>{item.body}</p>
      {compact ? null : (
        <ul className="mt-8 space-y-3.5">
          {item.points.map((pt) => (
            <li key={pt} className="flex items-start gap-3 text-[0.9375rem] text-ink-700">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-[3px] shrink-0" aria-hidden="true">
                <path d="M3 8.5l3.2 3.2L13 5" stroke="#1d1d1f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {pt}
            </li>
          ))}
        </ul>
      )}
      <p
        className={`inline-flex items-center gap-2.5 rounded-full border border-black/[0.09] font-medium text-ink-700 ${
          compact ? 'mt-4 px-3.5 py-1.5 text-[0.75rem]' : 'mt-8 px-4 py-2 text-[0.8125rem]'
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-ink-900" />
        {item.outcome}
      </p>
    </div>
  )
}

/**
 * One app screen inside the pinned device. Crossfades with a slight push so
 * the transition reads as the phone changing screens, not a slideshow.
 */
function Layer({
  children,
  p,
  i,
  n,
  soft = false,
  grid = 'even',
}: {
  children: ReactNode
  p: MotionValue<number>
  i: number
  n: number
  /** Text needs a gentler push than a device screen, or it reads as a slideshow. */
  soft?: boolean
  /**
   * 'even' divides the scroll into n equal beats — right when everything
   * crossfades in place (the mobile stage). 'spread' centres beat i at
   * i/(n-1), matching a copy column whose n blocks hand off at (n-1) gaps —
   * the desktop layout. With 'even' there, the last swaps landed a third of
   * a viewport before the copy did, which read as the screen changing while
   * you were still mid-paragraph.
   */
  grid?: 'even' | 'spread'
}) {
  const first = i === 0
  const last = i === n - 1

  // The beat's centre and half-dwell on the chosen grid, and a blend
  // half-width of 24% of the half-dwell — the swap is a narrow window centred
  // exactly where this beat hands off to the next.
  const half = grid === 'spread' ? 0.5 / (n - 1) : 0.5 / n
  const mid = grid === 'spread' ? i / (n - 1) : (i + 0.5) / n
  const h = half * 0.24
  const inA = first ? 0 : mid - half - h
  const inB = first ? 0 : mid - half + h
  const outA = last ? 1 : mid + half - h
  const outB = last ? 1 : mid + half + h
  const shift = soft ? 14 : 26
  const zoom = soft ? 0.02 : 0.05

  /**
   * The window is pinned to 0 and 1 at both ends with held values. Framer
   * extrapolates linearly beyond the outermost stop rather than clamping, so a
   * range that stops early makes a faded-out layer climb back into view as the
   * section finishes — which is exactly what it did before these two guards.
   */
  const win = stops(0, inA, inB, mid, outA, outB, 1)
  const held = (edge: number, peak: number) => [edge, edge, peak, peak, peak, edge, edge]

  const opacity = useTransform(p, win, held(0, 1).map((v, k) => {
    if (first && k < 2) return 1
    if (last && k > 4) return 1
    return v
  }))
  const scale = useTransform(p, win, [
    first ? 1 : 1 + zoom,
    first ? 1 : 1 + zoom,
    1,
    1,
    1,
    last ? 1 : 1 - zoom,
    last ? 1 : 1 - zoom,
  ])
  const y = useTransform(p, win, [
    first ? 0 : shift,
    first ? 0 : shift,
    0,
    0,
    0,
    last ? 0 : -shift,
    last ? 0 : -shift,
  ])
  return (
    <motion.div style={{ opacity, scale, y }} className="absolute inset-0 will-change-transform">
      {children}
    </motion.div>
  )
}
