import { motion, useMotionTemplate, useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion'
import { useRef, useState } from 'react'
import { Phone } from './Phone'
import { HomeScreen } from './screens'
import { useSmoothProgress } from '../lib/motion'
import { Button, Eyebrow, Sparkline, TextLink, Words } from './ui'

/**
 * The fold, as a three-beat film:
 *   1. the device rises and straightens, bleeding off the bottom of the frame
 *   2. the headline lifts away and the device pulls back into the space it left
 *   3. the numbers arrive around it
 * One pinned scroll, spring-smoothed.
 */
export default function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const p = useSmoothProgress(ref, ['start start', 'end end'])
  const [ctaLive, setCtaLive] = useState(true)
  useMotionValueEvent(p, 'change', (v) => setCtaLive(v < 0.2))

  // Beat 1 → 2: the words leave.
  const textOpacity = useTransform(p, [0, 0.24], [1, 0])
  const textY = useTransform(p, [0, 0.42], [0, -130])
  const textScale = useTransform(p, [0, 0.42], [1, 0.94])
  const textBlurN = useTransform(p, [0, 0.24], [0, 10])
  const textBlur = useMotionTemplate`blur(${textBlurN}px)`

  // The device: rise, straighten, then pull back until the whole product is there.
  const phoneY = useTransform(p, [0, 0.32, 0.62, 1], ['56vh', '9vh', '0vh', '-2vh'])
  const phoneScale = useTransform(p, [0, 0.32, 0.62], [1, 1.02, 0.72])
  const phoneRotateX = useTransform(p, [0, 0.34], [12, 0])
  const floorOpacity = useTransform(p, [0, 0.32, 0.7], [0.35, 0.8, 0.4])

  // Beat 3: proof.
  const proofOpacity = useTransform(p, [0.6, 0.76], [0, 1])
  const cueOpacity = useTransform(p, [0, 0.06], [1, 0])

  return (
    <div id="top" ref={ref} className="relative h-[260vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Text */}
        <motion.div
          style={{ opacity: textOpacity, y: textY, scale: textScale, filter: textBlur }}
          className={`shell absolute inset-x-0 top-[max(9.5vh,80px)] z-20 text-center ${
            ctaLive ? '' : 'pointer-events-none'
          }`}
        >
          <Eyebrow>Custom mobile apps for brands people return to</Eyebrow>
          <Words
            text="Own the home screen."
            className="type-hero mx-auto mt-6 max-w-[16ch] text-balance text-ink-900"
            stagger={0.09}
          />
          <p className="lede mx-auto mt-6 max-w-[46ch] text-balance">
            We design and build the app your customers keep — so reordering, booking and coming back is one
            tap, not a search, a login and a hope.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
            <Button size="lg">Book a strategy call</Button>
            <TextLink href="#results">See the numbers</TextLink>
          </div>
        </motion.div>

        {/* Device — centred in the frame, then moved by scroll alone */}
        <div className="absolute left-1/2 top-1/2 z-10 w-[clamp(252px,26vw,320px)] -translate-x-1/2 -translate-y-1/2">
          <motion.div
            style={{ y: phoneY, scale: phoneScale, rotateX: phoneRotateX, transformPerspective: 1500 }}
            className="relative will-change-transform"
          >
            <Phone>
              <HomeScreen delay={0.35} />
            </Phone>

            {/* Contact shadow on the page, not on the device */}
            <motion.div
              style={{ opacity: floorOpacity }}
              className="pointer-events-none absolute -bottom-12 left-1/2 h-16 w-[135%] -translate-x-1/2 rounded-[50%] bg-ink-900/20 blur-3xl"
            />

            {/* The proof, arriving once the product is whole */}
            <motion.div style={{ opacity: proofOpacity }} className="pointer-events-none absolute inset-0 hidden lg:block">
              <Chip className="-left-[92%] top-[10%]" p={p} drift={-30} label="Repeat purchase rate" value="+38%" />
              <Chip className="-right-[90%] top-[36%]" p={p} drift={24} label="Lifetime value" value="1.55×" />
              <Chip className="-left-[84%] top-[64%]" p={p} drift={40} label="Orders per year" value="+3.1" />
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll cue — kept out of the device's way */}
        <motion.div
          style={{ opacity: cueOpacity }}
          className="pointer-events-none absolute bottom-8 left-6 z-30 hidden items-center gap-3 sm:flex lg:left-12"
        >
          <span className="relative h-[1px] w-14 overflow-hidden bg-black/12">
            <motion.span
              className="absolute inset-y-0 left-0 w-5 bg-ink-900/70"
              animate={{ x: [-20, 56] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: [0.4, 0, 0.2, 1] }}
            />
          </span>
          <span className="text-[0.625rem] font-semibold uppercase tracking-[0.28em] text-faint">Scroll</span>
        </motion.div>
      </div>
    </div>
  )
}

function Chip({
  label,
  value,
  className = '',
  p,
  drift,
}: {
  label: string
  value: string
  className?: string
  p: MotionValue<number>
  drift: number
}) {
  const y = useTransform(p, [0.6, 1], [drift, -drift])
  return (
    <motion.div
      style={{ y }}
      className={`absolute w-[196px] rounded-2xl border border-black/[0.06] bg-white/85 p-4 shadow-lift backdrop-blur-xl ${className}`}
    >
      <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-faint">{label}</p>
      <div className="mt-2 flex items-end justify-between">
        <span className="font-display text-[1.75rem] font-semibold leading-none tracking-[-0.04em] text-ink-900">
          {value}
        </span>
        <Sparkline values={[2, 4, 3.5, 6, 7, 6.5, 9, 10, 12, 13, 16, 18]} w={62} h={24} className="mb-0.5" />
      </div>
    </motion.div>
  )
}
