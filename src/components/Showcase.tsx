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
    kicker: 'The icon',
    title: 'Prime real estate, permanently.',
    body: 'Your brand sits between their bank and their messages — the six inches of glass they check 96 times a day. No algorithm decides who sees you. No bid. No feed.',
    points: ['Your name, your mark', 'Zero acquisition cost per open', 'Nobody can outbid you'],
    outcome: 'Always one tap from a purchase',
    screen: <HomeScreen delay={0.1} />,
  },
  {
    kicker: 'Reordering',
    title: 'One tap to buy again.',
    body: 'Their last order, saved. Their card, saved. Their pickup time, remembered. Repeat purchases die in the gap between wanting something and getting it — so we delete the gap.',
    points: ['Saved order + saved card', 'Reorder in a single tap', 'Live prep and delivery status'],
    outcome: '+3.1 orders per customer, per year',
    screen: <ReorderScreen />,
  },
  {
    kicker: 'Loyalty',
    title: 'A reason to come back on a Tuesday.',
    body: 'Points, streaks and tiers that make the next visit feel earned. Progress a customer can see is progress a customer finishes — and every reward is a scheduled return visit.',
    points: ['Points, tiers and streaks', 'Rewards that expire on purpose', 'Referral credit built in'],
    outcome: '+38% repeat purchase rate',
    screen: <RewardsScreen />,
  },
  {
    kicker: 'Booking',
    title: 'Bookings without the phone call.',
    body: 'Live availability, instant confirmation, deposits taken up front. Your calendar fills while your team keeps working, and the 9pm booker never has to wait until morning.',
    points: ['Real-time availability', 'Deposits and no-show protection', 'Automatic reminders'],
    outcome: 'Fewer no-shows, zero hold music',
    screen: <BookScreen />,
  },
  {
    kicker: 'Spend',
    title: 'A bigger basket, quietly.',
    body: 'Stored payment, memberships and one-tap add-ons. When paying takes no thought, the upsell stops feeling like a sales pitch and starts feeling like a convenience.',
    points: ['Stored cards and wallets', 'Memberships and prepaid balances', 'Add-ons at the moment of yes'],
    outcome: 'Higher average order value',
    screen: <WalletScreen />,
  },
  {
    kicker: 'Push',
    title: 'A channel you own, not rent.',
    body: 'Push arrives on the lock screen. Email arrives in Promotions, three days late, if at all. Once the app is installed you stop paying, every single time, to reach people who already chose you.',
    points: ['Lock-screen reach', 'Segmented by real behaviour', 'No media spend, no algorithm'],
    outcome: 'Roughly 6× the open rate of email',
    screen: <LockScreen />,
  },
]

export default function Showcase() {
  const gridRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: gridRef, offset: ['start start', 'end end'] })
  const [active, setActive] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const i = Math.min(ITEMS.length - 1, Math.max(0, Math.floor(v * ITEMS.length + 0.0001)))
    setActive((prev) => (prev === i ? prev : i))
  })

  return (
    <Section id="product" tone="white">
      <div className="shell pt-[clamp(72px,8.6vw,136px)]">
        <Reveal className="max-w-[54rem]">
          <Eyebrow>The app</Eyebrow>
          <h2 className="type-1 mt-6 text-balance text-ink-900">Six screens that bring them back.</h2>
          <p className="lede mt-6 max-w-[50ch]">
            Ordering, loyalty, booking, payments and push — the work of a loyalty programme, a call centre
            and a marketing budget, in one app. Every build is designed around your business, not a
            template; this is the shape it usually takes.
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
                    <Layer key={it.title} p={scrollYProgress} i={i} n={ITEMS.length}>
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
            <div key={it.title} className="flex h-[100svh] flex-col justify-center">
              <Copy item={it} />
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Mobile: one device per beat ---------- */}
      <div className="shell mt-14 space-y-24 lg:hidden">
        {ITEMS.map((it) => (
          <div key={it.title}>
            <Reveal>
              <div className="relative mx-auto w-[min(268px,72vw)]">
                <Phone>{it.screen}</Phone>
                <div className="pointer-events-none absolute -bottom-6 left-1/2 h-10 w-[120%] -translate-x-1/2 rounded-[50%] bg-ink-900/15 blur-2xl" />
              </div>
            </Reveal>
            <Reveal delay={0.06} className="mt-14">
              <Copy item={it} />
            </Reveal>
          </div>
        ))}
      </div>

      <div className="h-[clamp(72px,8.6vw,136px)]" />
    </Section>
  )
}

function Copy({ item }: { item: Item }) {
  return (
    <div className="max-w-[34rem]">
      <Eyebrow>{item.kicker}</Eyebrow>
      <h3 className="type-2 mt-5 text-balance text-ink-900">{item.title}</h3>
      <p className="lede mt-5">{item.body}</p>
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
      <p className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-black/[0.09] px-4 py-2 text-[0.8125rem] font-medium text-ink-700">
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
function Layer({ children, p, i, n }: { children: ReactNode; p: MotionValue<number>; i: number; n: number }) {
  const step = 1 / n
  const s = i * step
  const first = i === 0
  const last = i === n - 1

  // The first screen is already on when the section pins; the last one stays on
  // when it releases. Everything else crossfades through its own window.
  const inA = first ? 0 : s - step * 0.34
  const inB = first ? 0 : s + step * 0.14
  const outA = last ? 1 : s + step * 0.86
  const outB = last ? 1 : s + step * 1.34

  const opacity = useTransform(p, stops(inA, inB, outA, outB), [first ? 1 : 0, 1, 1, last ? 1 : 0])
  const scale = useTransform(p, stops(inA, s + step * 0.5, outB), [first ? 1 : 1.05, 1, last ? 1 : 0.96])
  const y = useTransform(p, stops(inA, s + step * 0.5, outB), [first ? 0 : 26, 0, last ? 0 : -26])
  return (
    <motion.div style={{ opacity, scale, y }} className="absolute inset-0 will-change-transform">
      {children}
    </motion.div>
  )
}
