# Own The Home Screen — Marketing Site

The marketing site for **Own The Home Screen**, a B2B studio that designs and builds
custom mobile apps for brands whose customers come back — so retention, order
frequency and lifetime value all move up.

Black on white, a lot of air, and scroll-driven set-pieces in the Apple product-page
tradition. Every device, app screen and chart on the page is vector or CSS, so it
stays razor-sharp on a 5K display and adds no image weight.

## Tech stack

- **React + Vite + TypeScript** — fast, typed SPA
- **Tailwind CSS** — the design system (ink/mist palette, Inter Tight display type)
- **Framer Motion** — spring-smoothed scroll linking, pinned sequences, count-ups
- No image assets, no icon library, no chart library

## The set-pieces

- **Hero** — a pinned three-beat film: the iPhone rises and straightens, the headline
  lifts away, then the device pulls back until it's whole and the numbers arrive
  around it.
- **Results** — a cohort chart drawn by a left-to-right wipe as you scroll, with a
  marker riding the line's tip, direct end labels, a crosshair tooltip (mouse **and**
  arrow keys) and four count-up stat tiles.
- **The app** — a device pinned to the viewport while six real app screens crossfade
  through it against a scrolling narrative (home screen, reorder, rewards, booking,
  wallet, lock-screen push). On mobile it becomes one device per beat.
- **The thesis** — a black section where each word of the statement lights from grey
  to white as you read it, beside an open-rate comparison chart.
- **The maths** — an interactive year-one revenue model: three sliders, spring-settled
  outputs, and a stacked bar whose ink segment *is* the uplift.
- **Process** — five steps with a rule that fills as you scroll past them.
- **Close** — three devices rising out of the floor and dissolving into it.

Plus: a nav that flips to its dark livery over the black sections, a scroll-progress
hairline that stays legible on any background via `mix-blend-difference`, and full
`prefers-reduced-motion` support (every scroll effect resolves to its end state).

## Develop

```bash
npm install
npm run dev      # start dev server
npm run build    # type-check + production build
npm run preview  # preview the production build
npm run lint     # oxlint
```

## Structure

```
src/
  App.tsx                  # section composition
  index.css                # Tailwind layers, type presets, slider + mask utilities
  lib/
    chart.ts               # Catmull-Rom → Bézier paths, arc-length sampling
    motion.ts              # useSmoothProgress + [0,1] progress-stop guard
  components/
    Phone.tsx              # the device: titanium rail, island, status bar
    screens.tsx            # six app screens, authored in container-query units
    Hero.tsx  Industries.tsx  Metrics.tsx  Showcase.tsx  Manifesto.tsx
    Build.tsx  Process.tsx  Model.tsx  Proof.tsx  Engagements.tsx  CTA.tsx
    Nav.tsx  Footer.tsx  Effects.tsx  ContactModal.tsx
    ui.tsx                 # Reveal / Words / ScrollLit / Counter / Sparkline / Button
```

### Two implementation notes worth knowing before you edit

1. **App screens are sized in `cqw`, not `px`.** `Phone` makes the screen a query
   container, so `text-[3.4cqw]` renders identically at 250px wide and 900px wide.
   Rule of thumb: `1cqw ≈ 3.6px` at the iPhone reference width.
2. **Every scroll-driven `useTransform` input range must sit inside `[0,1]`.** Framer
   hands those to the browser's native animation engine, which throws on out-of-range
   or out-of-order offsets — and the throw unmounts the tree. Pass ranges through
   `stops()` from `lib/motion.ts`.

## Before this goes live

- **Numbers — one model, one place to change it.** The results section derives every
  figure it shows from four constants at the top of `Metrics.tsx`: a `$58` average
  order value, a `12%` larger in-app basket, and the two monthly order-rate arrays
  (`8.1` orders a year without the app against `11.2` with it). The curve, the
  endpoint labels, the four stat tiles and the `1.55×` lifetime-value claim are all
  computed from those — change the ticket size and the whole section follows, and
  nothing can drift out of agreement. `Model.tsx` uses the same two lifts
  (`FREQ_LIFT` 0.38, `AOV_LIFT` 0.12), so the calculator lands on the same 1.55×.
  The order frequencies come from published app-versus-web benchmarks, not from
  measured client results — the page says so, and the hero chip in `Hero.tsx` is the
  one figure still hard-coded, so update it alongside. Swap in your own numbers as
  soon as you have them, and keep a disclaimer while they are modelled.
- **Timelines and tiers.** The nine-week schedule in `Process.tsx` and the three
  engagement tiers in `Engagements.tsx` are drafts — confirm they match what you
  actually sell.
- **Booking form.** Every CTA opens `ContactModal.tsx`, which embeds a single
  `FORM_SRC` URL. Point it at your real form or scheduler.
- **Testimonials.** There are none, deliberately — `Proof.tsx` carries a statement of
  intent instead. Add real, signed-off client quotes there when you have them.
