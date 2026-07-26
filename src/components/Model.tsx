import { motion, useSpring, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Button, Eyebrow, Reveal, Section } from './ui'

/* The assumptions, stated in the open. Change them here and the page follows. */
const ADOPTION = 0.35 // share of your customers who install within a year
const FREQ_LIFT = 0.28 // installed customers order this much more often
const AOV_LIFT = 0.12 // and spend this much more per order

const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`

export default function Model() {
  const [customers, setCustomers] = useState(4000)
  const [aov, setAov] = useState(42)
  const [freq, setFreq] = useState(8)

  const adopters = customers * ADOPTION
  const perYearNow = aov * freq
  const perYearApp = aov * (1 + AOV_LIFT) * (freq * (1 + FREQ_LIFT))
  const baseline = customers * perYearNow
  const uplift = adopters * (perYearApp - perYearNow)

  // Springs so the numbers settle instead of snapping while a slider is dragged.
  const upliftMv = useSpring(uplift, { stiffness: 140, damping: 26, mass: 0.4 })
  const ltvMv = useSpring(perYearApp, { stiffness: 140, damping: 26, mass: 0.4 })
  useEffect(() => {
    upliftMv.set(uplift)
    ltvMv.set(perYearApp)
  }, [uplift, perYearApp, upliftMv, ltvMv])
  const upliftText = useTransform(upliftMv, (v) => money(Math.max(0, v)))
  const ltvText = useTransform(ltvMv, (v) => money(Math.max(0, v)))

  const projected = baseline + uplift
  const barNow = (baseline / projected) * 100

  return (
    <Section id="model" tone="white" className="py-[clamp(72px,8.6vw,136px)]">
      <div className="shell">
        <Reveal className="max-w-[48rem]">
          <Eyebrow>The maths</Eyebrow>
          <h2 className="type-1 mt-6 text-balance text-ink-900">Run it on your own numbers.</h2>
          <p className="lede mt-6 max-w-[46ch]">
            Three inputs you already know. Move them and watch what a third of your customers going
            one-tap does to a year.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-14 sm:mt-20">
          <div className="grid gap-10 rounded-[32px] border border-black/[0.06] bg-mist p-7 sm:p-12 lg:grid-cols-2 lg:gap-20">
            {/* Inputs */}
            <div className="flex flex-col justify-center">
              <Slider
                label="Active customers"
                value={customers}
                min={500}
                max={50000}
                step={500}
                display={customers.toLocaleString('en-US')}
                onChange={setCustomers}
              />
              <Slider
                label="Average order value"
                value={aov}
                min={10}
                max={400}
                step={2}
                display={money(aov)}
                onChange={setAov}
              />
              <Slider
                label="Orders per customer, per year"
                value={freq}
                min={2}
                max={36}
                step={1}
                display={String(freq)}
                onChange={setFreq}
              />

              <p className="mt-4 border-t border-black/[0.08] pt-7 text-[0.8125rem] leading-relaxed text-faint">
                Assumes {Math.round(ADOPTION * 100)}% of your customers install in year one, and that those
                who do order {Math.round(FREQ_LIFT * 100)}% more often and spend {Math.round(AOV_LIFT * 100)}%
                more per order. It is a model, not a promise — in the blueprint we rebuild it on your real
                order history before you spend anything.
              </p>
            </div>

            {/* Output */}
            <div className="rounded-[24px] border border-black/[0.06] bg-white p-7 sm:p-9">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-faint">
                Additional revenue, year one
              </p>
              <motion.p className="mt-4 font-display text-[clamp(2.75rem,5.4vw,4.25rem)] font-semibold leading-[0.9] tracking-[-0.05em] text-ink-900">
                {upliftText}
              </motion.p>

              {/* Two bars on one scale; the ink segment is the uplift itself */}
              <div className="mt-11 space-y-6">
                <div>
                  <BarLabel label="Revenue today" value={money(baseline)} tone="gray" />
                  <div className="mt-2.5 h-[10px] w-full">
                    <motion.div
                      className="h-full rounded-r-[4px] bg-chart-gray"
                      animate={{ width: `${barNow}%` }}
                      initial={false}
                      transition={{ type: 'spring', stiffness: 150, damping: 26 }}
                    />
                  </div>
                </div>
                <div>
                  <BarLabel label="With the app" value={money(projected)} tone="ink" />
                  <div className="mt-2.5 flex h-[10px] w-full gap-[2px]">
                    <motion.div
                      className="h-full bg-chart-gray"
                      animate={{ width: `${barNow}%` }}
                      initial={false}
                      transition={{ type: 'spring', stiffness: 150, damping: 26 }}
                    />
                    <motion.div
                      className="h-full rounded-r-[4px] bg-ink-900"
                      animate={{ width: `${Math.max(0, 100 - barNow)}%` }}
                      initial={false}
                      transition={{ type: 'spring', stiffness: 150, damping: 26 }}
                    />
                  </div>
                </div>
              </div>

              <dl className="mt-11 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-black/[0.08] pt-8">
                <div>
                  <dt className="min-h-[2.6em] text-[0.6875rem] font-semibold uppercase leading-[1.3] tracking-[0.18em] text-faint">
                    App customers
                  </dt>
                  <dd className="num font-display text-[1.625rem] font-semibold tracking-[-0.035em] text-ink-900">
                    {Math.round(adopters).toLocaleString('en-US')}
                  </dd>
                </div>
                <div>
                  <dt className="min-h-[2.6em] text-[0.6875rem] font-semibold uppercase leading-[1.3] tracking-[0.18em] text-faint">
                    Value per app customer
                  </dt>
                  <motion.dd className="num font-display text-[1.625rem] font-semibold tracking-[-0.035em] text-ink-900">
                    {ltvText}
                  </motion.dd>
                </div>
              </dl>

              <Button className="mt-9 w-full" size="lg">
                Model this on my real data
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  display: string
  onChange: (v: number) => void
}) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="mb-11 last:mb-0">
      <div className="flex items-baseline justify-between gap-6">
        <label htmlFor={label} className="text-[0.9375rem] font-medium text-ink-700">
          {label}
        </label>
        <span className="num font-display text-[1.5rem] font-semibold tracking-[-0.035em] text-ink-900">
          {display}
        </span>
      </div>
      <input
        id={label}
        type="range"
        className="slider mt-4"
        style={{ ['--pct' as string]: `${pct}%` }}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}

function BarLabel({ label, value, tone }: { label: string; value: string; tone: 'ink' | 'gray' }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className={`text-[0.875rem] font-medium ${tone === 'ink' ? 'text-ink-900' : 'text-mute'}`}>{label}</span>
      <span
        className={`num text-[1rem] font-semibold tracking-[-0.02em] ${
          tone === 'ink' ? 'text-ink-900' : 'text-mute'
        }`}
      >
        {value}
      </span>
    </div>
  )
}
