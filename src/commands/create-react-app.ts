import path from 'node:path'
import { execa } from 'execa'
import { chdir } from 'node:process'
import { rmSync } from 'node:fs'
import chalk from 'chalk'
import { confirm, isCancel } from '@clack/prompts'
import {
  installBiome,
  pushToRepo,
  getCodeStyleTools,
  tailwindConfirm,
  getPackageManager,
  installShadcnVite,
  getDirectory,
  upOneDirectory,
} from '@/lib/services'
import { log, uninstallCommand } from '@/lib/utils'
import type {
  BasicProps,
  PackageManagersType,
  ResponseStatus,
} from '@/lib/types'
import { MESSAGES_AFTER_INSTALL, RESPONSE_STATUS } from '@/lib/constants'
import { oraPromise } from '@/lib/ora-promise'
import { installTailwindReactVite } from '@/lib/services'

interface Props {
  name: string
  options: Partial<{
    tailwind: boolean
    shadcn: boolean
  }> &
    Partial<PackageManagersType> &
    Partial<BasicProps>
}

export async function createReactApp(props: Props): Promise<ResponseStatus> {
  const { projectPath, workDirectory } = getDirectory({
    projectName: props.name,
    cwd: props.options.cwd,
  })

  if (!props.options) return { status: RESPONSE_STATUS.CANCELED }

  const packageManager = await getPackageManager(props.options)
  if (isCancel(packageManager)) return { status: RESPONSE_STATUS.CANCELED }

  try {
    await execa(packageManager, ['-v'])
  } catch {
    return { status: RESPONSE_STATUS.CANCELED, packageManagerNotFound: true }
  }

  const tailwind = await tailwindConfirm({ tailwind: props.options.tailwind })
  if (tailwind === RESPONSE_STATUS.CANCELED)
    return { status: RESPONSE_STATUS.CANCELED }

  const shadcn = tailwind
    ? (props.options.shadcn ??
      (await confirm({
        message: 'Add Shadcn UI ?',
      })))
    : false

  if (isCancel(shadcn)) return { status: RESPONSE_STATUS.CANCELED }

  const CODE_STYLE_TOOL = await getCodeStyleTools({
    eslint: props.options.eslint,
    biome: props.options.biome,
    withPrettier: false,
  })

  if (CODE_STYLE_TOOL.status) return { status: RESPONSE_STATUS.CANCELED }

  try {
    if (workDirectory) chdir(workDirectory)
    await oraPromise({
      text: 'Initializing React.js project with Vite...',
      successText: 'Project initialized successfully.',
      fn: async () => {
        await execa(packageManager, [
          'create',
          packageManager === 'npm' ? 'vite@latest' : 'vite',
          props.name,
          packageManager === 'npm' ? '--' : '',
          '--template',
          'react-swc-ts',
        ])
      },
    })
  } catch {
    return { status: RESPONSE_STATUS.CANCELED }
  }

  chdir(projectPath)

  await oraPromise({
    text: 'Installing dependencies...',
    successText: 'Dependencies installed successfully.',
    fn: async () => {
      await execa(packageManager, ['install'])
    },
  })

  if (tailwind) {
    try {
      await installTailwindReactVite({
        packageManager,
        projectPath,
      })
    } catch {
      return { status: RESPONSE_STATUS.CANCELED }
    }
  }

  if (shadcn) {
    try {
      await installShadcnVite({ projectPath, packageManager })
    } catch {
      return { status: RESPONSE_STATUS.CANCELED }
    }
  }
  if (CODE_STYLE_TOOL.biome) {
    await execa(packageManager, [
      uninstallCommand({ packageManager }),
      'eslint',
      '@eslint/js',
      'eslint-plugin-react-hooks',
      'eslint-plugin-react-refresh',
      'typescript-eslint',
      'globals',
    ])

    rmSync(path.join(projectPath, 'eslint.config.js'))

    await installBiome({
      packageManager,
      projectPath,
    })
  }

  if (props.options.git) {
    await pushToRepo({ repoUrl: props.options.git })
  }

  log(chalk.green(MESSAGES_AFTER_INSTALL.REACT))
  chdir(upOneDirectory())

  return { status: RESPONSE_STATUS.SUCCESS }
}
