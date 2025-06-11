import path from 'node:path'
import { chdir } from 'node:process'
import { isCancel } from '@clack/prompts'
import { oraPromise } from '@/lib/ora-promise'
import chalk from 'chalk'
import { execa } from 'execa'
import {
  getCodeStyleTools,
  getPackageManager,
  installEslintPrettier,
  installBiome,
  pushToRepo,
} from '@/lib/services'
import { log } from '@/lib/utils'
import type {
  BasicProps,
  PackageManagersType,
  ResponseStatus,
} from '@/lib/types'
import { MESSAGES_AFTER_INSTALL, RESPONSE_STATUS } from '@/lib/constants'

interface Props {
  name: string
  options: Partial<BasicProps> & Partial<PackageManagersType>
}

export const createHono = async (props: Props): Promise<ResponseStatus> => {
  const projectPath = path.resolve(process.cwd(), props.name)

  const packageManager = await getPackageManager(props.options)
  if (isCancel(packageManager)) return { status: RESPONSE_STATUS.CANCELED }

  try {
    await execa(packageManager, ['-v'])
  } catch {
    return { status: RESPONSE_STATUS.CANCELED, packageManagerNotFound: true }
  }

  const codeStyleTools = await getCodeStyleTools({
    eslintPrettier: props.options.eslintPrettier,
    biome: props.options.biome,
    withPrettier: true,
  })
  if (codeStyleTools.status) return { status: RESPONSE_STATUS.CANCELED }

  try {
    await oraPromise({
      text: 'Initializing Hono.js project...',
      successText: 'Project initialized successfully.',
      fn: async () => {
        packageManager === 'npm'
          ? await execa(packageManager, [
              'create',
              'hono@latest',
              props.name,
              '--',
              '--template',
              'nodejs',
              '--install',
              '--pm',
              packageManager,
            ])
          : await execa(packageManager, [
              'create',
              packageManager === 'yarn' || packageManager === 'pnpm'
                ? 'hono'
                : 'hono@latest',
              props.name,
              '--template',
              'nodejs',
              '--install',
              '--pm',
              packageManager,
            ])
      },
    })
  } catch {
    return { status: RESPONSE_STATUS.CANCELED }
  }

  chdir(projectPath)

  if (codeStyleTools.biome) {
    await installBiome({
      packageManager,
      projectPath,
    })
  }

  if (codeStyleTools.eslintPrettier) {
    const res = await installEslintPrettier({
      packageManager,
      projectPath,
    })
    if (res.status === RESPONSE_STATUS.CANCELED)
      return { status: RESPONSE_STATUS.CANCELED }
  }

  if (props.options.git) {
    await pushToRepo({ repoUrl: props.options.git })
  }

  log(chalk.green(MESSAGES_AFTER_INSTALL.HONO))

  return { status: RESPONSE_STATUS.SUCCESS }
}
