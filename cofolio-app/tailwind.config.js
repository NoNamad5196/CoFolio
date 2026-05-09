/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          950: '#070912',
          900: '#0b0f1d',
          800: '#0f1428',
          700: '#151b34',
          600: '#1d2542',
        },
        violet: { 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed' },
        indigo: { 400: '#818cf8', 500: '#6366f1' },
        cyan: { 400: '#22d3ee', 500: '#06b6d4' },
        blue: { 400: '#60a5fa' },
      },
    },
  },
  plugins: [],
}
