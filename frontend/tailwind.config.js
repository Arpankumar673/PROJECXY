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
        'linkedin-blue': '#0A84FF', // Transitioning to Projecxy Blue
        'linkedin-bg': '#F8FAFC',
        'linkedin-text': '#0F172A',
        'linkedin-hover': '#0070E0',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'card': '0 0 0 1px rgba(0,0,0,0.05), 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
        'soft': '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.02)',
      }
    },
  },
  plugins: [],
}