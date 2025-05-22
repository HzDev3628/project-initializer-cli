import { oraPromise } from 'ora'
import {
  DEFAULT_CONFIG_ESLINT,
  DEFAULT_CONFIG_ESLINT_REACT,
  RESPONSE_STATUS,
} from '../constants'
import { execa } from 'execa'
import { promises as fs } from 'node:fs'
import type { PropsPackageManagersType, ResponseStatus } from '../types'
import { DEFAULT_CONFIG_PRETTIER } from '../constants/default-config-prettier'

const MESSAGES_INSTALL = {
  text: 'Installing ESlint & Prettier...',
  successText: 'ESlint & Prettier installed successfully.',
  failText: 'Something went wrong.',
}

const MESSAGES_SET_UP = {
  text: 'Setting up ESlint & Prettier...',
  successText: 'ESlint & Prettier was set up successfully.',
  failText: 'Something went wrong.',
}

export async function installEslintPrettierReact(props: {
  packageManager: 'npm' | 'yarn'
  projectPath: string
}): Promise<ResponseStatus> {
  try {
    await oraPromise(async () => {
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
    }, MESSAGES_INSTALL)

    await oraPromise(async () => {
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
    }, MESSAGES_SET_UP)
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
    await oraPromise(
      async () => {
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
      {
        text: 'Installing ESlint...',
        successText: 'ESlint installed successfully.',
        failText: 'Something went wrong.',
      },
    )

    await oraPromise(
      async () => {
        await fs.writeFile(
          `${props.projectPath}/eslint.config.ts`,
          DEFAULT_CONFIG_ESLINT,
          'utf-8',
        )
      },
      {
        text: 'Setting up ESlint...',
        successText: 'ESlint was set up successfully.',
        failText: 'Something went wrong.',
      },
    )
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
    await oraPromise(async () => {
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
    }, MESSAGES_INSTALL)

    await oraPromise(async () => {
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
    }, MESSAGES_SET_UP)
  } catch {
    return { status: RESPONSE_STATUS.CANCELED }
  }

  return { status: RESPONSE_STATUS.SUCCESS }
}
