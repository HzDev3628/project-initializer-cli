export const DEFAULT_CONFIG_BIOME = {
  $schema: 'https://biomejs.dev/schemas/2.0.0/schema.json',
  files: {
    includes: ['**', '!**/pnpm-lock.yaml', '!**/package-lock.json'],
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
        noExplicitAny: 'error',
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
