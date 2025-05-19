import path from 'node:path'
import { chdir } from 'node:process'
import { confirm, isCancel } from '@clack/prompts'
import { oraPromise } from 'ora'
import chalk from 'chalk'
import { execa } from 'execa'
import {
  getPackageManager,
  type PackageManagersType,
  installBiome,
  pushToRepo,
} from '@/lib/services'
import { log } from '@/lib/utils'
import type { BasicProps, ResponseStatus } from '@/lib/types'
import { RESPONSE_STATUS } from '@/lib/constants'

interface Props {
  name: string
  options: Partial<BasicProps> & Partial<PackageManagersType>
}

export const createHono = async (props: Props): Promise<ResponseStatus> => {
  const PROJECT_PATH = path.resolve(process.cwd(), props.name)

  const PACKAGE_MANAGER = await getPackageManager(props.options)
  if (isCancel(PACKAGE_MANAGER)) return { status: RESPONSE_STATUS.CANCELED }

  const USE_BIOME =
    props.options.useBiome ?? (await confirm({ message: 'Add Biome ?' }))
  if (isCancel(USE_BIOME)) return { status: RESPONSE_STATUS.CANCELED }

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

  if (USE_BIOME) {
    await installBiome({
      packageManager: PACKAGE_MANAGER,
      projectPath: PROJECT_PATH,
    })
  }

  if (props.options.git) {
    await pushToRepo({ repoUrl: props.options.git })
  }

  log(chalk.green('Successful initialized Hono.js project 🚀'))

  return { status: RESPONSE_STATUS.SUCCESS }
}
