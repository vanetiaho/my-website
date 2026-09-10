import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          950: '#08070a',
          900: '#0d0b10',
          850: '#141019',
          800: '#1a1522',
        },
        sunset: {
          navy: '#191b3a',
          plum: '#4a2545',
          burnt: '#c1502e',
          amber: '#e8934a',
          gold: '#f4b860',
          pink: '#f4a3a3',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        display: ['"Space Grotesk"', '"JetBrains Mono"', 'ui-monospace', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'sunset-gradient':
          'linear-gradient(115deg, #191b3a 0%, #4a2545 28%, #c1502e 55%, #e8934a 75%, #f4b860 100%)',
        'sunset-radial':
          'radial-gradient(circle at 50% 120%, #f4b860 0%, #e8934a 22%, #c1502e 42%, #4a2545 66%, #191b3a 100%)',
        'horizon-glow':
          'linear-gradient(180deg, rgba(25,27,58,0) 0%, rgba(74,37,69,0.22) 35%, rgba(232,147,74,0.26) 58%, rgba(193,80,46,0.1) 80%, rgba(13,11,16,0) 100%)',
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(232,147,74,0.55)',
        'glow-sm': '0 0 20px -6px rgba(232,147,74,0.5)',
      },
      keyframes: {
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        'spin-slow': 'spin-slow 6s linear infinite',
        float: 'float 5s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
