module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
    // bun: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.eslint.json',
    // sourceType: 'module'
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  ignorePatterns: ['dist', 'node_modules'],
  rules : {
    '@typescript-eslint/no-explicit-any': 'off'
  }
}
