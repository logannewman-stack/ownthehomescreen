import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { HomeBar, Island, StatusBar } from './Phone'

/* ================================================================== *
 * Line-art glyphs used inside the app UI and on the icon grid.
 * ================================================================== */

const GLYPHS: Record<string, ReactNode> = {
  bag: (
    <>
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9.5 8V6.5a2.5 2.5 0 0 1 5 0V8" />
    </>
  ),
  star: <path d="M12 4.5l2.3 4.9 5.2.7-3.8 3.7.9 5.2-4.6-2.5-4.6 2.5.9-5.2L4.5 10l5.2-.7L12 4.5Z" />,
  calendar: (
    <>
      <rect x="4.5" y="6" width="15" height="13.5" rx="2.5" />
      <path d="M4.5 10.5h15M9 4.5V7M15 4.5V7" />
    </>
  ),
  card: (
    <>
      <rect x="3.5" y="6.5" width="17" height="11" rx="2.5" />
      <path d="M3.5 10.5h17M7 14.5h3" />
    </>
  ),
  chat: <path d="M20 12.5c0 3.6-3.6 6.5-8 6.5a9.6 9.6 0 0 1-2.6-.35L5 20.5l1-3.3A6.2 6.2 0 0 1 4 12.5C4 8.9 7.6 6 12 6s8 2.9 8 6.5Z" />,
  user: (
    <>
      <circle cx="12" cy="9" r="3.4" />
      <path d="M5.5 20c1-3.4 3.5-5 6.5-5s5.5 1.6 6.5 5" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 4v2.4M12 17.6V20M4 12h2.4M17.6 12H20M6.5 6.5l1.7 1.7M15.8 15.8l1.7 1.7M17.5 6.5l-1.7 1.7M8.2 15.8l-1.7 1.7" />
    </>
  ),
  camera: (
    <>
      <rect x="3.5" y="7" width="17" height="12" rx="3" />
      <circle cx="12" cy="13" r="3.2" />
      <path d="M9 7l1.2-2h3.6L15 7" />
    </>
  ),
  music: (
    <>
      <path d="M9 17.5V7.5l9-2v10" />
      <circle cx="6.8" cy="17.6" r="2.3" />
      <circle cx="15.8" cy="15.6" r="2.3" />
    </>
  ),
  photo: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
      <path d="M3.5 15l4.5-4 4 3.5 3-2.5 5 4.5" />
      <circle cx="8.5" cy="9.5" r="1.3" />
    </>
  ),
  map: (
    <>
      <path d="M12 20s6.5-6 6.5-10a6.5 6.5 0 1 0-13 0C5.5 14 12 20 12 20Z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  mail: (
    <>
      <rect x="3.5" y="6" width="17" height="12" rx="2.5" />
      <path d="M4 8l8 5.5L20 8" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="7.5" />
      <path d="M12 8v4.3l3 1.8" />
    </>
  ),
  heart: <path d="M12 19.5S4.5 15 4.5 10.2A3.9 3.9 0 0 1 12 8.3a3.9 3.9 0 0 1 7.5 1.9C19.5 15 12 19.5 12 19.5Z" />,
  gift: (
    <>
      <rect x="4" y="9.5" width="16" height="10" rx="2" />
      <path d="M4 13.5h16M12 9.5v10" />
      <path d="M12 9.5S10.8 5 8.6 5a2 2 0 0 0 0 4.5M12 9.5S13.2 5 15.4 5a2 2 0 0 1 0 4.5" />
    </>
  ),
  bell: (
    <>
      <path d="M7 16.5v-4.8a5 5 0 0 1 10 0v4.8M5.5 16.5h13" />
      <path d="M10.3 19a1.9 1.9 0 0 0 3.4 0" />
    </>
  ),
  truck: (
    <>
      <path d="M3.5 8.5h9.5v8H3.5zM13 11.5h4l3 3v2h-7z" />
      <circle cx="7" cy="17.5" r="1.8" />
      <circle cx="16.5" cy="17.5" r="1.8" />
    </>
  ),
  coffee: (
    <>
      <path d="M5.5 8h11v4.5a5.5 5.5 0 0 1-11 0V8Z" />
      <path d="M16.5 9.5h1.8a2.2 2.2 0 0 1 0 4.4h-1.8M5 20h12" />
    </>
  ),
  sparkle: <path d="M12 4.5l1.6 4.4 4.4 1.6-4.4 1.6L12 16.5l-1.6-4.4L6 10.5l4.4-1.6L12 4.5Z" />,
  home: <path d="M4.5 11 12 5l7.5 6v7.5a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5V11Z" />,
  check: <path d="M5.5 12.5l4 4 9-9" />,
  plus: <path d="M12 6.5v11M6.5 12h11" />,
  chevron: <path d="M9.5 6l6 6-6 6" />,
  arrow: <path d="M5 12h13m0 0-5-5m5 5-5 5" />,
  wallet: (
    <>
      <rect x="3.5" y="6.5" width="17" height="12" rx="2.5" />
      <path d="M15 12.5h3.5" />
    </>
  ),
}

export function Glyph({
  name,
  className = '',
  width = 1.6,
}: {
  name: keyof typeof GLYPHS | string
  className?: string
  width?: number
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {GLYPHS[name] ?? GLYPHS.sparkle}
    </svg>
  )
}

/* ================================================================== *
 * The demo client's brand. The site chrome stays monochrome; inside the
 * device everything interactive carries the client's color, because the
 * pitch is "your brand lives here" — not ours.
 * ================================================================== */

const BRAND = '#114559' // deep petrol — Northside Detail Co.

export function ClientIcon({ className = '', tone = 'brand' }: { className?: string; tone?: 'brand' | 'light' }) {
  const bg = tone === 'brand' ? BRAND : '#ffffff'
  const fg = tone === 'brand' ? '#ffffff' : BRAND
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="15" fill={bg} />
      <path
        d="M29 15C29 15 16.5 29 16.5 38a12.5 12.5 0 0 0 25 0C41.5 29 29 15 29 15Z"
        fill="none"
        stroke={fg}
        strokeWidth="3.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M46.5 15l1.7 4.3 4.3 1.7-4.3 1.7-1.7 4.3-1.7-4.3-4.3-1.7 4.3-1.7Z" fill={fg} />
    </svg>
  )
}

function CountUp({
  to,
  on,
  prefix = '',
  delay = 0,
  duration = 1.5,
  className = '',
}: {
  to: number
  on: boolean
  prefix?: string
  delay?: number
  duration?: number
  className?: string
}) {
  const [v, setV] = useState(0)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (!on) return
    if (reduce) {
      setV(to)
      return
    }
    const c = animate(0, to, { duration, delay, ease: [0.16, 1, 0.3, 1], onUpdate: (x) => setV(Math.round(x)) })
    return () => c.stop()
  }, [on, to, reduce, delay, duration])
  return (
    <span className={className}>
      {prefix}
      {v.toLocaleString('en-US')}
    </span>
  )
}

/* ================================================================== *
 * Shared app furniture
 * ================================================================== */

function AppHeader({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <div className="flex items-end justify-between px-[6.5cqw] pb-[3cqw] pt-[2cqw]">
      <h4 className="font-display text-[8.6cqw] font-semibold leading-none tracking-[-0.04em] text-ink-900">{title}</h4>
      {right}
    </div>
  )
}

function TabBar({ active = 0 }: { active?: number }) {
  const tabs = [
    { icon: 'home', label: 'Home' },
    { icon: 'bag', label: 'Order' },
    { icon: 'star', label: 'Rewards' },
    { icon: 'user', label: 'Account' },
  ]
  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-black/[0.07] bg-white/85 px-[4cqw] pb-[6.5cqw] pt-[2.4cqw] backdrop-blur-xl">
      <div className="flex items-start justify-between">
        {tabs.map((t, i) => (
          <div
            key={t.label}
            className={`flex flex-1 flex-col items-center gap-[1cqw] ${i === active ? 'text-[#114559]' : 'text-[#b6b6bc]'}`}
          >
            <Glyph name={t.icon} className="h-[6.2cqw] w-[6.2cqw]" width={i === active ? 1.9 : 1.6} />
            <span className={`text-[2.6cqw] tracking-[-0.01em] ${i === active ? 'font-semibold' : 'font-medium'}`}>
              {t.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[5cqw] border border-black/[0.055] bg-white shadow-[0_2cqw_5cqw_-3cqw_rgba(0,0,0,0.14)] ${className}`}>
      {children}
    </div>
  )
}

function PrimaryButton({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`flex h-[13cqw] items-center justify-center gap-[2cqw] rounded-full bg-[#114559] text-[4cqw] font-semibold tracking-[-0.015em] text-white ${className}`}
    >
      {children}
    </div>
  )
}

/* ================================================================== *
 * 1 — Home screen. The whole pitch in one image.
 * ================================================================== */

const GRID_APPS = [
  'clock',
  'photo',
  'map',
  'camera',
  'mail',
  'music',
  'chat',
  'calendar',
  'card',
  'heart',
  'gear',
  'bag',
  'truck',
  'gift',
  'bell',
  'wallet',
  'star',
  'user',
  'sparkle',
]

export function HomeScreen({
  brandName = 'Northside',
  notify = true,
  delay = 0,
}: {
  brandName?: string
  notify?: boolean
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduce = useReducedMotion()
  const on = reduce || inView

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      {/* Wallpaper */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fcfcfe] via-[#f1f1f4] to-[#e3e3e9]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 70% at 22% 8%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 55%), radial-gradient(90% 55% at 85% 100%, rgba(0,0,0,0.055) 0%, rgba(0,0,0,0) 60%)',
        }}
      />

      <Island />
      <div className="relative flex h-full flex-col">
        <StatusBar />

        {/* Icon grid — the brand app holds slot one. The top of the wallpaper is
            left clear so an arriving banner never covers it. */}
        <div className="grid grow grid-cols-4 content-start gap-x-[5cqw] gap-y-[6.4cqw] px-[7cqw] pt-[26cqw]">
          <IconTile
            label={brandName}
            brand
            on={on}
            delay={delay + 0.75}
            emphasis
          />
          {GRID_APPS.map((g, i) => (
            <IconTile key={g} label="" glyph={g} on={on} delay={delay + 0.12 + i * 0.035} />
          ))}
        </div>

        {/* Page dots */}
        <div className="flex items-center justify-center gap-[1.6cqw] pb-[3.4cqw]">
          <span className="h-[1.5cqw] w-[1.5cqw] rounded-full bg-ink-900/70" />
          <span className="h-[1.5cqw] w-[1.5cqw] rounded-full bg-ink-900/20" />
          <span className="h-[1.5cqw] w-[1.5cqw] rounded-full bg-ink-900/20" />
        </div>

        {/* Dock */}
        <div className="px-[4.5cqw] pb-[7cqw]">
          <div className="flex items-center justify-around rounded-[8cqw] border border-white/60 bg-white/45 px-[3cqw] py-[3cqw] backdrop-blur-xl">
            {['chat', 'mail', 'music'].map((g) => (
              <IconTile key={g} label="" glyph={g} on={on} delay={delay + 0.5} dock />
            ))}
            <IconTile label="" brand on={on} delay={delay + 0.95} dock />
          </div>
        </div>
      </div>

      {notify ? <NotificationStack delay={delay + 1.5} brandName={brandName} /> : null}
      <HomeBar />
    </div>
  )
}

function IconTile({
  label,
  glyph,
  brand = false,
  on,
  delay,
  dock = false,
  emphasis = false,
}: {
  label: string
  glyph?: string
  brand?: boolean
  on: boolean
  delay: number
  dock?: boolean
  emphasis?: boolean
}) {
  const size = dock ? 'h-[15cqw] w-[15cqw]' : 'h-[16.5cqw] w-[16.5cqw]'
  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={on ? { opacity: 1, scale: 1 } : undefined}
        transition={{
          type: 'spring',
          stiffness: brand ? 260 : 320,
          damping: brand ? 14 : 24,
          delay,
        }}
      >
        {emphasis ? (
          <span className="absolute inset-0 rounded-[4.6cqw] bg-[#114559]/30 animate-ring" style={{ animationDelay: `${delay}s` }} />
        ) : null}
        {brand ? (
          <>
            <ClientIcon className={`relative ${size} rounded-[4.6cqw] shadow-icon`} />
            {emphasis ? (
              <motion.span
                className="absolute -right-[1.6cqw] -top-[1.6cqw] flex h-[5cqw] min-w-[5cqw] items-center justify-center rounded-full bg-[#114559] px-[1.2cqw] text-[2.7cqw] font-semibold leading-none text-white shadow-[0_1cqw_2cqw_rgba(0,0,0,0.22)]"
                initial={{ scale: 0 }}
                animate={on ? { scale: 1 } : undefined}
                transition={{ type: 'spring', stiffness: 400, damping: 18, delay: delay + 1.15 }}
              >
                1
              </motion.span>
            ) : null}
          </>
        ) : (
          <div
            className={`relative flex ${size} items-center justify-center rounded-[4.6cqw] border border-white/70 bg-white/70 text-[#b9b9c1] shadow-[0_1.5cqw_3cqw_-1.5cqw_rgba(0,0,0,0.18)] backdrop-blur-sm`}
          >
            <Glyph name={glyph ?? 'sparkle'} className="h-[8cqw] w-[8cqw]" width={1.5} />
          </div>
        )}
      </motion.div>
      {label ? (
        <motion.span
          className="mt-[1.7cqw] text-[2.9cqw] font-medium tracking-[-0.01em] text-ink-900/75"
          initial={{ opacity: 0 }}
          animate={on ? { opacity: 1 } : undefined}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
        >
          {label}
        </motion.span>
      ) : (
        <span className="mt-[1.7cqw] h-[3.6cqw] w-[9cqw] rounded-full bg-ink-900/[0.07]" />
      )}
    </div>
  )
}

/** Rotating push notification — the retention loop, visible. */
function NotificationStack({ delay = 0, brandName = 'Northside' }: { delay?: number; brandName?: string }) {
  const messages = [
    { t: 'Time for your usual wash', b: 'Signature wash · Thu 4:30 is open' },
    { t: 'You have 2,480 points', b: '320 more unlocks a free wash' },
    { t: 'Tuesday, 4:30pm still works?', b: 'Tap to confirm your booking' },
  ]
  const [i, setI] = useState(0)
  const [shown, setShown] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    const t = window.setTimeout(() => setShown(true), delay * 1000)
    return () => window.clearTimeout(t)
  }, [delay])

  useEffect(() => {
    if (reduce || !shown) return
    const id = window.setInterval(() => setI((v) => (v + 1) % messages.length), 4200)
    return () => window.clearInterval(id)
  }, [reduce, shown, messages.length])

  const m = messages[i]

  return (
    <div className="absolute left-0 right-0 top-[15.5cqw] z-30 px-[4cqw]">
      <motion.div
        key={i}
        initial={{ opacity: 0, y: -16, scale: 0.96, filter: 'blur(6px)' }}
        animate={shown ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : undefined}
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        className="flex items-center gap-[2.8cqw] rounded-[5.4cqw] border border-white/70 bg-white/80 p-[2.8cqw] shadow-[0_4cqw_10cqw_-4cqw_rgba(0,0,0,0.28)] backdrop-blur-2xl"
      >
        <ClientIcon className="h-[9cqw] w-[9cqw] shrink-0 rounded-[2.7cqw]" />
        <div className="min-w-0 grow">
          <div className="flex items-baseline justify-between gap-[2cqw]">
            <span className="truncate text-[3.2cqw] font-semibold tracking-[-0.015em] text-ink-900">{brandName}</span>
            <span className="shrink-0 text-[2.8cqw] font-medium text-ink-900/40">now</span>
          </div>
          <p className="mt-[0.4cqw] truncate text-[3.3cqw] font-medium tracking-[-0.015em] text-ink-900">{m.t}</p>
          <p className="truncate text-[3cqw] text-ink-900/55">{m.b}</p>
        </div>
      </motion.div>
    </div>
  )
}

/* ================================================================== *
 * 2 — One-tap reorder
 * ================================================================== */

export function ReorderScreen() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduce = useReducedMotion()
  const on = reduce || inView

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden bg-[#fbfbfd]">
      <Island />
      <StatusBar />
      <AppHeader
        title="Good morning"
        right={
          <div className="flex h-[9cqw] w-[9cqw] items-center justify-center rounded-full bg-white shadow-[0_1.5cqw_3cqw_-1.5cqw_rgba(0,0,0,0.2)]">
            <Glyph name="user" className="h-[5cqw] w-[5cqw] text-ink-900" />
          </div>
        }
      />

      <div className="space-y-[3.4cqw] px-[5.5cqw]">
        {/* The hero card: their usual service, one tap away */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={on ? { opacity: 1, y: 0 } : undefined}
          transition={{ type: 'spring', stiffness: 200, damping: 26, delay: 0.15 }}
        >
        <Card className="overflow-hidden p-[4.6cqw]">
          <div className="flex items-center justify-between">
            <span className="text-[2.9cqw] font-semibold uppercase tracking-[0.16em] text-ink-900/40">Your usual</span>
            <span className="flex items-center gap-[1.2cqw] rounded-full bg-[#114559]/[0.08] px-[2.4cqw] py-[1cqw] text-[2.8cqw] font-semibold text-[#114559]">
              <Glyph name="calendar" className="h-[3.4cqw] w-[3.4cqw]" />Thu 4:30
            </span>
          </div>

          <div className="mt-[3.4cqw] space-y-[2.6cqw]">
            {[
              { icon: 'sparkle', n: 'Signature wash', d: 'Exterior · ceramic boost' },
              { icon: 'star', n: 'Interior refresh', d: 'Vacuum + trim wipe-down' },
            ].map((it) => (
              <div key={it.n} className="flex items-center gap-[3cqw]">
                <div className="flex h-[10cqw] w-[10cqw] items-center justify-center rounded-[3.2cqw] bg-[#EAF2F4] text-[#114559]">
                  <Glyph name={it.icon} className="h-[5.4cqw] w-[5.4cqw]" />
                </div>
                <div className="grow">
                  <p className="text-[3.7cqw] font-semibold tracking-[-0.015em] text-ink-900">{it.n}</p>
                  <p className="text-[3cqw] text-ink-900/45">{it.d}</p>
                </div>
                <span className="text-[3.4cqw] font-medium text-ink-900/60">×1</span>
              </div>
            ))}
          </div>

          <div className="mt-[3.8cqw] flex items-center justify-between border-t border-black/[0.06] pt-[3.4cqw]">
            <div>
              <p className="text-[2.8cqw] font-medium text-ink-900/45">Total with points</p>
              <p className="font-display text-[5.4cqw] font-semibold tracking-[-0.03em] text-ink-900">$62.40</p>
            </div>
            <span className="text-[2.9cqw] font-medium text-ink-900/35 line-through">$69.90</span>
          </div>

          <div className="relative mt-[3.4cqw] overflow-hidden rounded-full">
            <PrimaryButton>
              Reorder
              <Glyph name="arrow" className="h-[4.4cqw] w-[4.4cqw]" width={2} />
            </PrimaryButton>
            {/* One quiet sheen once the card has settled — an invitation, not a strobe */}
            <motion.span
              className="pointer-events-none absolute inset-y-0 w-[38%] skew-x-[-18deg] bg-white/25 blur-[2px]"
              initial={{ left: '-45%' }}
              animate={on ? { left: '125%' } : undefined}
              transition={{ duration: 1.1, delay: 1.3, ease: [0.6, 0, 0.2, 1] }}
            />
          </div>
        </Card>
        </motion.div>

        {/* Recent */}
        <div>
          <p className="px-[1cqw] pb-[2cqw] pt-[1cqw] text-[2.9cqw] font-semibold uppercase tracking-[0.16em] text-ink-900/40">
            Order again
          </p>
          <Card className="divide-y divide-black/[0.055] overflow-hidden">
            {[
              { n: 'Signature wash', d: 'Last Thursday', p: '$58.00' },
              { n: 'Ceramic boost add-on', d: 'Aug 2', p: '$89.00' },
              { n: 'Interior refresh', d: 'Jul 18', p: '$24.00' },
              { n: 'Express wash', d: 'Jul 3', p: '$19.00' },
            ].map((r) => (
              <div key={r.n} className="flex items-center gap-[3cqw] px-[4.2cqw] py-[3.1cqw]">
                <div className="grow">
                  <p className="text-[3.5cqw] font-semibold tracking-[-0.015em] text-ink-900">{r.n}</p>
                  <p className="text-[2.9cqw] text-ink-900/45">{r.d}</p>
                </div>
                <span className="text-[3.2cqw] font-medium text-ink-900/55">{r.p}</span>
                <Glyph name="chevron" className="h-[3.6cqw] w-[3.6cqw] text-ink-900/25" width={2.2} />
              </div>
            ))}
          </Card>
          <p className="pt-[3.4cqw] text-center text-[2.9cqw] font-medium text-ink-900/35">
            Points apply automatically at checkout
          </p>
        </div>
      </div>

      <TabBar active={1} />
      <HomeBar />
    </div>
  )
}

/* ================================================================== *
 * 3 — Rewards / loyalty
 * ================================================================== */

export function RewardsScreen() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduce = useReducedMotion()
  const C = 2 * Math.PI * 43
  const pct = 0.78

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden bg-[#fbfbfd]">
      <Island />
      <StatusBar />
      <AppHeader
        title="Rewards"
        right={
          <span className="mb-[1cqw] rounded-full border border-[#C4913C]/45 bg-[#C4913C]/[0.08] px-[2.8cqw] py-[1.1cqw] text-[2.8cqw] font-semibold uppercase tracking-[0.14em] text-[#8A6420]">
            Gold
          </span>
        }
      />

      <div className="px-[5.5cqw]">
        <Card className="p-[5cqw] text-center">
          <div className="relative mx-auto h-[42cqw] w-[42cqw]">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <circle cx="50" cy="50" r="43" fill="none" stroke="#E3EDF0" strokeWidth="6" />
              <motion.circle
                cx="50"
                cy="50"
                r="43"
                fill="none"
                stroke="#114559"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={C}
                initial={{ strokeDashoffset: C }}
                animate={reduce || inView ? { strokeDashoffset: C * (1 - pct) } : undefined}
                transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <CountUp
                to={2480}
                on={reduce || inView}
                delay={0.25}
                duration={1.6}
                className="font-display text-[11cqw] font-semibold leading-none tracking-[-0.045em] text-ink-900"
              />
              <span className="mt-[1.4cqw] text-[2.9cqw] font-semibold uppercase tracking-[0.16em] text-ink-900/40">
                points
              </span>
            </div>
          </div>
          <p className="mx-auto mt-[3.4cqw] max-w-[70cqw] text-[3.4cqw] font-medium leading-[1.35] tracking-[-0.015em] text-ink-900/60">
            320 points from your next free wash
          </p>
        </Card>

        <div className="mt-[3.4cqw] grid grid-cols-3 gap-[2.6cqw]">
          {[
            { icon: 'sparkle', n: 'Free wash', p: '2,800' },
            { icon: 'gift', n: '20% off add-ons', p: '3,500' },
            { icon: 'clock', n: 'Priority slot', p: '4,000' },
          ].map((r, i) => (
            <Card key={r.n} className={`p-[3.2cqw] text-center ${i === 0 ? 'border-[#114559]/30' : ''}`}>
              <div className="mx-auto flex h-[9.6cqw] w-[9.6cqw] items-center justify-center rounded-full bg-[#EAF2F4] text-[#114559]">
                <Glyph name={r.icon} className="h-[5cqw] w-[5cqw]" />
              </div>
              <p className="mt-[2cqw] text-[3cqw] font-semibold leading-tight tracking-[-0.015em] text-ink-900">{r.n}</p>
              <p className="mt-[0.5cqw] text-[2.7cqw] font-medium text-ink-900/40">{r.p} pts</p>
            </Card>
          ))}
        </div>

        <Card className="mt-[3.4cqw] p-[4.2cqw]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[3.5cqw] font-semibold tracking-[-0.015em] text-ink-900">Visit streak</p>
              <p className="text-[2.9cqw] text-ink-900/45">7 weeks in a row</p>
            </div>
            {/* Column heights are static; only scaleY animates, so the bars
                stay crisp and the browser never re-lays-out the card. */}
            <div className="flex h-[14cqw] items-end gap-[1.4cqw]">
              {[38, 52, 44, 66, 74, 88, 100].map((h, i) => (
                <motion.span
                  key={i}
                  className="w-[3cqw] origin-bottom rounded-t-[1cqw] bg-[#114559]"
                  style={{ height: `${h * 0.14}cqw`, opacity: i === 6 ? 1 : 0.16 + i * 0.045 }}
                  initial={{ scaleY: 0 }}
                  animate={reduce || inView ? { scaleY: 1 } : undefined}
                  transition={{ duration: 0.8, delay: 0.4 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                />
              ))}
            </div>
          </div>
        </Card>
      </div>

      <TabBar active={2} />
      <HomeBar />
    </div>
  )
}

/* ================================================================== *
 * 4 — Booking
 * ================================================================== */

export function BookScreen() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduce = useReducedMotion()
  const on = reduce || inView
  // The 4:30 slot "gets chosen" a beat after the screen settles, and the
  // confirmation check answers it — the booking flow acting itself out.
  const [picked, setPicked] = useState(false)
  useEffect(() => {
    if (!on) return
    if (reduce) {
      setPicked(true)
      return
    }
    const t = window.setTimeout(() => setPicked(true), 950)
    return () => window.clearTimeout(t)
  }, [on, reduce])

  const days = [
    { d: 'M', n: 18 },
    { d: 'T', n: 19 },
    { d: 'W', n: 20 },
    { d: 'T', n: 21 },
    { d: 'F', n: 22 },
    { d: 'S', n: 23 },
    { d: 'S', n: 24 },
  ]
  const slots = ['9:00', '10:30', '12:00', '1:30', '4:30', '6:00']

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden bg-[#fbfbfd]">
      <Island />
      <StatusBar />
      <AppHeader title="Book" />

      <div className="px-[5.5cqw]">
        <p className="pb-[2.4cqw] text-[2.9cqw] font-semibold uppercase tracking-[0.16em] text-ink-900/40">August</p>
        <div className="flex justify-between">
          {days.map((day, i) => (
            <div
              key={day.n}
              className={`flex h-[15cqw] w-[11.4cqw] flex-col items-center justify-center rounded-[4cqw] ${
                i === 3 ? 'bg-[#114559] text-white' : 'bg-white text-ink-900 shadow-[0_1.5cqw_3cqw_-2cqw_rgba(0,0,0,0.14)]'
              }`}
            >
              <span className={`text-[2.7cqw] font-medium ${i === 3 ? 'text-white/60' : 'text-ink-900/40'}`}>{day.d}</span>
              <span className="mt-[0.6cqw] text-[4.4cqw] font-semibold tracking-[-0.03em]">{day.n}</span>
            </div>
          ))}
        </div>

        <p className="pb-[2.4cqw] pt-[4.4cqw] text-[2.9cqw] font-semibold uppercase tracking-[0.16em] text-ink-900/40">
          Available today
        </p>
        <div className="grid grid-cols-3 gap-[2.6cqw]">
          {slots.map((s, i) => (
            <motion.div
              key={s}
              initial={{ opacity: 0, y: 8 }}
              animate={on ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.45, delay: 0.12 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className={`flex h-[11cqw] items-center justify-center rounded-[3.6cqw] text-[3.6cqw] font-semibold tracking-[-0.015em] transition-colors duration-500 ${
                i === 4 && picked
                  ? 'bg-[#114559] text-white'
                  : i === 1
                    ? 'border border-black/[0.06] bg-white/60 text-ink-900/25 line-through'
                    : 'border border-black/[0.06] bg-white text-ink-900'
              }`}
            >
              {s}
            </motion.div>
          ))}
        </div>

        <Card className="mt-[4.4cqw] p-[4.4cqw]">
          <div className="flex items-start gap-[3cqw]">
            <div className="flex h-[11cqw] w-[11cqw] items-center justify-center rounded-[3.4cqw] bg-[#EAF2F4] text-[#114559]">
              <Glyph name="sparkle" className="h-[5.6cqw] w-[5.6cqw]" />
            </div>
            <div className="grow">
              <p className="text-[3.8cqw] font-semibold tracking-[-0.015em] text-ink-900">Full interior detail</p>
              <p className="mt-[0.4cqw] text-[3cqw] text-ink-900/45">Thu 21 Aug · 4:30pm · 2h</p>
              <div className="mt-[2.2cqw] flex items-center gap-[1.6cqw]">
                <span className="rounded-full bg-[#114559]/[0.08] px-[2.4cqw] py-[1cqw] text-[2.7cqw] font-semibold text-[#114559]">
                  Saved card
                </span>
                <span className="rounded-full bg-[#114559]/[0.08] px-[2.4cqw] py-[1cqw] text-[2.7cqw] font-semibold text-[#114559]">
                  −400 pts
                </span>
              </div>
            </div>
          </div>
          <PrimaryButton className="mt-[4cqw]">
            <motion.span
              className="flex"
              initial={{ scale: 0 }}
              animate={picked ? { scale: 1 } : undefined}
              transition={{ type: 'spring', stiffness: 420, damping: 16 }}
            >
              <Glyph name="check" className="h-[4.2cqw] w-[4.2cqw]" width={2.2} />
            </motion.span>
            Confirm booking
          </PrimaryButton>
          <p className="mt-[2.4cqw] text-center text-[2.8cqw] font-medium text-ink-900/40">
            No phone call. No hold music.
          </p>
        </Card>

        <Card className="mt-[3.4cqw] divide-y divide-black/[0.055]">
          {[
            { icon: 'sparkle', n: 'Add interior scent', d: '+$12' },
            { icon: 'bell', n: 'Remind me the night before', d: 'On' },
          ].map((r) => (
            <div key={r.n} className="flex items-center gap-[3cqw] px-[4.2cqw] py-[3.2cqw]">
              <div className="flex h-[9cqw] w-[9cqw] items-center justify-center rounded-[2.8cqw] bg-[#EAF2F4] text-[#114559]">
                <Glyph name={r.icon} className="h-[4.6cqw] w-[4.6cqw]" />
              </div>
              <p className="grow text-[3.4cqw] font-semibold tracking-[-0.015em] text-ink-900">{r.n}</p>
              <span className="text-[3cqw] font-medium text-ink-900/50">{r.d}</span>
            </div>
          ))}
        </Card>
      </div>

      <TabBar active={0} />
      <HomeBar />
    </div>
  )
}

/* ================================================================== *
 * 5 — Lock screen: the channel you don't rent
 * ================================================================== */

export function LockScreen() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduce = useReducedMotion()
  const on = reduce || inView

  const notes = [
    { t: 'Rain tomorrow — move your wash?', b: 'Two taps to reschedule. Free of charge.', time: 'now' },
    { t: 'Your reward expires Sunday', b: 'A free interior refresh is waiting.', time: '2m' },
    { t: "It's been 3 weeks", b: 'Your usual wash is one tap away.', time: '9m' },
  ]

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden bg-[#0b0b0c]">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(90% 55% at 50% -5%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 60%), radial-gradient(70% 40% at 20% 105%, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 65%)',
        }}
      />
      <Island tone="light" />
      <div className="relative flex h-full flex-col">
        <StatusBar tone="light" />

        <div className="pt-[6cqw] text-center text-white">
          <p className="text-[4cqw] font-medium tracking-[-0.01em] text-white/60">Thursday, 21 August</p>
          <p className="font-display text-[24cqw] font-semibold leading-[0.9] tracking-[-0.055em]">9:41</p>
        </div>

        <div className="mt-[8cqw] space-y-[2.6cqw] px-[4.5cqw]">
          {notes.map((n, i) => (
            <motion.div
              key={n.t}
              initial={{ opacity: 0, y: 26, scale: 0.97, filter: 'blur(8px)' }}
              animate={on ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' } : undefined}
              transition={{ type: 'spring', stiffness: 190, damping: 24, delay: 0.25 + i * 0.16 }}
              className="flex items-start gap-[3cqw] rounded-[6cqw] border border-white/10 bg-white/[0.13] p-[3.4cqw] backdrop-blur-2xl"
            >
              <ClientIcon className="h-[10cqw] w-[10cqw] shrink-0 rounded-[3cqw]" tone="light" />
              <div className="min-w-0 grow pt-[0.4cqw]">
                <div className="flex items-baseline justify-between gap-[2cqw]">
                  <span className="truncate text-[3.3cqw] font-semibold uppercase tracking-[0.1em] text-white/70">
                    Northside
                  </span>
                  <span className="shrink-0 text-[2.9cqw] font-medium text-white/45">{n.time}</span>
                </div>
                <p className="mt-[0.8cqw] text-[3.5cqw] font-semibold leading-[1.25] tracking-[-0.015em] text-white">
                  {n.t}
                </p>
                <p className="mt-[0.5cqw] text-[3.1cqw] leading-[1.3] text-white/60">{n.b}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between px-[9cqw] pb-[9cqw] text-white">
          <div className="flex h-[12cqw] w-[12cqw] items-center justify-center rounded-full bg-white/15 backdrop-blur-xl">
            <Glyph name="camera" className="h-[6cqw] w-[6cqw]" />
          </div>
          <div className="flex h-[12cqw] w-[12cqw] items-center justify-center rounded-full bg-white/15 backdrop-blur-xl">
            <Glyph name="wallet" className="h-[6cqw] w-[6cqw]" />
          </div>
        </div>
      </div>
      <HomeBar tone="light" />
    </div>
  )
}

/* ================================================================== *
 * 6 — In-app spend: stored card, subscription, upsell
 * ================================================================== */

export function WalletScreen() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduce = useReducedMotion()
  const on = reduce || inView

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden bg-[#fbfbfd]">
      <Island />
      <StatusBar />
      <AppHeader title="Checkout" />

      <div className="space-y-[3.4cqw] px-[5.5cqw]">
        <div className="relative overflow-hidden rounded-[6cqw] bg-[#114559] p-[5cqw] text-white">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(80% 60% at 85% 0%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 60%)',
            }}
          />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-[2.8cqw] font-semibold uppercase tracking-[0.18em] text-white/50">Balance</p>
              <p className="mt-[1.4cqw] font-display text-[10cqw] font-semibold leading-none tracking-[-0.045em]">
                $48.20
              </p>
            </div>
            <ClientIcon className="h-[10cqw] w-[10cqw] rounded-[3cqw]" tone="light" />
          </div>
          <div className="relative mt-[5cqw] flex items-center justify-between">
            <span className="text-[3.2cqw] font-medium tracking-[0.16em] text-white/70">•••• 4417</span>
            <span className="rounded-full bg-white/15 px-[2.8cqw] py-[1.2cqw] text-[2.8cqw] font-semibold">
              Auto top-up on
            </span>
          </div>
        </div>

        <Card className="p-[4.4cqw]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[3.7cqw] font-semibold tracking-[-0.015em] text-ink-900">Shine Club membership</p>
              <p className="mt-[0.4cqw] text-[3cqw] text-ink-900/45">$39/mo · renews 1 Sept</p>
            </div>
            <div className="relative h-[7cqw] w-[12cqw] rounded-full bg-[#114559]">
              <motion.span
                className="absolute right-[0.8cqw] top-[0.8cqw] h-[5.4cqw] w-[5.4cqw] rounded-full bg-white"
                initial={{ x: '-88%' }}
                animate={on ? { x: '0%' } : undefined}
                transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.55 }}
              />
            </div>
          </div>
          <div className="mt-[3.4cqw] grid grid-cols-3 gap-[2.4cqw] border-t border-black/[0.06] pt-[3.4cqw] text-center">
            {[
              { k: 'Saved', v: '$212' },
              { k: 'Visits', v: '34' },
              { k: 'Since', v: 'Jan' },
            ].map((s) => (
              <div key={s.k}>
                <p className="font-display text-[5cqw] font-semibold tracking-[-0.03em] text-ink-900">
                  {s.k === 'Saved' ? <CountUp to={212} on={on} prefix="$" delay={0.7} duration={1.2} /> : s.v}
                </p>
                <p className="mt-[0.4cqw] text-[2.7cqw] font-medium uppercase tracking-[0.12em] text-ink-900/40">{s.k}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-[4.4cqw]">
          <p className="text-[2.9cqw] font-semibold uppercase tracking-[0.16em] text-ink-900/40">Add to order</p>
          <div className="mt-[2.8cqw] space-y-[2.6cqw]">
            {[
              { icon: 'gift', n: 'Wash + wax bundle', d: 'Save $9.00', on: true },
              { icon: 'clock', n: 'Priority slot', d: '+$5.00', on: false },
            ].map((u) => (
              <div key={u.n} className="flex items-center gap-[3cqw]">
                <div className="flex h-[9.6cqw] w-[9.6cqw] items-center justify-center rounded-[3cqw] bg-[#EAF2F4] text-[#114559]">
                  <Glyph name={u.icon} className="h-[5cqw] w-[5cqw]" />
                </div>
                <div className="grow">
                  <p className="text-[3.5cqw] font-semibold tracking-[-0.015em] text-ink-900">{u.n}</p>
                  <p className="text-[2.9cqw] text-ink-900/45">{u.d}</p>
                </div>
                <div
                  className={`flex h-[6.6cqw] w-[6.6cqw] items-center justify-center rounded-full ${
                    u.on ? 'bg-[#114559] text-white' : 'border border-black/15 text-transparent'
                  }`}
                >
                  {u.on ? (
                    <motion.span
                      className="flex"
                      initial={{ scale: 0 }}
                      animate={on ? { scale: 1 } : undefined}
                      transition={{ type: 'spring', stiffness: 420, damping: 16, delay: 0.95 }}
                    >
                      <Glyph name="check" className="h-[3.6cqw] w-[3.6cqw]" width={2.4} />
                    </motion.span>
                  ) : (
                    <Glyph name="check" className="h-[3.6cqw] w-[3.6cqw]" width={2.4} />
                  )}
                </div>
              </div>
            ))}
          </div>
          <PrimaryButton className="mt-[4cqw]">Pay $62.40</PrimaryButton>
        </Card>
      </div>

      <TabBar active={1} />
      <HomeBar />
    </div>
  )
}
