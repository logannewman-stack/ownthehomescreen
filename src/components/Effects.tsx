import { motion, useScroll, useSpring } from 'framer-motion'

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
