import { rmSync } from 'node:fs'
import { chdir } from 'node:process'
import path from 'node:path'
import { execa } from 'execa'
import {
  codeStyleTools,
  getPackageManagerForNestJs,
  installBiome,
  pushToRepo,
} from '@/lib/services'
import { isCancel } from '@clack/prompts'
import type {
  BasicProps,
  PackageManagersType,
  ResponseStatus,
} from '@/lib/types'
import { RESPONSE_STATUS } from '@/lib/constants'
import { oraPromise } from 'ora'
import { log } from '@/lib/utils'
import chalk from 'chalk'

interface Props {
  name: string
  options: Partial<BasicProps> & Partial<Omit<PackageManagersType, 'bun'>>
}

export const createNestJsApp = async (
  props: Props,
): Promise<ResponseStatus> => {
  const PROJECT_PATH = path.resolve(process.cwd(), props.name)

  const PACKAGE_MANAGER = await getPackageManagerForNestJs(props.options)
  if (isCancel(PACKAGE_MANAGER)) return { status: RESPONSE_STATUS.CANCELED }

  const CODE_STYLE_TOOL = await codeStyleTools({
    eslint: props.options.eslint,
    biome: props.options.biome,
  })
  if (CODE_STYLE_TOOL.status) return { status: RESPONSE_STATUS.CANCELED }

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
        text: 'Installing Nest.js and initializing project...',
        successText: 'Project initialized successfully with Nest CLI.',
        failText: 'Something went wrong. Please, try again.',
      },
    )
  } catch {
    return { status: RESPONSE_STATUS.CANCELED }
  }

  chdir(PROJECT_PATH)

  if (CODE_STYLE_TOOL.biome) {
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
