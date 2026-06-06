/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0E1A',
        panel: '#121829',
        elevated: '#161D33',
        border: '#252C44',
        textp: '#E8ECF4',
        texts: '#9BA6BE',
        textt: '#5E6884',
        emerald2: '#1FE0A0',
        coral: '#FF5C72',
        cyan2: '#2DD4F0',
        gold: '#FFB347',
        violet2: '#9B8CFF',
      },
      fontFamily: {
        display: ['Oxanium', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(31, 224, 160, 0.18)',
        glowGold: '0 0 24px rgba(255, 179, 71, 0.18)',
        glowViolet: '0 0 24px rgba(155, 140, 255, 0.18)',
        glowCoral: '0 0 24px rgba(255, 92, 114, 0.18)',
        glowCyan: '0 0 24px rgba(45, 212, 240, 0.18)',
        card: '0 0 0 1px #252C44, 0 0 24px rgba(155, 140, 255, 0.05)',
      },
      borderRadius: {
        card: '12px',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
    },
  },
  plugins: [],
}
