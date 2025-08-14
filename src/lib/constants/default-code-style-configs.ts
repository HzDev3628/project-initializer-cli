export const DEFAULT_CONFIG_BIOME = {
  $schema: 'https://biomejs.dev/schemas/2.0.0/schema.json',
  files: {
    includes: ['**', '!**/pnpm-lock.yaml', '!**/package-lock.json'],
  },
  assist: {
    actions: {
      source: {
        organizeImports: 'off',
      },
    },
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
        useTemplate: 'off',
        noNonNullAssertion: 'off',
        noParameterAssign: 'error',
        useAsConstAssertion: 'error',
        useDefaultParameterLast: 'error',
        useEnumInitializers: 'error',
        useSelfClosingElements: 'error',
        useSingleVarDeclarator: 'error',
        noUnusedTemplateLiteral: 'error',
        useNumberNamespace: 'error',
        noInferrableTypes: 'error',
        noUselessElse: 'error',
        useConsistentArrayType: {
          level: 'error',
          options: { syntax: 'shorthand' },
        },
      },
      suspicious: {
        noArrayIndexKey: 'off',
        noExplicitAny: 'warn',
        noRedeclare: 'off',
      },
      a11y: {
        noSvgWithoutTitle: 'off',
        useMediaCaption: 'off',
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

export const DEFAULT_CONFIG_ESLINT = `
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default tseslint.config(
  eslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: ['./tsconfig.json'],
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'warn',
    },
  },
  {
    ignores: ['dist', 'node_modules'],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
  }
)
`

export const DEFAULT_CONFIG_ESLINT_REACT = `
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default tseslint.config(
  eslintPluginPrettierRecommended,
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
export const DEFAULT_CONFIG_PRETTIER = `{
	"printWidth": 80,
	"tabWidth": 2,
	"useTabs": false,
	"semi": false,
	"singleQuote": true,
	"trailingComma": "none",
	"bracketSpacing": true,
	"arrowParens": "avoid"
}
`
