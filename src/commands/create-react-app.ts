import path from 'node:path'
import { execa } from 'execa'
import { chdir } from 'node:process'
import { rmSync } from 'node:fs'
import chalk from 'chalk'
import { isCancel } from '@clack/prompts'
import {
  installBiome,
  pushToRepo,
  codeStyleTools,
  tailwindConfirm,
  getPackageManager,
} from '@/lib/services'
import { log } from '@/lib/utils'
import type {
  BasicProps,
  PackageManagersType,
  ResponseStatus,
} from '@/lib/types'
import { RESPONSE_STATUS } from '@/lib/constants'
import { oraPromise } from 'ora'
import { installTailwindReactVite } from '@/lib/services/install-tailwind-react-vite'

interface Props {
  name: string
  options: Partial<{
    tailwind: boolean
  }> &
    Partial<PackageManagersType> &
    Partial<BasicProps>
}

export async function createReactApp(props: Props): Promise<ResponseStatus> {
  const PROJECT_PATH = path.resolve(process.cwd(), props.name)

  if (!props.options) return { status: RESPONSE_STATUS.CANCELED }

  const PACKAGE_MANAGER = await getPackageManager({
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
