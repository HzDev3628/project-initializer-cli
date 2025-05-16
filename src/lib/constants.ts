export const TIMEOUT = 10000 // 10 sec

export const RESPONSE_STATUS = {
  CANCELED: 'canceled',
  SUCCESS: 'success',
} as const

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
