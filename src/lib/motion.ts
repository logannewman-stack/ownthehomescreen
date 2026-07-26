import { useReducedMotion, useScroll, useSpring } from 'framer-motion'
import type { RefObject } from 'react'

/**
 * Scroll progress for an element, spring-smoothed so scroll-linked motion
 * glides instead of snapping to the wheel. This is what makes the set-pieces
 * feel expensive rather than jittery.
 */
export function useSmoothProgress(ref: RefObject<HTMLElement | null>, offset: [string, string] = ['start end', 'end start']) {
  const { scrollYProgress } = useScroll({
    target: ref,
    // Framer's offset typing is intentionally narrow; the tuple above keeps
    // call sites readable.
    offset: offset as never,
  })
  const reduce = useReducedMotion()
  const smooth = useSpring(scrollYProgress, { stiffness: 130, damping: 30, mass: 0.35, restDelta: 0.0005 })
  return reduce ? scrollYProgress : smooth
}

/**
 * Framer hands scroll-linked transforms to the browser's native animation
 * engine, which rejects keyframe offsets outside [0,1] or out of order — and a
 * rejection unmounts the whole tree. Every progress-driven input range on the
 * page goes through here first.
 */
export function stops(...values: number[]): number[] {
  const out = values.map((v) => Math.min(1, Math.max(0, v)))
  const eps = 1e-4
  for (let i = 1; i < out.length; i++) {
    if (out[i] <= out[i - 1]) out[i] = Math.min(1, out[i - 1] + eps)
  }
  // Clamping at the ceiling can collapse the tail — walk back down if so.
  for (let i = out.length - 2; i >= 0; i--) {
    if (out[i] >= out[i + 1]) out[i] = Math.max(0, out[i + 1] - eps)
  }
  return out
}
