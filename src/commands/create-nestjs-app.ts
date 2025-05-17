import { execa } from 'execa'
import { rmSync } from 'node:fs'
import {
  getPackageManagerForNestJs,
  type PackageManagersType,
} from '@/lib/services/package-manager'
import { confirm, isCancel } from '@clack/prompts'
import path from 'node:path'
import { installBiome } from '@/lib/services/install-biome'
import { chdir } from 'node:process'
import { pushToRepo } from '@/lib/services/push-to-repo'
import type { BasicProps, ResponseStatus } from '@/lib/types'
import { RESPONSE_STATUS } from '@/lib/constants'
import { oraPromise } from 'ora'
import { log } from '@/lib/utils'
import chalk from 'chalk'

interface Props {
  name: string
  options: Partial<BasicProps> & Partial<Omit<PackageManagersType, 'useBun'>>
}

export const createNestJsApp = async (
  props: Props,
): Promise<ResponseStatus> => {
  const PROJECT_PATH = path.resolve(process.cwd(), props.name)

  const PACKAGE_MANAGER = await getPackageManagerForNestJs(props.options)
  if (isCancel(PACKAGE_MANAGER)) return { status: RESPONSE_STATUS.CANCELED }

  const USE_BIOME =
    props.options.useBiome ??
    (await confirm({ message: 'Add Biome ? (Default ESlint)' }))
  if (isCancel(USE_BIOME)) return { status: RESPONSE_STATUS.CANCELED }

  try {
    await oraPromise(
      async () => {
        await execa('npm', ['i', '-g', '@nestjs/cli'])
        await execa('nest', [
          'new',
          props.name,
          '--strict',
          '-p',
          PACKAGE_MANAGER,
        ])
      },
      {
        text: 'Install Nest.js and init project',
        successText: 'Successful install Nest CLI and init project.',
        failText: 'Something went wrong. Please, try again.',
      },
    )
  } catch {
    return { status: RESPONSE_STATUS.CANCELED }
  }

  chdir(PROJECT_PATH) //@NOTE: Enter to the project.

  if (USE_BIOME) {
    await execa(PACKAGE_MANAGER, [
      PACKAGE_MANAGER === 'yarn' ? 'remove' : 'uninstall',
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

  log(chalk.green('Successful creation Nest.js project.'))
  return { status: RESPONSE_STATUS.SUCCESS }
}
