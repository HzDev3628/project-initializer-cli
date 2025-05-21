import path from 'node:path'
import { chdir } from 'node:process'
import { isCancel } from '@clack/prompts'
import { oraPromise } from 'ora'
import chalk from 'chalk'
import { execa } from 'execa'
import {
  codeStyleTools,
  getPackageManager,
  installBiome,
  pushToRepo,
} from '@/lib/services'
import { log } from '@/lib/utils'
import type {
  BasicProps,
  PackageManagersType,
  ResponseStatus,
} from '@/lib/types'
import { RESPONSE_STATUS } from '@/lib/constants'
import { installEslintPrettier } from '@/lib/services/install-eslint-prettier'

interface Props {
  name: string
  options: Partial<BasicProps> & Partial<PackageManagersType>
}

export const createHono = async (props: Props): Promise<ResponseStatus> => {
  const PROJECT_PATH = path.resolve(process.cwd(), props.name)

  const PACKAGE_MANAGER = await getPackageManager(props.options)
  if (isCancel(PACKAGE_MANAGER)) return { status: RESPONSE_STATUS.CANCELED }

  const CODE_STYLE_TOOL = await codeStyleTools({
    eslintPrettier: props.options.eslintPrettier,
    biome: props.options.biome,
    withPrettier: true,
  })
  if (CODE_STYLE_TOOL.status) return { status: RESPONSE_STATUS.CANCELED }

  try {
    await oraPromise(
      async () => {
        PACKAGE_MANAGER === 'npm'
          ? await execa(PACKAGE_MANAGER, [
              'create',
              'hono@latest',
              props.name,
              '--',
              '--template',
              'nodejs',
              '--install',
              '--pm',
              PACKAGE_MANAGER,
            ])
          : await execa(PACKAGE_MANAGER, [
              'create',
              PACKAGE_MANAGER === 'yarn' || PACKAGE_MANAGER === 'pnpm'
                ? 'hono'
                : 'hono@latest',
              props.name,
              '--template',
              'nodejs',
              '--install',
              '--pm',
              PACKAGE_MANAGER,
            ])
      },
      {
        text: 'Initializing Hono.js project...',
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

  if (CODE_STYLE_TOOL.eslintPrettier) {
    const res = await installEslintPrettier({
      packageManager: PACKAGE_MANAGER,
      projectPath: PROJECT_PATH,
    })
    if (res.status === RESPONSE_STATUS.CANCELED)
      return { status: RESPONSE_STATUS.CANCELED }
  }

  if (props.options.git) {
    await pushToRepo({ repoUrl: props.options.git })
  }

  log(chalk.green('Successful initialized Hono.js project 🚀'))

  return { status: RESPONSE_STATUS.SUCCESS }
}
