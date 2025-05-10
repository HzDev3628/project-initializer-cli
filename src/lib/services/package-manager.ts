import { select } from '@clack/prompts'

export interface PackageManagersType {
  usePnpm: boolean
  useYarn: boolean
  useBun: boolean
  useNpm: boolean
}

export async function getPackageManager(props: PackageManagersType) {
  return props.useBun
    ? 'bun'
    : props.usePnpm
      ? 'pnpm'
      : props.useYarn
        ? 'yarn'
        : props.useNpm
          ? 'npm'
          : await select({
              message: 'Select your package manager:',
              options: [
                { value: 'npm', label: 'npm' },
                { value: 'yarn', label: 'yarn' },
                { value: 'pnpm', label: 'pnpm' },
                { value: 'bun', label: 'bun' },
              ],
            })
}

export async function getPackageManagerForReactApp(
  props: {
    useVite: boolean
  } & PackageManagersType,
) {
  return props.useBun
    ? 'bun'
    : props.usePnpm
      ? 'pnpm'
      : props.useYarn
        ? 'yarn'
        : props.useNpm
          ? 'npm'
          : await select({
              message: 'Select your package manager:',
              options: props.useVite
                ? [
                    { value: 'npm', label: 'npm' },
                    { value: 'yarn', label: 'yarn' },
                    { value: 'pnpm', label: 'pnpm' },
                    { value: 'bun', label: 'bun' },
                  ]
                : [
                    { value: 'npm', label: 'npm' },
                    { value: 'yarn', label: 'yarn' },
                  ],
            })
}
