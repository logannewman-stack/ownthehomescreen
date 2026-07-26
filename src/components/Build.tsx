import { Eyebrow, Reveal, Section } from './ui'
import { Glyph } from './screens'

const CAPABILITIES = [
  {
    icon: 'home',
    title: 'Native iOS and Android',
    body: 'One codebase, both stores, submitted and approved by us. It looks and moves like an app people paid for.',
  },
  {
    icon: 'user',
    title: 'Accounts without friction',
    body: 'Sign in with Apple, Google or a phone number. Nothing to remember, nothing to reset at the checkout.',
  },
  {
    icon: 'bag',
    title: 'Ordering and checkout',
    body: 'Saved carts, saved cards, Apple Pay and Google Pay, tipping, scheduling and repeat orders.',
  },
  {
    icon: 'star',
    title: 'Loyalty and rewards',
    body: 'Points, tiers, streaks and referral credit — tuned so the next visit always feels close.',
  },
  {
    icon: 'calendar',
    title: 'Booking and scheduling',
    body: 'Live availability, deposits, reminders and no-show protection wired into the calendar you already use.',
  },
  {
    icon: 'bell',
    title: 'Push and lifecycle',
    body: 'Segmented campaigns triggered by real behaviour: lapsed, loyal, nearly-due, cart left open.',
  },
  {
    icon: 'gear',
    title: 'Your systems, connected',
    body: 'POS, CRM, inventory, payments, delivery, accounting. We integrate what you run instead of replacing it.',
  },
  {
    icon: 'sparkle',
    title: 'Numbers you will actually read',
    body: 'Retention cohorts, repeat rate and lifetime value on one page, in plain language, every month.',
  },
  {
    icon: 'check',
    title: 'Everything after launch',
    body: 'Store listing, screenshots, review responses, OS updates and a roadmap that keeps shipping.',
  },
]

export default function Build() {
  return (
    <Section id="build" tone="white" className="py-[clamp(84px,10vw,156px)]">
      <div className="shell">
        <Reveal className="max-w-[46rem]">
          <Eyebrow>What we build</Eyebrow>
          <h2 className="type-1 mt-6 text-balance text-ink-900">Everything in. Nothing to assemble.</h2>
          <p className="lede mt-6 max-w-[46ch]">
            No plugin stack, no template you have to grow out of, no third invoice you didn&apos;t expect.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 sm:mt-20 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((c, i) => (
            <Reveal
              key={c.title}
              delay={(i % 3) * 0.06}
              className={[
                'border-t border-black/[0.08] pb-11 pt-9',
                i % 2 === 1 ? 'sm:border-l sm:border-black/[0.08] sm:pl-9' : '',
                'lg:border-l-0 lg:pl-0',
                i % 3 !== 0 ? 'lg:border-l lg:border-black/[0.08] lg:pl-10' : '',
                i % 3 !== 2 ? 'lg:pr-10' : '',
              ].join(' ')}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/[0.09] text-ink-900">
                <Glyph name={c.icon} className="h-[19px] w-[19px]" width={1.5} />
              </span>
              <h3 className="mt-6 font-display text-[1.1875rem] font-semibold tracking-[-0.02em] text-ink-900">
                {c.title}
              </h3>
              <p className="mt-2.5 max-w-[34ch] text-[0.9375rem] leading-relaxed text-mute">{c.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}
