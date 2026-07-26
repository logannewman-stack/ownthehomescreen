import { Reveal } from './ui'

const SECTORS = [
  'Coffee & QSR',
  'Auto detailing',
  'Med spas',
  'Home services',
  'Fitness studios',
  'Salons & barbers',
  'Dental',
  'Pet care',
  'Restaurants',
  'Golf & clubs',
  'Landscaping',
  'Boutique retail',
]

/**
 * A quiet band between the fold and the numbers. Two rows drifting in
 * opposite directions, masked at both edges so nothing ever hard-cuts.
 */
export default function Industries() {
  return (
    <div className="relative border-y border-black/[0.07] bg-white py-14 sm:py-16">
      <div className="shell">
        <Reveal>
          <p className="text-center text-[0.8125rem] font-medium tracking-[-0.005em] text-mute">
            Built for the businesses people come back to
          </p>
        </Reveal>
      </div>

      <div className="mask-x mt-9 space-y-4 overflow-hidden">
        <Row items={SECTORS} />
        <Row items={[...SECTORS].reverse()} reverse />
      </div>
    </div>
  )
}

function Row({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items]
  return (
    <div className="flex w-max animate-marquee gap-3.5" style={reverse ? { animationDirection: 'reverse' } : undefined}>
      {doubled.map((s, i) => (
        <span
          key={`${s}-${i}`}
          className="whitespace-nowrap rounded-full border border-black/[0.08] px-5 py-2.5 font-display text-[0.9375rem] font-medium tracking-[-0.015em] text-ink-700/80"
        >
          {s}
        </span>
      ))}
    </div>
  )
}
