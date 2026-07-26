import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { useEffect, useRef } from 'react'

/** A single ink hairline across the top, filling with read progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const x = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 })
  return (
    <motion.div
      style={{ scaleX: x }}
      // `difference` keeps the line legible over white sections and black ones
      // alike, without having to know which is behind it.
      className="fixed inset-x-0 top-0 z-[55] h-[2px] origin-left bg-white mix-blend-difference"
      aria-hidden="true"
    />
  )
}

/* ------------------------------------------------------------------ *
 * Cursor trail
 * ------------------------------------------------------------------ */

const LIFE = 440 // ms a point stays on the page
const MAX_PTS = 220

/**
 * An ink trail: the pointer leaves a tapered stroke that dries off in under
 * half a second, plus a dot that springs along behind the real cursor. Drawn on
 * a DPR-scaled canvas, sampled from coalesced pointer events so a fast flick is
 * a smooth curve rather than a run of straight chords.
 *
 * Painted in white through `mix-blend-mode: difference`, so the same stroke
 * reads dark on the white sections and light on the black ones without having
 * to know which is underneath.
 *
 * The native cursor is deliberately left visible — this decorates the pointer,
 * it doesn't replace it. Mounted only for fine pointing devices, skipped
 * entirely under `prefers-reduced-motion`, and the loop parks itself when the
 * pointer stops so an idle tab costs nothing.
 */
export function CursorTrail() {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    // Touch and pen have no hovering cursor to decorate.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    let w = 0
    let h = 0
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    type Pt = { x: number; y: number; t: number }
    const pts: Pt[] = []
    let targetX = -200
    let targetY = -200
    let dotX = -200
    let dotY = -200
    let seen = false
    let lastMove = 0
    let raf = 0

    const push = (x: number, y: number, t: number) => {
      const prev = pts[pts.length - 1]
      // Skip sub-pixel jitter; it only costs fill rate.
      if (prev && Math.abs(prev.x - x) < 0.6 && Math.abs(prev.y - y) < 0.6) return
      pts.push({ x, y, t })
      if (pts.length > MAX_PTS) pts.shift()
    }

    const onMove = (e: PointerEvent) => {
      const now = performance.now()
      lastMove = now
      targetX = e.clientX
      targetY = e.clientY
      if (!seen) {
        // Don't draw a stroke from the corner to wherever the pointer first appears.
        seen = true
        dotX = targetX
        dotY = targetY
      }
      const coalesced = e.getCoalescedEvents?.() ?? []
      if (coalesced.length > 1) {
        const step = LIFE / 6
        coalesced.forEach((c, i) => push(c.clientX, c.clientY, now - (coalesced.length - 1 - i) * (step / coalesced.length)))
      } else {
        push(e.clientX, e.clientY, now)
      }
      if (!raf) raf = requestAnimationFrame(frame)
    }

    const onLeave = () => {
      lastMove = 0
      pts.length = 0
    }

    function frame() {
      const now = performance.now()
      while (pts.length && now - pts[0].t > LIFE) pts.shift()
      ctx!.clearRect(0, 0, w, h)

      // The stroke: one round-capped segment per sample, thinning and fading
      // with age, so the tail reads as ink drying rather than a dotted line.
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1]
        const b = pts[i]
        const k = 1 - (now - b.t) / LIFE
        if (k <= 0) continue
        const ease = k * k
        ctx!.strokeStyle = `rgba(255,255,255,${0.46 * ease})`
        ctx!.lineWidth = 0.6 + 6 * ease
        ctx!.lineCap = 'round'
        ctx!.lineJoin = 'round'
        ctx!.beginPath()
        ctx!.moveTo(a.x, a.y)
        ctx!.lineTo(b.x, b.y)
        ctx!.stroke()
      }

      // The dot: lags the true cursor just enough to feel weighted.
      if (seen) {
        dotX += (targetX - dotX) * 0.3
        dotY += (targetY - dotY) * 0.3
        ctx!.fillStyle = 'rgba(255,255,255,0.92)'
        ctx!.beginPath()
        ctx!.arc(dotX, dotY, 3.1, 0, Math.PI * 2)
        ctx!.fill()
      }

      const settled = Math.hypot(targetX - dotX, targetY - dotY) < 0.4
      if (pts.length || !settled || now - lastMove < 120) {
        raf = requestAnimationFrame(frame)
      } else {
        raf = 0
        ctx!.clearRect(0, 0, w, h)
      }
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', resize)
    window.addEventListener('blur', onLeave)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onMove)
      document.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', resize)
      window.removeEventListener('blur', onLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduce])

  return (
    // Nothing is ever drawn on a touch device, so an untouched canvas needs no
    // media query to stay invisible.
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[70] mix-blend-difference"
      aria-hidden="true"
    />
  )
}
