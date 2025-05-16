import { confirm, isCancel } from '@clack/prompts'
import {
  getPackageManager,
  type PackageManagersType,
} from '@/lib/services/package-manager'
import { execa } from 'execa'
import { chdir } from 'node:process'
import { installBiome } from '@/lib/services/install-biome'
import chalk from 'chalk'
import { log } from '@/lib/utils'
import { pushToRepo } from '@/lib/services/push-to-repo'
import type { BasicProps, ResponseStatus } from '@/lib/types'
import { RESPONSE_STATUS } from '@/lib/constants'
import path from 'node:path'

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

  PACKAGE_MANAGER === 'npm'
    ? await execa(
        PACKAGE_MANAGER,
        [
          'create',
          'hono@latest',
          props.name,
          '--',
          '--template',
          'nodejs',
          '--install',
          '--pm',
          PACKAGE_MANAGER,
        ],
        { stdio: 'inherit' },
      )
    : await execa(
        PACKAGE_MANAGER,
        [
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
        ],
        { stdio: 'inherit' },
      )

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

  // process.exit(0)
  return { status: RESPONSE_STATUS.SUCCESS }
}
