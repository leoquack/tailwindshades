module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: ['plugin:vue/essential', 'eslint:recommended'],
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: [
      'error',
      'single',
      {
        avoidEscape: true,
      },
    ],
    semi: ['error', 'never'],
  },
}
