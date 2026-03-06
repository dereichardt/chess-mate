/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
          950: '#0a1929',
        },
        accent: {
          DEFAULT: '#e86c0b',
          hover: '#d45f09',
          subtle: '#fff3e8',
        },
        surface: {
          DEFAULT: '#ffffff',
          subtle: '#f8fafc',
          muted: '#f1f5f9',
        },
        border: {
          DEFAULT: '#e2e8f0',
          strong: '#cbd5e1',
        },
        text: {
          DEFAULT: '#0f172a',
          muted: '#64748b',
          inverse: '#ffffff',
        },
        success: {
          DEFAULT: '#059669',
          subtle: '#d1fae5',
        },
        error: {
          DEFAULT: '#dc2626',
          subtle: '#fee2e2',
        },
        warning: {
          DEFAULT: '#d97706',
          subtle: '#fef3c7',
        },
      },
      spacing: {
        'section': '2rem',
        'section-lg': '3rem',
        'card': '1.5rem',
        'tight': '0.5rem',
        'input': '0.75rem',
        'header': '1rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'h1': ['2rem', { lineHeight: '1.25' }],
        'h2': ['1.5rem', { lineHeight: '1.3' }],
        'h3': ['1.25rem', { lineHeight: '1.4' }],
        'body': ['1rem', { lineHeight: '1.5' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'caption': ['0.875rem', { lineHeight: '1.4' }],
      },
      borderRadius: {
        'card': '0.75rem',
        'card-lg': '1.25rem',
        'button': '0.5rem',
        'input': '0.375rem',
        'pill': '9999px',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
        'elevated': '0 16px 32px -4px rgb(0 0 0 / 0.14), 0 6px 12px -2px rgb(0 0 0 / 0.08)',
        'header': '0 1px 3px 0 rgb(0 0 0 / 0.06)',
        'hero-cta': '0 4px 14px 0 rgb(232 108 11 / 0.4)',
      },
    },
  },
  plugins: [],
}
