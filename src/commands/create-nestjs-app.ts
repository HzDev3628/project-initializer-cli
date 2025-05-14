import { execa } from 'execa'
import { rmSync } from 'node:fs'
import {
  getPackageManagerForNestJs,
  type PackageManagersType,
} from '../lib/services/package-manager.js'
import { confirm, isCancel } from '@clack/prompts'
import path from 'node:path'
import { installBiome } from '../lib/services/install-biome.js'
import { chdir } from 'node:process'
import { pushToRepo } from '../lib/services/push-to-repo.js'
import type { BasicProps } from '../lib/services/basic-props.js'

interface Props {
  name: string
  options: Partial<BasicProps> & Partial<Omit<PackageManagersType, 'useBun'>>
}

export const createNestJsApp = async (props: Props) => {
  const PROJECT_PATH = `/Users/hzdev/Documents/Development/${props.name}` //@TODO: make dynamic.

  const PACKAGE_MANAGER = await getPackageManagerForNestJs(props.options)
  if (isCancel(PACKAGE_MANAGER)) return process.exit(1)

  const USE_BIOME =
    props.options.useBiome ??
    (await confirm({ message: 'Add Biome ? (Default ESlint)' }))
  if (isCancel(USE_BIOME)) return process.exit(1)

  await execa('npm', ['i', '-g', '@nestjs/cli'], { stdio: 'inherit' })
  await execa('nest', ['new', props.name, '--strict', '-p', PACKAGE_MANAGER], {
    stdio: 'inherit',
  })

  chdir(PROJECT_PATH) //@NOTE: Enter to the project.

  if (USE_BIOME) {
    await execa(PACKAGE_MANAGER, [
      'uninstall',
      '@eslint/eslintrc',
      '@eslint/js',
      'eslint',
      'eslint-config-prettier',
      'eslint-plugin-prettier',
      'globals',
      'typescript-eslint',
      'prettier',
    ])

    rmSync(path.join(PROJECT_PATH, '.prettierrc'))
    rmSync(path.join(PROJECT_PATH, 'eslint.config.mjs'))

    await installBiome({
      packageManager: PACKAGE_MANAGER,
      projectPath: PROJECT_PATH,
    })
  }

  if (props.options.git) {
    await pushToRepo({ repoUrl: props.options.git })
  }

  return process.exit(1)
}
