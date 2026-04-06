/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        wood: {
          dark:  '#2C1A0E',
          mid:   '#6B3A1F',
          warm:  '#A0522D',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light:   '#E8CC7A',
        },
        cream: {
          DEFAULT: '#FAF3E8',
          dark:    '#EEE0C8',
        },
      },
      fontFamily: {
        tajawal: ['Tajawal', 'sans-serif'],
      },
      animation: {
        'fade-down': 'fadeDown 0.6s ease both',
        'fade-up':   'fadeUp 0.6s ease both',
        'pop-in':    'popIn 0.35s ease both',
        'pulse-wa':  'pulseWa 2.5s infinite',
      },
      keyframes: {
        fadeDown: { from: { opacity: '0', transform: 'translateY(-16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeUp:   { from: { opacity: '0', transform: 'translateY(16px)'  }, to: { opacity: '1', transform: 'translateY(0)' } },
        popIn:    { from: { opacity: '0', transform: 'scale(0.88)'       }, to: { opacity: '1', transform: 'scale(1)'     } },
        pulseWa:  { '0%,100%': { boxShadow: '0 5px 20px rgba(37,211,102,.4)' }, '50%': { boxShadow: '0 5px 32px rgba(37,211,102,.7)' } },
      },
    },
  },
  plugins: [],
};
