// @TODO: add TIMEOUTS for each command
export const TIMEOUT = 100000 // 100 sec

export const RESPONSE_STATUS = {
  CANCELED: 'canceled',
  SUCCESS: 'success',
} as const

export const DEFAULT_CONFIG_ESLINT = `
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
`

export const DEFAULT_CONFIG_BIOME = {
  files: {
    ignore: ['pnpm-lock.yaml', 'tsconfig.json', 'package-lock.json'],
  },
  formatter: {
    enabled: true,
    formatWithErrors: false,
    indentStyle: 'space',
    indentWidth: 2,
    lineWidth: 80,
  },
  linter: {
    enabled: true,
    rules: {
      recommended: true,
      correctness: {
        noUnusedVariables: 'error',
        noUnusedImports: 'error',
      },
      nursery: {},
      performance: {
        noDelete: 'off',
      },
      style: {
        noNonNullAssertion: 'off',
        useShorthandArrayType: 'error',
      },
      suspicious: {
        noArrayIndexKey: 'off',
        noExplicitAny: 'error',
        noRedeclare: 'off',
      },
      a11y: {
        noSvgWithoutTitle: 'off',
      },
    },
  },
  javascript: {
    parser: {
      unsafeParameterDecoratorsEnabled: true,
    },
    formatter: {
      quoteStyle: 'single',
      semicolons: 'asNeeded',
    },
  },
}
