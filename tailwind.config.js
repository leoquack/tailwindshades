module.exports = {
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        theme: {
          default: 'var(--color-theme)',
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
        }
      },
      textColor: {
        theme: {
          default: 'var(--color-text-theme)',
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
        }
      }
    }
  },
  variants: {
    borderColor: ['hover', 'focus', 'dark', 'light'],
    backgroundColor: ['hover', 'focus', 'dark', 'light'],
    textColor: ['hover', 'focus', 'dark', 'light'],
  },
  plugins: [
    // rules that apply only for dark theme
    function ({ addVariant, e }) {
      addVariant('dark', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.theme-dark .${e(`dark${separator}${className}`)}`
        })
      })
    },
    // rules that apply only for light theme
    function ({ addVariant, e }) {
      addVariant('light', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.theme-light .${e(`light${separator}${className}`)}`
        })
      })
    },
  ]
}
