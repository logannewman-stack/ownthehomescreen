import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'
import { Fragment, useEffect, useRef, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { stops } from '../lib/motion'
import { contactModal } from './useContactModal'

/* ------------------------------------------------------------------ *
 * Reveals
 * ------------------------------------------------------------------ */

/** Rises and un-blurs as it enters the viewport. The house transition. */
export function Reveal({
  children,
  delay = 0,
  y = 26,
  blur = 6,
  className = '',
  once = true,
}: {
  children: ReactNode
  delay?: number
  y?: number
  blur?: number
  className?: string
  once?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, margin: '-12% 0px -12% 0px' })
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, filter: `blur(${blur}px)` }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined}
      transition={{ duration: 1.05, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/** Headline that assembles word by word — the Apple keynote entrance. */
export function Words({
  text,
  className = '',
  delay = 0,
  stagger = 0.07,
  as: Tag = 'h1',
}: {
  text: string
  className?: string
  delay?: number
  stagger?: number
  as?: 'h1' | 'h2' | 'p'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8%' })
  const reduce = useReducedMotion()
  const words = text.split(' ')

  return (
    <Tag className={className}>
      <span ref={ref} className="inline">
        {words.map((w, i) => (
          <Fragment key={`${w}-${i}`}>
            <motion.span
              className="inline-block will-change-transform"
              initial={reduce ? undefined : { opacity: 0, y: '0.42em', filter: 'blur(10px)' }}
              animate={reduce || inView ? { opacity: 1, y: '0em', filter: 'blur(0px)' } : undefined}
              transition={{ duration: 1.1, delay: delay + i * stagger, ease: [0.19, 1, 0.22, 1] }}
            >
              {w}
            </motion.span>
            {i < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
      </span>
    </Tag>
  )
}

/**
 * Long statement where each word lights from near-invisible to full ink as the
 * reader scrolls through it. Reading becomes the animation.
 */
export function ScrollLit({
  text,
  className = '',
  tone = 'light',
}: {
  text: string
  className?: string
  tone?: 'light' | 'dark'
}) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.82', 'end 0.45'] })
  const reduce = useReducedMotion()
  const words = text.split(' ')
  const n = words.length
  const dim = tone === 'dark' ? 0.22 : 0.15
  // Each word lights over a window 2.6 words wide, and the whole run has to
  // finish inside [0,1] — see lib/motion.
  const span = n + 1.6

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <LitWord p={scrollYProgress} start={i / span} end={(i + 1.6) / span} dim={dim} still={!!reduce}>
            {w}
          </LitWord>
          {i < n - 1 ? ' ' : null}
        </Fragment>
      ))}
    </p>
  )
}

function LitWord({
  children,
  p,
  start,
  end,
  dim,
  still,
}: {
  children: ReactNode
  p: MotionValue<number>
  start: number
  end: number
  dim: number
  still: boolean
}) {
  const opacity = useTransform(p, stops(start, end), [dim, 1], { clamp: true })
  if (still) return <span className="inline-block">{children}</span>
  return (
    <motion.span className="inline-block" style={{ opacity }}>
      {children}
    </motion.span>
  )
}

/* ------------------------------------------------------------------ *
 * Numbers
 * ------------------------------------------------------------------ */

/**
 * Counts to its value when it reaches the screen. Proportional figures by
 * design. With `replay`, it rewinds on the way out and counts again on the way
 * back in, so the number performs on every pass rather than once per page load.
 */
export function Counter({
  to,
  from = 0,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1.9,
  className = '',
  group = false,
  replay = false,
}: {
  to: number
  from?: number
  decimals?: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
  group?: boolean
  replay?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: !replay, margin: '-12%' })
  const reduce = useReducedMotion()
  const mv = useMotionValue(from)
  const text = useTransform(mv, (v) => {
    const n = group
      ? v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : v.toFixed(decimals)
    return `${prefix}${n}${suffix}`
  })

  useEffect(() => {
    if (reduce) {
      if (inView) mv.set(to)
      return
    }
    if (!inView) {
      // Rewind so the next entrance counts up from the start again.
      if (replay) mv.set(from)
      return
    }
    const controls = animate(mv, to, { duration, ease: [0.16, 1, 0.3, 1] })
    return () => controls.stop()
  }, [inView, to, from, duration, mv, reduce, replay])

  return (
    <motion.span ref={ref} className={className}>
      {text}
    </motion.span>
  )
}

/**
 * Sparkline for stat tiles: recessive line, ink end-dot with a surface ring.
 * `values` are plotted as-is; the highest value should be last.
 */
export function Sparkline({
  values,
  w = 62,
  h = 24,
  className = '',
  tone = 'light',
}: {
  values: number[]
  w?: number
  h?: number
  className?: string
  tone?: 'light' | 'dark'
}) {
  const max = Math.max(...values)
  const min = Math.min(...values)
  const r = 3
  const pts = values.map((v, i) => {
    const x = r + (i * (w - r * 2)) / (values.length - 1)
    const y = h - r - ((v - min) / (max - min || 1)) * (h - r * 2)
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
  })
  const lastX = w - r
  const lastY = h - r - ((values[values.length - 1] - min) / (max - min || 1)) * (h - r * 2)
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" aria-hidden="true" className={className}>
      <path
        d={pts.join(' ')}
        stroke={tone === 'dark' ? 'rgba(255,255,255,0.32)' : '#c7c7cc'}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={lastX}
        cy={lastY}
        r={r}
        fill={tone === 'dark' ? '#ffffff' : '#1d1d1f'}
        stroke={tone === 'dark' ? '#0b0b0c' : '#ffffff'}
        strokeWidth="2"
      />
    </svg>
  )
}

/* ------------------------------------------------------------------ *
 * Type & layout furniture
 * ------------------------------------------------------------------ */

export function Eyebrow({ children, tone = 'light' }: { children: ReactNode; tone?: 'light' | 'dark' }) {
  return (
    // Inline, not flex: when the label wraps, the dot stays at the head of the
    // first line instead of floating beside a two-line block.
    <span
      className={`text-[0.6875rem] font-semibold uppercase leading-[1.6] tracking-[0.24em] ${
        tone === 'dark' ? 'text-white/55' : 'text-faint'
      }`}
    >
      <span
        className={`mr-2.5 inline-block h-[5px] w-[5px] rounded-full align-middle ${
          tone === 'dark' ? 'bg-white/60' : 'bg-ink/70'
        }`}
      />
      {children}
    </span>
  )
}

export function Section({
  id,
  children,
  className = '',
  tone = 'white',
  style,
}: {
  id?: string
  children: ReactNode
  className?: string
  tone?: 'white' | 'mist' | 'ink'
  style?: CSSProperties
}) {
  const bg = tone === 'white' ? 'bg-white' : tone === 'mist' ? 'bg-mist' : 'bg-ink-800 text-white'
  return (
    <section id={id} style={style} className={`relative ${bg} ${className}`}>
      {children}
    </section>
  )
}

/* ------------------------------------------------------------------ *
 * Buttons
 * ------------------------------------------------------------------ */

function openContact(e: MouseEvent) {
  e.preventDefault()
  contactModal.open()
}

export function Button({
  children,
  href = '#contact',
  variant = 'primary',
  size = 'md',
  className = '',
}: {
  children: ReactNode
  href?: string
  variant?: 'primary' | 'outline' | 'light' | 'dark-outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizes = {
    sm: 'h-9 px-4 text-[0.8125rem]',
    md: 'h-11 px-6 text-[0.9375rem]',
    lg: 'h-[3.25rem] px-8 text-base',
  }[size]

  const variants = {
    primary: 'bg-ink-700 text-white hover:bg-ink-900',
    outline: 'text-ink-700 border border-ink-700/20 hover:border-ink-700/50 hover:bg-ink-700/[0.03]',
    light: 'bg-white text-ink-700 hover:bg-white/90',
    'dark-outline': 'text-white border border-white/25 hover:border-white/60 hover:bg-white/[0.06]',
  }[variant]

  return (
    <a
      href={href}
      onClick={href === '#contact' ? openContact : undefined}
      className={`group inline-flex select-none items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] transition-all duration-300 ease-apple active:scale-[0.98] ${sizes} ${variants} ${className}`}
    >
      {children}
    </a>
  )
}

/** Apple's quiet blue-free text link: label + chevron that nudges on hover. */
export function TextLink({
  children,
  href = '#contact',
  tone = 'light',
  className = '',
}: {
  children: ReactNode
  href?: string
  tone?: 'light' | 'dark'
  className?: string
}) {
  return (
    <a
      href={href}
      onClick={href === '#contact' ? openContact : undefined}
      className={`group inline-flex items-center gap-1.5 text-[0.9375rem] font-medium tracking-[-0.01em] ${
        tone === 'dark' ? 'text-white/85 hover:text-white' : 'text-ink-700 hover:text-ink-900'
      } ${className}`}
    >
      {children}
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className="mt-px transition-transform duration-300 ease-apple group-hover:translate-x-1"
        aria-hidden="true"
      >
        <path d="M5 2.5 9.5 7 5 11.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  )
}

/* ------------------------------------------------------------------ *
 * Brand
 * ------------------------------------------------------------------ */

/**
 * The app-icon mark: a home outline with a downward tap arrow.
 * Pass `size` for a fixed pixel box, or size it entirely from `className`
 * (which is how it scales inside the container-query phone screens).
 */
export function BrandIcon({ size, className = '', tone = 'dark' }: { size?: number; className?: string; tone?: 'dark' | 'light' }) {
  const bg = tone === 'dark' ? '#0b0b0c' : '#ffffff'
  const fg = tone === 'dark' ? '#ffffff' : '#0b0b0c'
  return (
    <svg
      {...(size ? { width: size, height: size } : {})}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="15" fill={bg} />
      <path
        d="M32 15.5 47.5 28V45a2.5 2.5 0 0 1-2.5 2.5H19A2.5 2.5 0 0 1 16.5 45V28L32 15.5Z"
        fill="none"
        stroke={fg}
        strokeWidth="3.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M32 41.5V29.5m0 0-4.5 4.5M32 29.5l4.5 4.5"
        fill="none"
        stroke={fg}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Wordmark({ tone = 'light', className = '' }: { tone?: 'light' | 'dark'; className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <BrandIcon size={26} tone={tone === 'light' ? 'dark' : 'light'} />
      <span
        className={`font-display text-[0.95rem] font-semibold leading-none tracking-[-0.02em] ${
          tone === 'dark' ? 'text-white' : 'text-ink-700'
        }`}
      >
        Own The Home Screen
      </span>
    </span>
  )
}
