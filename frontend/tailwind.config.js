/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        desert: {
          50: '#FDF8F0',
          100: '#F5E6D0',
          200: '#E8C39E',
          300: '#D4A574',
          400: '#C4956A',
          500: '#B8845A',
          600: '#9A6D48',
          700: '#7A5538',
          800: '#5A3E28',
          900: '#3A2718',
        },
        night: {
          50: '#E8E5E0',
          100: '#C4C0B8',
          200: '#9E9A90',
          300: '#787468',
          400: '#5A564C',
          500: '#3C3A34',
          600: '#2A2824',
          700: '#1E1C1A',
          800: '#121210',
          900: '#0A0A08',
        },
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
