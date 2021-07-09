const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['./src/**/*.html', './src/**/*.vue', './src/**/*.js', './src/assets/css/*'],
  whitelist: ['html', 'body', 'theme-dark', 'theme-light'],
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
})

module.exports = {
  plugins: [
    require('postcss-import'),
    require('tailwindcss')('./tailwind.config.js'),
    require('postcss-nested'),
    require('autoprefixer')(),
    ...(process.env.NODE_ENV === 'production' ? [purgecss] : []),
  ],
}
