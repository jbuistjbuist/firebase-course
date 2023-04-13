/* eslint-disable global-require */
const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./src/**/*.html', './src/**/*.js'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        teal: colors.teal,
        cyan: colors.cyan,
      },
      //custom animation to fade a component in
      keyframes: {
        appear: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        'appear-mid': 'appear 0.2s linear 1',
      },

      boxShadow: {
        'innerstrong': 'inset 0 3px 6px 0 rgb(0 0 0 / 0.4)'
      }

    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
