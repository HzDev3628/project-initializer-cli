import path from 'node:path'
import { execa } from 'execa'
import { chdir } from 'node:process'
import { rmSync } from 'node:fs'
import chalk from 'chalk'
import { confirm, isCancel } from '@clack/prompts'
import {
  installBiome,
  getPackageManagerForReactApp,
  pushToRepo,
  codeStyleTools,
  tailwindConfirm,
} from '@/lib/services'
import { log } from '@/lib/utils'
import type {
  BasicProps,
  PackageManagersType,
  ResponseStatus,
} from '@/lib/types'
import { RESPONSE_STATUS } from '@/lib/constants'
import { oraPromise } from 'ora'
import { installEslint } from '@/lib/services/install-eslint-prettier'
import { installTailwindReactVite } from '@/lib/services/install-tailwind-react-vite'

interface Props {
  name: string
  options: Partial<{
    vite: boolean
    tailwind: boolean
  }> &
    Partial<PackageManagersType> &
    Partial<BasicProps>
}

export async function createReactApp(props: Props): Promise<ResponseStatus> {
  const PROJECT_PATH = path.resolve(process.cwd(), props.name)

  if (!props.options) return { status: RESPONSE_STATUS.CANCELED }

  const USE_VITE =
    props.options.vite ??
    (await confirm({
      message: 'Will we use Vite?',
    }))
  if (isCancel(USE_VITE)) return { status: RESPONSE_STATUS.CANCELED }

  const PACKAGE_MANAGER = await getPackageManagerForReactApp({
    useVite: USE_VITE,
    ...props.options,
  })
  if (isCancel(PACKAGE_MANAGER)) return { status: RESPONSE_STATUS.CANCELED }

  const TAILWIND = await tailwindConfirm({ tailwind: props.options.tailwind })
  if (TAILWIND === RESPONSE_STATUS.CANCELED)
    return { status: RESPONSE_STATUS.CANCELED }

  const CODE_STYLE_TOOL = await codeStyleTools({
    eslint: props.options.eslint,
    biome: props.options.biome,
    withPrettier: false,
  })
  if (CODE_STYLE_TOOL.status) return { status: RESPONSE_STATUS.CANCELED }

  if (USE_VITE) {
    try {
      await oraPromise(
        async () => {
          await execa(PACKAGE_MANAGER, [
            'create',
            PACKAGE_MANAGER === 'npm' ? 'vite@latest' : 'vite',
            props.name,
            PACKAGE_MANAGER === 'npm' ? '--' : '',
            '--template',
            'react-swc-ts',
          ])
        },
        {
          text: 'Initializing React.js project with Vite...',
          successText: 'Project initialized successfully.',
          failText: 'Something went wrong. Please, try again.',
        },
      )
    } catch {
      return { status: RESPONSE_STATUS.CANCELED }
    }

    chdir(PROJECT_PATH)

    await oraPromise(
      async () => {
        await execa(PACKAGE_MANAGER, ['install'])
      },
      {
        text: 'Installing dependencies...',
        successText: 'Dependencies installed successfully.',
      },
    )

    if (TAILWIND) {
      try {
        await installTailwindReactVite({
          packageManager: PACKAGE_MANAGER,
          projectPath: PROJECT_PATH,
        })
      } catch {
        return { status: RESPONSE_STATUS.CANCELED }
      }
    }

    if (CODE_STYLE_TOOL.biome) {
      await execa(PACKAGE_MANAGER, [
        PACKAGE_MANAGER === 'yarn' ? 'remove' : 'uninstall',
        'eslint',
        '@eslint/js',
        'eslint-plugin-react-hooks',
        'eslint-plugin-react-refresh',
        'typescript-eslint',
        'globals',
      ])

      rmSync(path.join(PROJECT_PATH, 'eslint.config.js'))

      await installBiome({
        packageManager: PACKAGE_MANAGER,
        projectPath: PROJECT_PATH,
      })
    }

    if (props.options.git) {
      await pushToRepo({ repoUrl: props.options.git })
    }

    log(chalk.green('Successful installation React.js project with Vite!'))

    return { status: RESPONSE_STATUS.SUCCESS }
  }

  if (!USE_VITE) {
    if (PACKAGE_MANAGER === 'bun' || PACKAGE_MANAGER === 'pnpm')
      return { status: RESPONSE_STATUS.CANCELED }

    try {
      await oraPromise(
        async () => {
          await execa(PACKAGE_MANAGER, [
            PACKAGE_MANAGER === 'npm' ? 'init' : 'create',
            'react-app',
            props.name,
            '--template',
            'typescript',
          ])
        },
        {
          text: 'Initializing React.js project...',
          successText: 'Project initialized successfully.',
          failText: 'Something went wrong. Please, try again.',
        },
      )
    } catch {
      return { status: RESPONSE_STATUS.CANCELED }
    }

    chdir(PROJECT_PATH)

    if (CODE_STYLE_TOOL.biome) {
      await installBiome({
        packageManager: PACKAGE_MANAGER,
        projectPath: PROJECT_PATH,
      })
    }

    if (CODE_STYLE_TOOL.eslint) {
      const res = await installEslint({
        packageManager: PACKAGE_MANAGER,
        projectPath: PROJECT_PATH,
      })
      if (res.status === RESPONSE_STATUS.CANCELED)
        return { status: RESPONSE_STATUS.CANCELED }
    }

    if (props.options.git) {
      await pushToRepo({ repoUrl: props.options.git })
    }

    log(chalk.green('Successful installation React.js project!'))

    return { status: RESPONSE_STATUS.SUCCESS }
  }

  return { status: RESPONSE_STATUS.SUCCESS }
}
