/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Near-black ink (Apple never sets type in pure #000)
        ink: {
          DEFAULT: '#1d1d1f',
          900: '#000000',
          800: '#0b0b0c',
          700: '#1d1d1f',
          600: '#3a3a3c',
        },
        // Secondary + tertiary type
        mute: '#6e6e73',
        faint: '#a1a1a6',
        // Surfaces
        mist: '#f5f5f7',
        fog: '#ebebed',
        // Chart neutrals — emphasis series in ink, recessive series in gray
        chart: {
          ink: '#1d1d1f',
          gray: '#c7c7cc',
          grid: '#e8e8ea',
          mid: '#5a5a5e',
        },
      },
      fontFamily: {
        display: [
          '"Inter Tight"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          'system-ui',
          'sans-serif',
        ],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        display: '-0.045em',
        headline: '-0.035em',
      },
      boxShadow: {
        device: '0 80px 140px -60px rgba(0,0,0,0.55), 0 30px 60px -30px rgba(0,0,0,0.22)',
        'device-dark': '0 80px 140px -50px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.06)',
        lift: '0 30px 70px -35px rgba(0,0,0,0.18)',
        pill: '0 10px 30px -12px rgba(0,0,0,0.35)',
        icon: '0 8px 18px -8px rgba(0,0,0,0.35)',
      },
      transitionTimingFunction: {
        apple: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        ring: {
          '0%': { transform: 'scale(1)', opacity: '0.45' },
          '100%': { transform: 'scale(1.9)', opacity: '0' },
        },
        breathe: {
          '0%,100%': { opacity: '0.35' },
          '50%': { opacity: '0.9' },
        },
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        marquee: 'marquee 38s linear infinite',
        ring: 'ring 2.8s ease-out infinite',
        breathe: 'breathe 3.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
