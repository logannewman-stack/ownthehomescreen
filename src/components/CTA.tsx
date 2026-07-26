import { motion, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Phone } from './Phone'
import { HomeScreen, LockScreen, RewardsScreen } from './screens'
import { useSmoothProgress } from '../lib/motion'
import { Button, Eyebrow, TextLink, Words } from './ui'

export default function CTA() {
  const ref = useRef<HTMLDivElement>(null)
  const p = useSmoothProgress(ref, ['start end', 'end end'])

  const yA = useTransform(p, [0, 1], [110, 0])
  const yB = useTransform(p, [0, 1], [170, 0])
  const yC = useTransform(p, [0, 1], [140, 0])

  return (
    <section
      ref={ref}
      id="contact-cta"
      data-nav="dark"
      className="relative overflow-hidden bg-ink-800 pt-[clamp(96px,11vw,176px)] text-white"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(70% 50% at 50% 0%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 60%)',
        }}
      />

      <div className="shell relative text-center">
        <Eyebrow tone="dark">The next thirty days</Eyebrow>
        <Words
          text="Own the home screen."
          as="h2"
          className="type-hero mx-auto mt-7 max-w-[16ch] text-balance text-white"
          stagger={0.085}
        />
        <p className="lede mx-auto mt-7 max-w-[44ch] text-balance text-white/60">
          One call, forty-five minutes. We map your repeat-purchase journey and build the revenue model on
          your real numbers — before you spend anything.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
          <Button size="lg" variant="light">
            Book a strategy call
          </Button>
          <TextLink href="#results" tone="dark">
            See the numbers again
          </TextLink>
        </div>
      </div>

      {/* Three devices rising out of the floor, cropped by the frame */}
      {/* The devices dissolve into the floor rather than being sliced by it */}
      <div className="mask-b relative mx-auto mt-20 h-[300px] max-w-[1100px] overflow-hidden px-6 sm:h-[380px] lg:h-[440px]">
        <div className="flex items-start justify-center gap-4 sm:gap-8">
          <motion.div style={{ y: yA }} className="hidden w-[200px] shrink-0 sm:block lg:w-[240px]">
            <Phone shadow="dark">
              <RewardsScreen />
            </Phone>
          </motion.div>
          <motion.div style={{ y: yB }} className="w-[248px] shrink-0 lg:w-[296px]">
            <Phone shadow="dark">
              <HomeScreen delay={0.2} />
            </Phone>
          </motion.div>
          <motion.div style={{ y: yC }} className="hidden w-[200px] shrink-0 sm:block lg:w-[240px]">
            <Phone shadow="dark">
              <LockScreen />
            </Phone>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
