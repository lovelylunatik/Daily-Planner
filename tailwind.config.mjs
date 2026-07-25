/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sage: {50:'#f4f7f4',100:'#e3ebe3',200:'#c7d8c7',300:'#a3bda3',400:'#7a947a',500:'#5c7a5c',600:'#466046',700:'#384d38',800:'#2d3f2d',900:'#263426'},
        navy: {50:'#f1f4f8',100:'#dce3ed',200:'#b8c6d9',300:'#8a9ebf',400:'#5e78a4',500:'#445e8a',600:'#354b6f',700:'#2a3d5a',800:'#1f2f45',900:'#0f172a',950:'#0a1122'},
        parchment: {50:'#fdfcfa',100:'#f9f6f0',200:'#f0e8d8',300:'#e4d5be',400:'#d4bf9e',500:'#c4a882',600:'#a68a68',700:'#7d6750',800:'#5c4a3a',900:'#3d3026'},
        'antique-gold': {200:'#f0e4c8',300:'#e0cca0',400:'#c9a96e',500:'#b89858',600:'#a08850',700:'#7a6a3e'},
        'dusty-rose': {200:'#f0d5d5',300:'#e0b0b4',400:'#c4868a',500:'#b07078',600:'#905860',700:'#704048'},
        'dusty-lavender': {200:'#ddd5e0',300:'#c4b6c8',400:'#a895b6',500:'#8a7a96',600:'#6e6078'}
      },
      fontFamily: {
        typewriter: ['"Special Elite"','"Courier Prime"','Courier','monospace'],
        serif: ['"Cormorant Garamond"','Garamond','Georgia','serif'],
      },
      boxShadow: {
        'paper-sm': '1px 2px 4px rgba(0,0,0,0.12), 2px 3px 8px rgba(0,0,0,0.08)',
        'paper': '2px 3px 8px rgba(0,0,0,0.15), 4px 6px 14px rgba(0,0,0,0.1)',
        'paper-lg': '3px 5px 15px rgba(0,0,0,0.2), 6px 10px 24px rgba(0,0,0,0.12)',
        'glow': '0 0 15px rgba(201,169,110,0.25), 0 0 30px rgba(201,169,110,0.1)',
      }
    }
  },
  plugins: [],
};