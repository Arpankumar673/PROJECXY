/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'projecxy-blue': '#0A84FF',
        'projecxy-bg': '#F8FAFC',
        'projecxy-text': '#0F172A',
        'projecxy-secondary': '#64748B',
        'projecxy-dark': '#050505',
        'projecxy-card': '#FFFFFF',
        'projecxy-border': 'rgba(0,0,0,0.06)',
      },
      borderRadius: {
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
      boxShadow: {
        'linear': '0 0 0 1px rgba(255,255,255,0.05), 0 12px 24px -12px rgba(0,0,0,0.5)',
        'soft': '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.02)',
      }
    },
  },
  plugins: [],
}