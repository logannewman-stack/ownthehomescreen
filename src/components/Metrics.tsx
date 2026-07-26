import { motion, useInView, useReducedMotion, useTransform } from 'framer-motion'
import { useRef, useState, type PointerEvent as ReactPointerEvent, type KeyboardEvent } from 'react'
import { areaPath, linePath, sampleCurve, scale, usd, type Pt } from '../lib/chart'
import { useSmoothProgress } from '../lib/motion'
import { Counter, Eyebrow, Reveal, Section, Sparkline } from './ui'

/* ------------------------------------------------------------------ *
 * The model. One illustrative cohort, two paths.
 * ------------------------------------------------------------------ */

const MONTHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const APP = [95, 205, 330, 455, 585, 705, 820, 930, 1035, 1120, 1195, 1260, 1310]
const WEB = [90, 165, 228, 280, 322, 356, 384, 407, 426, 441, 452, 462, 470]

const Y_MAX = 1500
const X0 = 64
const X1 = 786
const Y0 = 30
const Y1 = 366
const VB_W = 920
const VB_H = 410

const xAt = (i: number) => scale(i, 0, 12, X0, X1)
const yAt = (v: number) => scale(v, 0, Y_MAX, Y1, Y0)

const APP_PTS: Pt[] = APP.map((v, i) => [xAt(i), yAt(v)])
const WEB_PTS: Pt[] = WEB.map((v, i) => [xAt(i), yAt(v)])
const APP_SAMPLES = sampleCurve(APP_PTS)
const TICKS = [0, 500, 1000, 1500]

export default function Metrics() {
  return (
    <Section id="results" tone="mist" className="py-[clamp(72px,8.6vw,136px)]">
      <div className="shell">
        <Reveal className="max-w-[52rem]">
          <Eyebrow>The results</Eyebrow>
          <h2 className="type-1 mt-6 text-balance text-ink-900">Everything moves in the same direction.</h2>
          <p className="lede mt-6 max-w-[46ch]">
            An app doesn&apos;t just add another way to buy. It removes every reason not to — and that
            compounds in the four numbers you already watch.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-14 sm:mt-20">
          <GrowthChart />
        </Reveal>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TILES.map((t, i) => (
            <Reveal key={t.label} delay={0.05 * i}>
              <StatTile {...t} />
            </Reveal>
          ))}
        </div>

        <p className="mt-10 max-w-[74ch] text-[0.8125rem] leading-relaxed text-faint">
          Figures are an illustrative model built from widely reported app-versus-web engagement
          benchmarks, not a forecast for your business. Before you commit to anything, we build the same
          model on your real order data — your customer count, your average order value, your repeat rate.
        </p>
      </div>
    </Section>
  )
}

/* ------------------------------------------------------------------ *
 * The centrepiece: two paths, drawn as you scroll
 * ------------------------------------------------------------------ */

function GrowthChart() {
  const ref = useRef<HTMLDivElement>(null)
  const p = useSmoothProgress(ref, ['start 0.85', 'end 0.62'])
  const reduce = useReducedMotion()
  const [hover, setHover] = useState<number | null>(null)

  // The reveal is a left-to-right wipe rather than a dash offset: dashes and
  // `vector-effect: non-scaling-stroke` disagree about which coordinate system
  // they live in, and a wipe also grows the area fill with the line.
  const wipe = useTransform(p, [0, 1], [0, 1])
  const dotX = useTransform(p, APP_SAMPLES.stops, APP_SAMPLES.xs)
  const dotY = useTransform(p, APP_SAMPLES.stops, APP_SAMPLES.ys)
  // The tip marker comes to rest exactly on the endpoint, so it doubles as the
  // emphasis series' end dot — no second circle needed.
  const dotOpacity = useTransform(p, [0, 0.04], [0, 1])
  const endOpacity = useTransform(p, [0.86, 1], [0, 1])

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const svgX = ((e.clientX - r.left) / r.width) * VB_W
    const i = Math.round(scale(svgX, X0, X1, 0, 12))
    setHover(Math.min(12, Math.max(0, i)))
  }

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    setHover((v) => {
      const next = (v ?? 0) + (e.key === 'ArrowRight' ? 1 : -1)
      return Math.min(12, Math.max(0, next))
    })
  }

  const still = !!reduce

  return (
    <figure className="rounded-[28px] border border-black/[0.06] bg-white p-6 shadow-[0_40px_90px_-60px_rgba(0,0,0,0.28)] sm:p-10">
      {/* Title + legend */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <figcaption>
          <h3 className="type-3 text-ink-900">Cumulative revenue per customer</h3>
          <p className="mt-1.5 text-[0.875rem] text-mute">First 12 months after a customer&apos;s first order</p>
        </figcaption>
        <ul className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-2">
          {[
            { c: '#1d1d1f', n: 'With your app' },
            { c: '#c7c7cc', n: 'Web & email only' },
          ].map((s) => (
            <li key={s.n} className="flex items-center gap-2.5 text-[0.8125rem] font-medium text-mute">
              <span className="h-[3px] w-5 rounded-full" style={{ background: s.c }} />
              {s.n}
            </li>
          ))}
        </ul>
      </div>

      {/* Plot */}
      <div
        ref={ref}
        className="relative mt-8 cursor-crosshair"
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        onKeyDown={onKey}
        onFocus={() => setHover((v) => v ?? 12)}
        onBlur={() => setHover(null)}
        tabIndex={0}
        role="img"
        aria-label="Line chart: cumulative revenue per customer over twelve months. With your app, $1,310 by month twelve. Web and email only, $470. Use the arrow keys to read each month."
      >
        <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="w-full overflow-visible" fill="none">
          {/* Gridlines + y ticks */}
          {TICKS.map((t) => (
            <g key={t}>
              <line
                x1={X0}
                x2={X1}
                y1={yAt(t)}
                y2={yAt(t)}
                stroke="#e8e8ea"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <text
                x={X0 - 14}
                y={yAt(t)}
                textAnchor="end"
                dominantBaseline="middle"
                className="num fill-faint text-[13px]"
              >
                {usd(t)}
              </text>
            </g>
          ))}

          {/* x ticks */}
          {[0, 3, 6, 9, 12].map((m) => (
            <text
              key={m}
              x={xAt(m)}
              y={Y1 + 30}
              textAnchor="middle"
              className="num fill-faint text-[13px]"
            >
              {m === 0 ? 'Month 0' : m}
            </text>
          ))}

          <defs>
            <clipPath id="growth-wipe">
              <motion.rect
                x={X0 - 4}
                y="0"
                width={X1 - X0 + 8}
                height={VB_H}
                style={still ? undefined : { scaleX: wipe, originX: 0, originY: 0 }}
              />
            </clipPath>
          </defs>

          <g clipPath="url(#growth-wipe)">
            {/* Recessive series */}
            <path
              d={linePath(WEB_PTS)}
              stroke="#c7c7cc"
              strokeWidth="2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            {/* Emphasis series — wash + line */}
            <path d={areaPath(APP_PTS, Y1)} fill="#1d1d1f" opacity="0.07" />
            <path
              d={linePath(APP_PTS)}
              stroke="#1d1d1f"
              strokeWidth="2"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </g>

          {/* Marker riding the drawn tip */}
          {still ? (
            <circle cx={xAt(12)} cy={yAt(APP[12])} r="5" fill="#1d1d1f" stroke="#fff" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
          ) : (
            <motion.circle
              cx={dotX}
              cy={dotY}
              r="5"
              fill="#1d1d1f"
              stroke="#ffffff"
              strokeWidth="2.5"
              vectorEffect="non-scaling-stroke"
              style={{ opacity: dotOpacity }}
            />
          )}

          {/* Direct end labels — only the two endpoints get numbers */}
          <motion.g style={still ? undefined : { opacity: endOpacity }}>
            <text x={X1 + 18} y={yAt(APP[12]) - 8} className="fill-ink-700 text-[19px] font-semibold [letter-spacing:-0.03em]">
              $1,310
            </text>
            <text x={X1 + 18} y={yAt(APP[12]) + 12} className="fill-mute text-[13px]">
              with your app
            </text>

            <circle cx={xAt(12)} cy={yAt(WEB[12])} r="4.5" fill="#c7c7cc" stroke="#fff" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
            <text x={X1 + 18} y={yAt(WEB[12]) - 8} className="fill-mute text-[19px] font-semibold [letter-spacing:-0.03em]">
              $470
            </text>
            <text x={X1 + 18} y={yAt(WEB[12]) + 12} className="fill-faint text-[13px]">
              without
            </text>
          </motion.g>

          {/* Hover / keyboard crosshair */}
          {hover !== null ? (
            <g>
              <line
                x1={xAt(hover)}
                x2={xAt(hover)}
                y1={Y0 - 6}
                y2={Y1}
                stroke="#1d1d1f"
                strokeOpacity="0.18"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <circle cx={xAt(hover)} cy={yAt(WEB[hover])} r="4.5" fill="#c7c7cc" stroke="#fff" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
              <circle cx={xAt(hover)} cy={yAt(APP[hover])} r="5" fill="#1d1d1f" stroke="#fff" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
            </g>
          ) : null}
        </svg>

        {/* Tooltip */}
        {hover !== null ? (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[125%] rounded-2xl border border-black/[0.06] bg-white/90 px-4 py-3 shadow-lift backdrop-blur-xl"
            style={{
              left: `${Math.min(88, Math.max(12, (xAt(hover) / VB_W) * 100))}%`,
              top: `${(yAt(APP[hover]) / VB_H) * 100}%`,
            }}
          >
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-faint">
              Month {hover}
            </p>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="h-[3px] w-4 rounded-full bg-ink-700" />
                <span className="num text-[0.9375rem] font-semibold tracking-[-0.02em] text-ink-900">
                  {usd(APP[hover])}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="h-[3px] w-4 rounded-full bg-chart-gray" />
                <span className="num text-[0.9375rem] font-medium tracking-[-0.02em] text-mute">
                  {usd(WEB[hover])}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* The same values, reachable without the chart */}
      <table className="sr-only">
        <caption>Cumulative revenue per customer, first 12 months</caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">With your app</th>
            <th scope="col">Web and email only</th>
          </tr>
        </thead>
        <tbody>
          {MONTHS.map((m) => (
            <tr key={m}>
              <th scope="row">{m}</th>
              <td>{usd(APP[m])}</td>
              <td>{usd(WEB[m])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  )
}

/* ------------------------------------------------------------------ *
 * Stat tiles
 * ------------------------------------------------------------------ */

type Tile = {
  label: string
  to: number
  decimals?: number
  prefix?: string
  suffix?: string
  note: string
  spark?: number[]
  bars?: number[]
}

const TILES: Tile[] = [
  {
    label: 'Repeat purchase rate',
    to: 38,
    prefix: '+',
    suffix: '%',
    note: 'App customers who buy again inside 90 days',
    spark: [22, 26, 25, 31, 34, 33, 39, 44, 48, 52, 58, 63],
  },
  {
    label: 'Lifetime value',
    to: 2.8,
    decimals: 1,
    suffix: '×',
    note: 'Revenue per customer over 12 months',
    bars: [34, 41, 47, 52, 61, 68, 74, 83, 100],
  },
  {
    label: 'Orders per year',
    to: 3.1,
    decimals: 1,
    prefix: '+',
    note: 'From 7.4 to 10.5 per active customer',
    spark: [30, 33, 32, 38, 41, 45, 44, 52, 57, 61, 68, 72],
  },
  {
    label: 'App opens per month',
    to: 11.2,
    decimals: 1,
    note: 'Every open is a chance to sell nothing at all',
    bars: [28, 35, 33, 44, 52, 58, 66, 79, 100],
  },
]

function StatTile({ label, to, decimals = 0, prefix = '', suffix = '', note, spark, bars }: Tile) {
  return (
    <div className="flex h-full flex-col justify-between rounded-[22px] border border-black/[0.06] bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-faint">{label}</p>
      </div>
      <div className="mt-8 flex items-end justify-between gap-4">
        <Counter
          to={to}
          decimals={decimals}
          prefix={prefix}
          suffix={suffix}
          replay
          className="font-display text-[clamp(2.5rem,3.4vw,3.25rem)] font-semibold leading-[0.9] tracking-[-0.045em] text-ink-900"
        />
        {spark ? <Sparkline values={spark} w={72} h={30} className="mb-1.5" /> : null}
        {bars ? <MiniBars values={bars} /> : null}
      </div>
      <p className="mt-4 text-[0.8125rem] leading-snug text-mute">{note}</p>
    </div>
  )
}

/**
 * Columns: ≤24px thick, 4px rounded caps, 2px surface gaps, last one in ink.
 * Grows and retracts with the tile's counter so the whole card replays.
 */
function MiniBars({ values }: { values: number[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-12%' })
  const reduce = useReducedMotion()
  return (
    <div ref={ref} className="mb-1.5 flex h-[30px] items-end gap-[2px]">
      {values.map((v, i) => (
        <motion.span
          key={i}
          className="w-[6px] origin-bottom rounded-t-[3px]"
          style={{
            height: `${Math.max(4, (v / 100) * 30)}px`,
            background: i === values.length - 1 ? '#1d1d1f' : '#c7c7cc',
          }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: reduce || inView ? 1 : 0 }}
          transition={{ duration: 0.7, delay: inView ? i * 0.05 : 0, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </div>
  )
}
