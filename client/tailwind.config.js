/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#14B8A6',
          hover: '#0D9488',
          light: '#F0FDFA',
          accent: '#F43F5E',
        },
        neutral: {
          bg: 'var(--neutral-bg)',
          card: 'var(--neutral-card)',
          border: 'var(--neutral-border)',
          primary: 'var(--neutral-primary)',
          secondary: 'var(--neutral-secondary)',
        },
        success: {
          text: '#10B981',
          bg: '#F0FDF4',
        },
        warning: {
          text: '#F59E0B',
          bg: '#FFFBEB',
        },
        danger: {
          text: '#EF4444',
          bg: '#FEF2F2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      }
    },
  },
  plugins: [],
}

