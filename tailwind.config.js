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
        background: '#0F172A',
        card: '#1E293B',
        accent: '#7C3AED',
        text: '#F8FAFC',
        muted: '#94A3B8',
        'background-light': '#F8FAFC',
        'card-light': '#FFFFFF',
        'text-light': '#0F172A',
        'muted-light': '#64748B'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
