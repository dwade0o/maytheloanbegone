module.exports = {
  // Run ESLint and Prettier on staged TypeScript/JavaScript files (excluding tests)
  'src/**/*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],

  // Run TypeScript type checking on staged TypeScript files (excluding tests)
  'src/**/*.{ts,tsx}': () => 'tsc --noEmit',

  // Format other files
  '*.{json,md,yml,yaml}': 'prettier --write',
};
