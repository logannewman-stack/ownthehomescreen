/**
 * The one revenue model the whole site speaks from. The results chart, the
 * stat tiles, the after-launch story and the calculator all derive from these
 * constants, so no two sections can ever quote numbers that disagree.
 */

/** Average order value, and the larger basket an app customer tends to build. */
export const AOV = 58
export const BASKET_LIFT = 0.12
export const APP_AOV = AOV * (1 + BASKET_LIFT)

/**
 * Orders per month per acquired customer. The app cohort holds its pace; the
 * web-and-email cohort decays as the cohort lapses, which is what flattens its
 * curve. Totals: 11.2 orders against 8.1 — the +3.1 quoted across the site.
 */
export const APP_RATE = [0.95, 0.95, 0.95, 0.94, 0.94, 0.93, 0.93, 0.93, 0.92, 0.92, 0.92, 0.92]
export const WEB_RATE = [1.0, 0.95, 0.88, 0.82, 0.76, 0.7, 0.64, 0.59, 0.54, 0.49, 0.43, 0.3]

const cumulative = (rates: number[], aov: number) => {
  const out = [0]
  let orders = 0
  for (const r of rates) {
    orders += r
    out.push(Math.round(orders * aov))
  }
  return out
}

/** Cumulative revenue per customer, months 0–12. */
export const APP = cumulative(APP_RATE, APP_AOV)
export const WEB = cumulative(WEB_RATE, AOV)

export const APP_ORDERS = APP_RATE.reduce((a, b) => a + b, 0)
export const WEB_ORDERS = WEB_RATE.reduce((a, b) => a + b, 0)
export const LTV_RATIO = APP[12] / WEB[12]

/** The year-one order-frequency lift, as a whole percentage (38). */
export const FREQ_LIFT_PCT = Math.round((APP_ORDERS / WEB_ORDERS - 1) * 100)

/** Illustrative week-one installs when the launch email lands on a full list. */
export const WEEK1_INSTALLS = 1214

/** Commonly reported open rates by channel — quoted by Manifesto and the first-year story. */
export const OPEN_RATES = [
  { name: 'Push notification', value: 20.4, own: true },
  { name: 'Email', value: 3.2, own: false },
  { name: 'Paid social', value: 1.1, own: false },
] as const
export const OPEN_RATE_AXIS_MAX = 25
