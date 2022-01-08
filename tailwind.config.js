module.exports = {
  mode: 'jit',
  purge: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
  theme: {
    container: {
      center: true,
    },
    extend: {
      screens: {
        '2xl': '1536px',
      },
      opacity: {
        '10': 0.1,
        '20': 0.2,
      },
      colors: {
        theme: {
          DEFAULT: 'var(--color-theme)',
          lighter: 'var(--color-theme-lighter)',
          darker: 'var(--color-theme-darker)',
          '100': 'var(--color-theme-100)',
          '200': 'var(--color-theme-200)',
          '300': 'var(--color-theme-300)',
          '400': 'var(--color-theme-400)',
          '500': 'var(--color-theme-500)',
          '600': 'var(--color-theme-600)',
          '700': 'var(--color-theme-700)',
          '800': 'var(--color-theme-800)',
          '900': 'var(--color-theme-900)',
        },
        blue: {
          DEFAULT: '#49BBE9',
          '100': '#FFFFFF',
          '200': '#D2EEF9',
          '300': '#A4DDF4',
          '400': '#77CCEE',
          '500': '#49BBE9',
          '600': '#21ACE4',
          '700': '#188FBF',
          '800': '#137196',
          '900': '#0D526D',
        },
      },
      textColor: {
        theme: {
          DEFAULT: 'var(--color-text-theme)',
          lighter: 'var(--color-text-theme-lighter)',
          darker: 'var(--color-text-theme-darker)',
          '100': 'var(--color-theme-100)',
          '200': 'var(--color-theme-200)',
          '300': 'var(--color-theme-300)',
          '400': 'var(--color-theme-400)',
          '500': 'var(--color-theme-500)',
          '600': 'var(--color-theme-600)',
          '700': 'var(--color-theme-700)',
          '800': 'var(--color-theme-800)',
          '900': 'var(--color-theme-900)',
        },
      },
    },
  },
  variants: {
    borderColor: ['hover', 'focus', 'dark', 'light'],
    backgroundColor: ['hover', 'focus', 'dark', 'light'],
    textColor: ['hover', 'focus', 'dark', 'light'],
  },
  plugins: [
    // rules that apply only for dark theme
    function({ addVariant, e }) {
      addVariant('dark', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.theme-dark .${e(`dark${separator}${className}`)}`
        })
      })
    },
    // rules that apply only for light theme
    function({ addVariant, e }) {
      addVariant('light', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.theme-light .${e(`light${separator}${className}`)}`
        })
      })
    },
  ],
}
