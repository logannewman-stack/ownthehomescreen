import { Button, Eyebrow, Reveal, Section } from './ui'

const TIERS = [
  {
    name: 'Signature',
    who: 'A single-location brand with customers worth keeping.',
    features: [
      'Native iOS and Android app',
      'Ordering or booking, end to end',
      'Loyalty, points and rewards',
      'Push notification campaigns',
      'Payments and saved cards',
      'Store submission and launch kit',
      'Monthly retention report',
    ],
    cta: 'Book a strategy call',
    feature: false,
  },
  {
    name: 'Signature Plus',
    who: 'Busier operations with a POS, CRM or booking system to connect.',
    features: [
      'Everything in Signature',
      'POS, CRM and inventory integrations',
      'Memberships and prepaid balances',
      'Customer segments built automatically',
      'Referral rewards and win-back campaigns',
      'Quarterly roadmap and releases',
      'Priority support',
    ],
    cta: 'Book a strategy call',
    feature: true,
  },
  {
    name: 'Enterprise',
    who: 'Groups, franchises and multi-location portfolios.',
    features: [
      'Everything in Signature Plus',
      'Multi-location and franchise controls',
      'Custom back office and permissions',
      'SSO and role-based access',
      'Data warehouse export',
      'Dedicated build team',
      'Contracted SLA',
    ],
    cta: 'Talk to us',
    feature: false,
  },
]

export default function Engagements() {
  return (
    <Section id="engagements" tone="mist" className="py-[clamp(84px,10vw,156px)]">
      <div className="shell">
        <Reveal className="max-w-[46rem]">
          <Eyebrow>Engagements</Eyebrow>
          <h2 className="type-1 mt-6 text-balance text-ink-900">Three ways to work with us.</h2>
          <p className="lede mt-6 max-w-[46ch]">
            Fixed scope, fixed price, quoted after the blueprint — so you know the number before you commit
            to anything.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:mt-20 lg:grid-cols-3 lg:gap-6">
          {TIERS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.07}>
              <div
                className={`flex h-full flex-col rounded-[26px] p-8 sm:p-9 ${
                  t.feature
                    ? 'bg-ink-800 text-white shadow-[0_50px_90px_-50px_rgba(0,0,0,0.55)]'
                    : 'border border-black/[0.07] bg-white'
                }`}
              >
                {/* A fixed badge row keeps all three titles on the same baseline */}
                <div className="mb-5 flex h-6 items-center">
                  {t.feature ? (
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-white/75">
                      Most chosen
                    </span>
                  ) : null}
                </div>
                <h3 className={`type-3 ${t.feature ? 'text-white' : 'text-ink-900'}`}>{t.name}</h3>
                <p className={`mt-3 max-w-[30ch] text-[0.9375rem] leading-relaxed ${t.feature ? 'text-white/60' : 'text-mute'}`}>
                  {t.who}
                </p>

                <ul className={`mt-8 space-y-3.5 border-t pt-8 ${t.feature ? 'border-white/12' : 'border-black/[0.08]'}`}>
                  {t.features.map((f) => (
                    <li key={f} className={`flex items-start gap-3 text-[0.9375rem] ${t.feature ? 'text-white/85' : 'text-ink-700'}`}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-[3px] shrink-0" aria-hidden="true">
                        <path
                          d="M3 8.5l3.2 3.2L13 5"
                          stroke={t.feature ? '#ffffff' : '#1d1d1f'}
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-10">
                  <p className={`text-[0.8125rem] ${t.feature ? 'text-white/45' : 'text-faint'}`}>
                    Scoped and priced after the blueprint
                  </p>
                  <Button variant={t.feature ? 'light' : 'outline'} className="mt-4 w-full">
                    {t.cta}
                  </Button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-10 max-w-[70ch] text-[0.8125rem] leading-relaxed text-faint">
            No hourly billing and no surprise invoices. If the blueprint shows an app won&apos;t move your
            retention, we will tell you that instead of selling you one.
          </p>
        </Reveal>
      </div>
    </Section>
  )
}
