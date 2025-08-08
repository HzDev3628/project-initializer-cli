import { oraPromise } from '@/lib/ora-promise'
import { execa } from 'execa'
import { promises as fs } from 'node:fs'
import type { PropsPackageManagersType, ResponseStatus } from '@/lib/types'
import { log } from '@/lib/utils'
import chalk from 'chalk'
import {
  DEFAULT_CONFIG_ESLINT,
  DEFAULT_CONFIG_ESLINT_REACT,
  RESPONSE_STATUS,
  DEFAULT_CONFIG_PRETTIER,
  MESSAGES_INSTALL,
  MESSAGES_INSTALL_PRETTIER,
  MESSAGES_SET_UP,
  MESSAGES_SET_UP_PRETTIER,
  DEFAULT_CONFIG_BIOME,
} from '@/lib/constants'

export async function installEslintPrettierReact(props: {
  packageManager: 'npm' | 'yarn'
  projectPath: string
}): Promise<ResponseStatus> {
  try {
    await oraPromise({
      ...MESSAGES_INSTALL,
      fn: async () => {
        await execa(props.packageManager, [
          props.packageManager === 'npm' ? 'install' : 'add',
          props.packageManager === 'npm' ? '--save-dev' : '--dev',
          'eslint',
          '@eslint/js',
          'eslint-plugin-react-hooks',
          'eslint-plugin-react-refresh',
          'typescript-eslint',
          'globals',
          'eslint-config-prettier',
          'eslint-plugin-prettier',
          'prettier',
        ])
      },
    })

    await oraPromise({
      ...MESSAGES_SET_UP,
      fn: async () => {
        await fs.writeFile(
          `${props.projectPath}/eslint.config.ts`,
          DEFAULT_CONFIG_ESLINT_REACT,
          'utf-8',
        )

        await fs.writeFile(
          `${props.projectPath}/.prettierrc`,
          DEFAULT_CONFIG_PRETTIER,
          'utf-8',
        )
      },
    })
  } catch {
    return { status: RESPONSE_STATUS.CANCELED }
  }

  return { status: RESPONSE_STATUS.SUCCESS }
}

export async function installPrettier(
  props: PropsPackageManagersType & {
    projectPath: string
  },
): Promise<ResponseStatus> {
  try {
    await oraPromise({
      ...MESSAGES_INSTALL_PRETTIER,
      fn: async () => {
        await execa(props.packageManager, [
          props.packageManager === 'npm' ? 'install' : 'add',
          props.packageManager === 'npm' || props.packageManager === 'pnpm'
            ? '--save-dev'
            : '--dev',
          'prettier',
        ])
      },
    })

    await oraPromise({
      ...MESSAGES_SET_UP_PRETTIER,
      fn: async () => {
        await fs.writeFile(
          `${props.projectPath}/.prettierrc`,
          DEFAULT_CONFIG_PRETTIER,
          'utf-8',
        )
      },
    })
  } catch {
    return { status: RESPONSE_STATUS.CANCELED }
  }

  return { status: RESPONSE_STATUS.SUCCESS }
}

export async function installEslint(
  props: PropsPackageManagersType & {
    projectPath: string
  },
): Promise<ResponseStatus> {
  try {
    await oraPromise({
      text: 'Installing ESlint...',
      successText: 'ESlint installed successfully.',
      fn: async () => {
        await execa(props.packageManager, [
          props.packageManager === 'pnpm' || props.packageManager === 'yarn'
            ? 'add'
            : 'install',
          props.packageManager === 'npm' || props.packageManager === 'pnpm'
            ? '--save-dev'
            : '--dev',
          'eslint',
          '@eslint/js',
          'globals',
          'typescript-eslint',
        ])
      },
    })

    await oraPromise({
      text: 'Setting up ESlint...',
      successText: 'ESlint was set up successfully.',
      fn: async () => {
        await fs.writeFile(
          `${props.projectPath}/eslint.config.ts`,
          DEFAULT_CONFIG_ESLINT,
          'utf-8',
        )
      },
    })
  } catch {
    return { status: RESPONSE_STATUS.CANCELED }
  }

  return { status: RESPONSE_STATUS.SUCCESS }
}

export async function installEslintPrettier(
  props: PropsPackageManagersType & {
    projectPath: string
  },
): Promise<ResponseStatus> {
  try {
    await oraPromise({
      ...MESSAGES_INSTALL,
      fn: async () => {
        await execa(props.packageManager, [
          props.packageManager === 'pnpm' || props.packageManager === 'yarn'
            ? 'add'
            : 'install',
          props.packageManager === 'npm' || props.packageManager === 'pnpm'
            ? '--save-dev'
            : '--dev',
          'eslint',
          '@eslint/js',
          'globals',
          'typescript-eslint',
          'eslint-config-prettier',
          'eslint-plugin-prettier',
          'prettier',
        ])
      },
    })
    await oraPromise({
      ...MESSAGES_SET_UP,
      fn: async () => {
        await fs.writeFile(
          `${props.projectPath}/eslint.config.ts`,
          DEFAULT_CONFIG_ESLINT,
          'utf-8',
        )
        await fs.writeFile(
          `${props.projectPath}/.prettierrc`,
          DEFAULT_CONFIG_PRETTIER,
          'utf-8',
        )
      },
    })
  } catch {
    return { status: RESPONSE_STATUS.CANCELED }
  }

  return { status: RESPONSE_STATUS.SUCCESS }
}

export const installBiome = async (
  props: PropsPackageManagersType & {
    projectPath: string
    monorepo?: boolean
  },
) => {
  try {
    await oraPromise({
      text: 'Installing Biome...',
      successText: 'Successfully set up Biome and config file.',
      fn: async () => {
        await execa(props.packageManager, [
          props.packageManager === 'npm' ? 'i' : 'add',
          '-D',
          '-E',
          '@biomejs/biome',
        ])

        await execa(
          props.packageManager === 'bun'
            ? 'bunx'
            : props.packageManager === 'pnpm'
              ? 'pnpm'
              : props.packageManager === 'yarn'
                ? 'yarn'
                : 'npx',
          props.packageManager === 'npm'
            ? ['@biomejs/biome', 'init']
            : [
                props.packageManager === 'pnpm' ||
                props.packageManager === 'yarn'
                  ? 'exec'
                  : '--bun',
                'biome',
                'init',
              ],
        )

        const data = await fs.readFile(
          `${props.projectPath}/biome.json`,
          'utf-8',
        )
        const currentConfig = JSON.parse(data)

        const newConfig = {
          ...DEFAULT_CONFIG_BIOME,
          $schema: currentConfig.$schema,
        }

        await fs.writeFile(
          `${props.projectPath}/biome.json`,
          JSON.stringify(newConfig, null, 2),
          'utf-8',
        )
      },
    })
  } catch (e) {
    log(chalk.red(e))
    return process.exit(1)
  }
}
