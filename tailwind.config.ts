import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12'
        },
        secondary: {
          500: '#0ea5e9'
        }
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.12)'
      },
      borderRadius: {
        '2xl': '1.5rem'
      },
      fontFamily: {
        display: ['var(--font-vazirmatn)', 'var(--font-sans)'],
        sans: ['var(--font-sans)']
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};

export default config;
