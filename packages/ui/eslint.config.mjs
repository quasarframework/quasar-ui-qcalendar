import eslintPlugin from '@typescript-eslint/eslint-plugin'
import eslintParser from '@typescript-eslint/parser'
import js from '@eslint/js'
import globals from 'globals'
import prettierSkipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
  {
    /**
     * Ignore the following files.
     *
     * ESLint requires "ignores" key to be the only one in this object
     */
    ignores: [
      '**/node_modules',
      '**/eslint.config.mjs',
      '**/eslint.config.js',
      '**/.quasar',
      '**/dist',
      'dist/*',
      '**/*.md',
      'dist/*',
      'src-capacitor/*',
      'src-cordova/*',
      '.quasar/*',
      'quasar.config.*.temporary.compiled*',
    ],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: eslintParser,

      parserOptions: {
        project: './tsconfig.json',
        allowDefaultProject: ['*.js', '*.ts'],
      },

      globals: {
        ...globals.node,
      },
    },
    files: ['src/**/*.ts', 'src/**/*.js'], // Match all TypeScript files
    plugins: {
      '@typescript-eslint': eslintPlugin,
    },
    rules: {
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-inferrable-types': 'warn',
      eqeqeq: ['error', 'always'],
      'no-prototype-builtins': 'off',
      'no-console': [
        'warn',
        {
          allow: ['error', 'warn'], // Allow console.error and console.warn
        },
      ],
      // allow debugger during development only
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    },
  },

  prettierSkipFormatting,
]
