/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'linkedin-blue': '#0A66C2',
        'linkedin-bg': '#F3F6F8',
        'linkedin-text': '#1D2226',
        'linkedin-hover': '#004182',
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'card': '0 0 0 1px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.08)',
      }
    },
  },
  plugins: [],
}