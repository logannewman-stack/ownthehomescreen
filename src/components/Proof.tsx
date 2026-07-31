import { Eyebrow, Reveal, ScrollLit, Section } from './ui'
import { Glyph } from './screens'

const REPORTED = [
  {
    icon: 'user',
    title: 'Who came back',
    body: 'How many of your customers are still buying each month, app users against everyone else — the clearest sign the app is working.',
  },
  {
    icon: 'bag',
    title: 'How often they bought',
    body: 'Orders per customer, and the time between orders getting shorter. This is where the growth comes from.',
  },
  {
    icon: 'card',
    title: 'What each one is worth',
    body: 'What the average customer spends over their lifetime, tracked against the projection from your blueprint — forecast against actual, every month.',
  },
]

export default function Proof() {
  return (
    <Section tone="white" className="py-[clamp(84px,10vw,156px)]">
      <div className="shell">
        {/* A statement of intent — replace with a client quote once one is signed off */}
        <Reveal>
          <Eyebrow>Why we do it this way</Eyebrow>
        </Reveal>
        <ScrollLit
          text="An app is not a marketing campaign. It is your place on your customer's home screen — the only software they choose to keep, and a direct line to them that nobody can take away. We build it like it matters, and we report the three numbers that prove it is working."
          className="mt-8 max-w-[40ch] font-display text-[clamp(1.625rem,3.6vw,3rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-ink-900"
        />

        <div className="mt-16 grid gap-x-12 gap-y-12 border-t border-black/[0.08] pt-14 sm:mt-24 lg:grid-cols-3">
          {REPORTED.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.07}>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-900 text-white">
                <Glyph name={r.icon} className="h-[18px] w-[18px]" width={1.6} />
              </span>
              <h3 className="mt-6 font-display text-[1.1875rem] font-semibold tracking-[-0.02em] text-ink-900">
                {r.title}
              </h3>
              <p className="mt-2.5 max-w-[34ch] text-[0.9375rem] leading-relaxed text-mute">{r.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
