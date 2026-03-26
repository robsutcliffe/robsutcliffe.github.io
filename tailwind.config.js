// @ts-check
const { fontFamily } = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import("tailwindcss/types").Config } */
module.exports = {
  content: [
    './node_modules/pliny/**/*.js',
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './layouts/**/*.{js,ts,tsx}',
    './data/**/*.mdx',
  ],
  darkMode: false,
  theme: {
    extend: {
      backdropBlur: {
        xs: '2px',
      },
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
        16: '4rem',
        18: '4.5rem',
      },
      fontFamily: {
        sans: ['var(--font-bw-quinta-pro)', ...fontFamily.sans],
        serif: [
          'var(--font-bw-darius)',
          {
            letterSpacing: '-0.02em',
          },
          ...fontFamily.serif,
        ],
      },
      colors: {
        primary: '#EE3A24',
        secondary: '#3A24E4',
        red: {
          50: '#FDE9EA',
          100: '#FAC2C3',
          200: '#F79C9A',
          300: '#F47973',
          400: '#F1594B',
          500: '#EE3A24',
          600: '#C3371E',
          700: '#983117',
          800: '#6D2611',
          900: '#43190A',
          950: '#180A04',
        },
        blue: {
          50: '#E9EAFC',
          100: '#C2C3F7',
          200: '#9B9AF3',
          300: '#7973EE',
          400: '#584BE9',
          500: '#3A24E4',
          600: '#361EBB',
          700: '#2E1792',
          800: '#241169',
          900: '#180A40',
          950: '#080417',
        },
        yellow: {
          50: '#FCFBE9',
          100: '#F7F6C2',
          200: '#F2F39A',
          300: '#E8EE73',
          400: '#DCE94B',
          500: '#CEE424',
          600: '#A3BB1E',
          700: '#7B9217',
          800: '#566911',
          900: '#33400A',
          950: '#121704',
        },
        green: {
          50: '#EAFCE9',
          100: '#C3F7C2',
          200: '#9AF39B',
          300: '#73EE79',
          400: '#4BE958',
          500: '#24E43A',
          600: '#1EBB36',
          700: '#17922E',
          800: '#116924',
          900: '#0A4018',
          950: '#04170A',
        },
        cyan: {
          50: '#E9FCFB',
          100: '#C2F7F5',
          200: '#9AF3F3',
          300: '#73E8EE',
          400: '#4BDCE9',
          500: '#24CEE4',
          600: '#1EA3BB',
          700: '#177B92',
          800: '#115669',
          900: '#0A3340',
          950: '#041217',
        },
        purple: {
          50: '#FCE9F7',
          100: '#F7C2EA',
          200: '#F39AE0',
          300: '#EE73D7',
          400: '#E94BD1',
          500: '#E424CE',
          600: '#BB1EAE',
          700: '#92178C',
          800: '#691168',
          900: '#3E0A40',
          950: '#160417',
        },
        gray: colors.gray,
        'ff-red': '#E43A24',
        'ff-yellow': '#CEE424',
        'ff-blue': '#3A24E4',
        'ff-green': '#24E43A',
        'ff-purple': '#E424CE',
        'ff-navy': '#092C39',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            color: theme('colors.blue.800'),
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: `${theme('colors.primary.600')}`,
              },
              code: { color: theme('colors.primary.400') },
            },
            p: {
              fontSize: theme('fontSize.base'),
              lineHeight: theme('lineHeight.6'),
              marginBottom: theme('spacing.2'),
              marginTop: theme('spacing.4'),
            },
            'h1, h2, h3, h4, h5, h6': {
              color: theme('colors.blue.800'),
              fontWeight: '600',
              fontFamily: theme('fontFamily.serif')[0],
            },
            h1: {
              fontSize: theme('fontSize.3xl'),
              lineHeight: theme('lineHeight.12'),
              letterSpacing: '-0.03em',
            },
            h2: {
              marginTop: theme('spacing.8'),
              marginBottom: theme('spacing.2'),
              fontSize: theme('fontSize.2xl'),
            },
            strong: {
              color: theme('colors.blue.800'),
            },
            'h5 strong': {
              color: theme('colors.red.700'),
              fontFamily: theme('fontFamily.sans')[0],
              lineHeight: theme('lineHeight.6'),
              paddingTop: theme('spacing.2'),
              display: 'inline-block',
            },
            hr: {
              border: 'none',
              height: '1px',
              backgroundColor: theme('colors.blue.700'),
              marginTop: theme('spacing.2'),
              marginBottom: `calc(${theme('spacing.8')} - 1px)`,
            },
            code: {
              color: theme('colors.blue.800'),
            },
          },
        },
      }),
      boxShadow: {
        // all sides
        'inset-all': 'inset 0 0 0 1px #2E1792',
        // individual sides
        'inset-t': 'inset 0 1px 0 0 #2E1792',
        'inset-r': 'inset -1px 0 0 0 #2E1792',
        'inset-b': 'inset 0 -1px 0 0 #2E1792',
        'inset-l': 'inset 1px 0 0 0 #2E1792',
        // two-side combos
        'inset-x': 'inset 1px 0 0 0 #2E1792, inset -1px 0 0 0 #2E1792',
        'inset-y': 'inset 0 1px 0 0 #2E1792, inset 0 -1px 0 0 #2E1792',
        'inset-tl': 'inset 0 1px 0 0 #2E1792, inset 1px 0 0 0 #2E1792',
        'inset-tr': 'inset 0 1px 0 0 #2E1792, inset -1px 0 0 0 #2E1792',
        'inset-bl': 'inset 0 -1px 0 0 #2E1792, inset 1px 0 0 0 #2E1792',
        'inset-br': 'inset 0 -1px 0 0 #2E1792, inset -1px 0 0 0 #2E1792',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    ({ addBase, theme }) => {
      addBase({
        html: {
          fontFamily: theme('fontFamily.sans')[0],
        },
        'h1, h2, h3, h4, h5, h6': {
          fontFamily: theme('fontFamily.serif')[0],
        },
      })
    },
  ],
}
