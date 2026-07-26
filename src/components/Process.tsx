import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useSmoothProgress } from '../lib/motion'
import { Button, Eyebrow, Reveal, Section } from './ui'

const STEPS = [
  {
    n: '01',
    when: 'Week one',
    title: 'Blueprint',
    body: 'We map how your customers actually come back — the systems you run, the three behaviours worth engineering, the revenue sitting in your repeat rate. You leave with a spec, a fixed scope, and the growth model built on your own order data.',
    deliver: ['Customer journey map', 'Fixed scope and price', 'Revenue model on your numbers'],
  },
  {
    n: '02',
    when: 'Weeks two to three',
    title: 'Design',
    body: 'Every screen designed to your brand — typography, motion, icon, the lot. You get a clickable prototype on your own phone before a line of production code is written, and we iterate until it feels inevitable.',
    deliver: ['Full visual design', 'Clickable prototype', 'App icon and store assets'],
  },
  {
    n: '03',
    when: 'Weeks four to eight',
    title: 'Build',
    body: 'Native iOS and Android, your integrations wired in, tested on real devices. Weekly builds land on your phone, so nothing is a surprise at the end.',
    deliver: ['iOS and Android builds', 'Integrations and payments', 'Weekly review builds'],
  },
  {
    n: '04',
    when: 'Launch week',
    title: 'Launch',
    body: 'Store submission, review, listing and screenshots handled. Then the install campaign: in-store, email, SMS and social, engineered to get your existing customers onto the app in the first thirty days.',
    deliver: ['App Store and Play submission', 'Install campaign kit', 'Staff training'],
  },
  {
    n: '05',
    when: 'Ongoing',
    title: 'Grow',
    body: 'One page a month: how many came back, how often they bought, what each customer is now worth. Plus the roadmap — new features, OS updates, seasonal campaigns — shipped without you chasing anyone.',
    deliver: ['Monthly retention report', 'Roadmap and releases', 'OS and store maintenance'],
  },
]

export default function Process() {
  const ref = useRef<HTMLDivElement>(null)
  const p = useSmoothProgress(ref, ['start 0.7', 'end 0.85'])

  return (
    <Section id="process" tone="mist" className="py-[clamp(72px,8.6vw,136px)]">
      <div className="shell lg:grid lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-20 xl:gap-24">
        {/* Sticky header */}
        <div>
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <Eyebrow>How it goes</Eyebrow>
              <h2 className="mt-6 font-display text-[clamp(2.25rem,3.6vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-ink-900">
                Nine weeks, start to store.
              </h2>
              <p className="lede mt-6 max-w-[34ch]">
                Fixed scope. Fixed price. Weekly builds on your own phone, so you always know exactly where
                it stands.
              </p>
              <Button className="mt-9" variant="outline">
                Start with the blueprint
              </Button>
            </Reveal>
          </div>
        </div>

        {/* Steps with a rule that fills as you read */}
        <div ref={ref} className="relative mt-16 lg:mt-0">
          <div className="absolute bottom-0 left-0 top-2 w-[1px] bg-black/[0.09]">
            <motion.div className="absolute inset-x-0 top-0 origin-top bg-ink-900" style={{ height: '100%', scaleY: p }} />
          </div>

          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={0.04} className={`relative pl-8 sm:pl-12 ${i === 0 ? '' : 'mt-16 sm:mt-20'}`}>
              <span className="absolute -left-[4px] top-[9px] h-[9px] w-[9px] rounded-full border-2 border-mist bg-ink-900" />
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="num font-display text-[0.8125rem] font-semibold tracking-[0.14em] text-faint">
                  {s.n}
                </span>
                <h3 className="type-2 text-ink-900">{s.title}</h3>
                <span className="text-[0.8125rem] font-medium text-faint">{s.when}</span>
              </div>
              <p className="mt-5 max-w-[52ch] text-[1.0625rem] leading-relaxed text-mute">{s.body}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {s.deliver.map((d) => (
                  <li
                    key={d}
                    className="rounded-full border border-black/[0.09] bg-white/60 px-3.5 py-1.5 text-[0.8125rem] font-medium text-ink-700"
                  >
                    {d}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
