/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#F0F9F8',
          100: '#D8F3EF', // Soft Aqua
          200: '#B2E4DD',
          300: '#80CEC3',
          400: '#4EB3A6',
          500: '#2C8E82',
          600: '#1F7269',
          700: '#155E63', // Primary Deep Teal
          800: '#12484C',
          900: '#123B3A', // Secondary Dark Evergreen
          950: '#0A2322',
        },
        coral: {
          50: '#FEF4F2',
          100: '#FDE6E2',
          200: '#FBC9BF',
          300: '#F8A594',
          400: '#F47C65', // Accent Warm Coral
          500: '#E9583D',
          600: '#D43C20',
          700: '#B22E17',
          800: '#932917',
          900: '#7B271A',
        },
        mist: {
          50: '#FFFFFF',
          100: '#F8FAF9',
          200: '#F4F7F6', // Application Background (Warm Mist)
          300: '#EAEFE',
          400: '#E1E9E7', // Border
          500: '#C7D4D1',
        },
        humanitarian: {
          bg: '#F4F7F6',
          card: '#FFFFFF',
          primary: '#155E63',
          evergreen: '#123B3A',
          coral: '#F47C65',
          aqua: '#D8F3EF',
          text: '#1D3033',
          muted: '#687A7C',
          border: '#E1E9E7',
          borderDark: '#CBD7D5',
          urgent: '#C83D4D',
          warning: '#B7791F',
          success: '#24856A',
          info: '#397BB5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Mukta Malar', 'Nirmala UI', 'Latha', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(18, 59, 58, 0.04), 0 1px 3px rgba(18, 59, 58, 0.02)',
        'card': '0 4px 20px -2px rgba(21, 94, 99, 0.06), 0 2px 6px -1px rgba(21, 94, 99, 0.04)',
        'dropdown': '0 10px 30px -5px rgba(18, 59, 58, 0.12), 0 4px 10px -2px rgba(18, 59, 58, 0.06)',
        'modal': '0 25px 50px -12px rgba(18, 59, 58, 0.25)',
        'coral-glow': '0 4px 14px rgba(244, 124, 101, 0.35)',
        'teal-glow': '0 4px 14px rgba(21, 94, 99, 0.25)',
      }
    },
  },
  plugins: [],
}

