export type Pt = [number, number]

/** Linear scale: domain → range. */
export function scale(v: number, d0: number, d1: number, r0: number, r1: number) {
  if (d1 === d0) return r0
  return r0 + ((v - d0) / (d1 - d0)) * (r1 - r0)
}

type Cubic = { p1: Pt; c1: Pt; c2: Pt; p2: Pt }

/**
 * Catmull-Rom → cubic Bézier. Gives the soft, confident curve of a keynote
 * chart without the overshoot a naive smoothing produces on monotone data.
 */
function segments(pts: Pt[], tension = 0.82): Cubic[] {
  const out: Cubic[] = []
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? pts[i + 1]
    const c1: Pt = [p1[0] + ((p2[0] - p0[0]) / 6) * tension, p1[1] + ((p2[1] - p0[1]) / 6) * tension]
    const c2: Pt = [p2[0] - ((p3[0] - p1[0]) / 6) * tension, p2[1] - ((p3[1] - p1[1]) / 6) * tension]
    out.push({ p1, c1, c2, p2 })
  }
  return out
}

/** Smooth open path through every point. */
export function linePath(pts: Pt[], tension?: number): string {
  if (pts.length === 0) return ''
  const segs = segments(pts, tension)
  let d = `M${pts[0][0]},${pts[0][1]}`
  for (const s of segs) {
    d += ` C${s.c1[0]},${s.c1[1]} ${s.c2[0]},${s.c2[1]} ${s.p2[0]},${s.p2[1]}`
  }
  return d
}

/** Same curve, closed down to a baseline — for the area wash. */
export function areaPath(pts: Pt[], baseline: number, tension?: number): string {
  if (pts.length === 0) return ''
  const last = pts[pts.length - 1]
  return `${linePath(pts, tension)} L${last[0]},${baseline} L${pts[0][0]},${baseline} Z`
}

function cubicAt(s: Cubic, t: number): Pt {
  const u = 1 - t
  const a = u * u * u
  const b = 3 * u * u * t
  const c = 3 * u * t * t
  const d = t * t * t
  return [
    a * s.p1[0] + b * s.c1[0] + c * s.c2[0] + d * s.p2[0],
    a * s.p1[1] + b * s.c1[1] + c * s.c2[1] + d * s.p2[1],
  ]
}

/**
 * Arc-length-parameterised samples of the curve. Returned `stops` are the
 * fraction of total length at each sample, so a marker driven by the same
 * 0→1 progress as a `strokeDashoffset` reveal stays exactly on the drawn tip.
 */
export function sampleCurve(pts: Pt[], per = 10, tension?: number) {
  const segs = segments(pts, tension)
  const xs: number[] = [pts[0][0]]
  const ys: number[] = [pts[0][1]]
  for (const s of segs) {
    for (let k = 1; k <= per; k++) {
      const [x, y] = cubicAt(s, k / per)
      xs.push(x)
      ys.push(y)
    }
  }
  const cum: number[] = [0]
  for (let i = 1; i < xs.length; i++) {
    const dx = xs[i] - xs[i - 1]
    const dy = ys[i] - ys[i - 1]
    cum.push(cum[i - 1] + Math.hypot(dx, dy))
  }
  const total = cum[cum.length - 1] || 1
  // Strictly increasing and inside [0,1] — the native animation engine rejects
  // anything else (see lib/motion).
  const fractions = cum.map((c) => Math.min(1, Math.max(0, c / total)))
  for (let i = 1; i < fractions.length; i++) {
    if (fractions[i] <= fractions[i - 1]) fractions[i] = Math.min(1, fractions[i - 1] + 1e-6)
  }
  return { xs, ys, stops: fractions }
}

export const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`
