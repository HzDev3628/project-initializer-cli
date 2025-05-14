import { confirm, isCancel } from '@clack/prompts'
import {
  getPackageManager,
  type PackageManagersType,
} from '../lib/services/package-manager.js'
import { execa } from 'execa'
import { chdir } from 'node:process'
import { installBiome } from '../lib/services/install-biome.js'
import chalk from 'chalk'
import { log } from '../lib/utils.js'
import { pushToRepo } from '../lib/services/push-to-repo.js'
import type { BasicProps } from '../lib/services/basic-props.js'

interface Props {
  name: string
  options: Partial<BasicProps> & Partial<PackageManagersType>
}

export const createHono = async (props: Props) => {
  const PROJECT_PATH = `/Users/hzdev/Documents/Development/${props.name}` //@TODO: make dynamic.

  const PACKAGE_MANAGER = await getPackageManager(props.options)
  if (isCancel(PACKAGE_MANAGER)) return process.exit(1)

  const USE_BIOME =
    props.options.useBiome ?? (await confirm({ message: 'Add Biome ?' }))
  if (isCancel(USE_BIOME)) return process.exit(1)

  await execa(
    PACKAGE_MANAGER,
    [
      'create',
      PACKAGE_MANAGER === 'yarn' || PACKAGE_MANAGER === 'pnpm'
        ? 'hono'
        : 'hono@latest',
      props.name,
      // PACKAGE_MANAGER === 'npm' ? '--' : '',
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

  log(chalk.green('Successful install'))

  return process.exit(1)
}
