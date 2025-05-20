import { select } from '@clack/prompts'
import type { PackageManagersType } from '../types'

export async function getPackageManager(props: PackageManagersType) {
  return props.bun
    ? 'bun'
    : props.pnpm
      ? 'pnpm'
      : props.yarn
        ? 'yarn'
        : props.npm
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

export async function getPackageManagerForNestJs(
  props: Omit<PackageManagersType, 'bun'>,
) {
  return props.pnpm
    ? 'pnpm'
    : props.yarn
      ? 'yarn'
      : props.npm
        ? 'npm'
        : await select({
            message: 'Select your package manager:',
            options: [
              { value: 'npm', label: 'npm' },
              { value: 'yarn', label: 'yarn' },
              { value: 'pnpm', label: 'pnpm' },
            ],
          })
}

export async function getPackageManagerForReactApp(
  props: {
    useVite: boolean
  } & PackageManagersType,
) {
  return props.bun
    ? 'bun'
    : props.pnpm
      ? 'pnpm'
      : props.yarn
        ? 'yarn'
        : props.npm
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
