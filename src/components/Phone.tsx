import type { ReactNode } from 'react'

/**
 * A resolution-independent iPhone. Every dimension inside is expressed in
 * container-query units, so one component renders pixel-true at 280px wide on
 * a phone and at 900px wide on a 5K display — no bitmaps, nothing to blur.
 *
 * `container-type: inline-size` is set twice on purpose: once on the body (so
 * the frame, radii and buttons scale) and once on the screen (so the app UI
 * inside is authored against the *screen* width).
 */
export function Phone({
  children,
  className = '',
  screenClassName = '',
  shadow = 'light',
}: {
  children: ReactNode
  className?: string
  screenClassName?: string
  shadow?: 'light' | 'dark' | 'none'
}) {
  const shadowClass = shadow === 'light' ? 'shadow-device' : shadow === 'dark' ? 'shadow-device-dark' : ''

  return (
    <div className={`relative aspect-[393/852] w-full select-none [container-type:inline-size] ${className}`}>
      {/* Side buttons — behind the frame, so only the nubs show */}
      <span className="absolute left-[-0.5cqw] top-[17.5cqw] h-[7cqw] w-[1cqw] rounded-l-[0.5cqw] bg-gradient-to-b from-[#b8b8bd] to-[#87878c]" />
      <span className="absolute left-[-0.5cqw] top-[29cqw] h-[12cqw] w-[1cqw] rounded-l-[0.5cqw] bg-gradient-to-b from-[#b8b8bd] to-[#87878c]" />
      <span className="absolute left-[-0.5cqw] top-[44cqw] h-[12cqw] w-[1cqw] rounded-l-[0.5cqw] bg-gradient-to-b from-[#b8b8bd] to-[#87878c]" />
      <span className="absolute right-[-0.5cqw] top-[33cqw] h-[19cqw] w-[1cqw] rounded-r-[0.5cqw] bg-gradient-to-b from-[#b8b8bd] to-[#87878c]" />

      {/* Titanium rail */}
      <div
        className={`relative h-full w-full rounded-[15cqw] p-[1cqw] ${shadowClass}`}
        style={{
          background:
            'linear-gradient(150deg, #f2f2f4 0%, #b9b9c0 14%, #85858c 34%, #cfcfd6 52%, #7e7e85 74%, #b4b4bb 88%, #ededf0 100%)',
        }}
      >
        {/* Black bezel */}
        <div className="relative h-full w-full rounded-[14cqw] bg-[#050506] p-[1.9cqw]">
          {/* Screen */}
          <div
            className={`screen-q relative h-full w-full overflow-hidden rounded-[12.2cqw] bg-white ${screenClassName}`}
          >
            {children}
            {/* Glass reflection — a single soft diagonal, kept very faint */}
            <div
              className="pointer-events-none absolute inset-0 z-40 rounded-[12.2cqw] opacity-[0.55] mix-blend-overlay"
              style={{
                background:
                  'linear-gradient(114deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 24%, rgba(255,255,255,0) 62%, rgba(255,255,255,0.28) 100%)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/** Dynamic Island. Sits above the app UI, inside the screen. */
export function Island({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  return (
    <div className="pointer-events-none absolute left-1/2 top-[2.8cqw] z-30 flex -translate-x-1/2 items-center rounded-full bg-black px-[3.4cqw] py-[1cqw]">
      <span className="h-[7.4cqw] w-[25cqw] rounded-full" />
      <span
        className={`absolute right-[4.4cqw] top-1/2 h-[2.9cqw] w-[2.9cqw] -translate-y-1/2 rounded-full ${
          tone === 'dark' ? 'bg-[#15151a]' : 'bg-[#101016]'
        }`}
      />
    </div>
  )
}

/** iOS status bar: time, cellular, wifi, battery. */
export function StatusBar({ tone = 'dark', time = '9:41' }: { tone?: 'dark' | 'light'; time?: string }) {
  const c = tone === 'dark' ? 'text-ink-900' : 'text-white'
  const fill = tone === 'dark' ? '#0b0b0c' : '#ffffff'
  return (
    <div className={`relative z-20 flex h-[13cqw] items-center justify-between px-[8cqw] pt-[1.5cqw] ${c}`}>
      <span className="text-[3.9cqw] font-semibold tracking-[-0.02em]">{time}</span>
      <span className="flex items-center gap-[1.6cqw]">
        {/* cellular */}
        <svg width="4.6cqw" height="3.4cqw" viewBox="0 0 18 12" className="h-[3.2cqw] w-[4.4cqw]" aria-hidden="true">
          <rect x="0" y="8" width="3" height="4" rx="1" fill={fill} />
          <rect x="5" y="6" width="3" height="6" rx="1" fill={fill} />
          <rect x="10" y="3" width="3" height="9" rx="1" fill={fill} />
          <rect x="15" y="0" width="3" height="12" rx="1" fill={fill} />
        </svg>
        {/* wifi */}
        <svg viewBox="0 0 16 12" className="h-[3.2cqw] w-[4.2cqw]" aria-hidden="true">
          <path
            d="M8 10.6 6.2 8.4A2.6 2.6 0 0 1 8 7.7c.7 0 1.3.25 1.8.7L8 10.6Zm-3.6-4.4-1.5-1.9A8.6 8.6 0 0 1 8 2.4c2 0 3.8.7 5.1 1.9l-1.5 1.9A6.2 6.2 0 0 0 8 4.8c-1.4 0-2.6.5-3.6 1.4Z"
            fill={fill}
          />
        </svg>
        {/* battery */}
        <span className="relative flex h-[3.4cqw] w-[7cqw] items-center">
          <span
            className="absolute inset-0 rounded-[1cqw] border-[0.4cqw]"
            style={{ borderColor: tone === 'dark' ? 'rgba(11,11,12,0.35)' : 'rgba(255,255,255,0.4)' }}
          />
          <span
            className="absolute left-[0.8cqw] top-1/2 h-[1.9cqw] w-[4.3cqw] -translate-y-1/2 rounded-[0.5cqw]"
            style={{ background: fill }}
          />
          <span
            className="absolute right-[-0.9cqw] top-1/2 h-[1.2cqw] w-[0.7cqw] -translate-y-1/2 rounded-r-[0.4cqw]"
            style={{ background: fill, opacity: 0.4 }}
          />
        </span>
      </span>
    </div>
  )
}

/** The home indicator pill. */
export function HomeBar({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  return (
    <div className="absolute bottom-[1.8cqw] left-1/2 z-30 -translate-x-1/2">
      <span
        className="block h-[1.1cqw] w-[34cqw] rounded-full"
        style={{ background: tone === 'dark' ? 'rgba(11,11,12,0.28)' : 'rgba(255,255,255,0.55)' }}
      />
    </div>
  )
}
