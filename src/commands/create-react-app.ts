import path from 'node:path'
import { execa } from 'execa'
import { chdir } from 'node:process'
import { rmSync, promises as fs } from 'node:fs'
import chalk from 'chalk'
import { confirm, isCancel } from '@clack/prompts'
import {
  installBiome,
  getPackageManagerForReactApp,
  type PackageManagersType,
  pushToRepo,
} from '@/lib/services'
import { log } from '@/lib/utils'
import type { BasicProps, ResponseStatus } from '@/lib/types'
import { DEFAULT_CONFIG_ESLINT, RESPONSE_STATUS } from '@/lib/constants'
import { oraPromise } from 'ora'

interface Props {
  name: string
  options: Partial<{
    vite: boolean
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

  const USE_BIOME =
    props.options.biome ?? (await confirm({ message: 'Add Biome ?' }))
  if (isCancel(USE_BIOME)) return { status: RESPONSE_STATUS.CANCELED }

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

    if (USE_BIOME) {
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

    if (USE_BIOME) {
      await installBiome({
        packageManager: PACKAGE_MANAGER,
        projectPath: PROJECT_PATH,
      })
    }

    if (!USE_BIOME) {
      try {
        await oraPromise(
          async () => {
            await execa(PACKAGE_MANAGER, [
              PACKAGE_MANAGER === 'yarn' ? 'add' : 'install',
              'eslint',
              '@eslint/js',
              'eslint-plugin-react-hooks',
              'eslint-plugin-react-refresh',
              'typescript-eslint',
              'globals',
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
              `${PROJECT_PATH}/eslint.config.ts`,
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
    }

    if (props.options.git) {
      await pushToRepo({ repoUrl: props.options.git })
    }

    log(chalk.green('Successful installation React.js project!'))

    return { status: RESPONSE_STATUS.SUCCESS }
  }

  return { status: RESPONSE_STATUS.SUCCESS }
}
