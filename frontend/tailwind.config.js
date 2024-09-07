// // tailwind.config.js
// module.exports = {
//   purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
//   darkMode: 'class',  
//   theme: {
//     extend: {}, 
//     keyframes: {
//       marquee: {
//         '0%': { transform: 'translateX(100%)' },
//         '100%': { transform: 'translateX(-100%)' },
//       },
//     },
//     animation: {
//       marquee: 'marquee 5s linear infinite',
//     },
//   },
//   variants: {
//     extend: {},
//   },
//   // plugins: [],
//   plugins: [
//     require('daisyui'),
//   ],
// }




module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'], 
  darkMode: 'class',   
  theme: {
    extend: {  
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        marquee: 'marquee 5s linear infinite',
      },
    },
  },
  variants: {
    extend: {},  
  },
  plugins: [
    require('daisyui'),  
  ],
}
