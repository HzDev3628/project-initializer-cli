import { oraPromise } from '@/lib/ora-promise'
import {
  DEFAULT_CONFIG_ESLINT,
  DEFAULT_CONFIG_ESLINT_REACT,
  RESPONSE_STATUS,
  DEFAULT_CONFIG_PRETTIER,
} from '@/lib/constants'
import { execa } from 'execa'
import { promises as fs } from 'node:fs'
import type { PropsPackageManagersType, ResponseStatus } from '@/lib/types'

const MESSAGES_INSTALL = {
  text: 'Installing ESlint & Prettier...',
  successText: 'ESlint & Prettier installed successfully.',
}

const MESSAGES_SET_UP = {
  text: 'Setting up ESlint & Prettier...',
  successText: 'ESlint & Prettier was set up successfully.',
}

const MESSAGES_INSTALL_PRETTIER = {
  text: 'Installing Prettier...',
  successText: 'Prettier installed successfully.',
}

const MESSAGES_SET_UP_PRETTIER = {
  text: 'Setting up Prettier...',
  successText: 'Prettier was set up successfully.',
}

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
