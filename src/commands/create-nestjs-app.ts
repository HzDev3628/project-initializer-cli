import { rmSync } from 'node:fs'
import { chdir } from 'node:process'
import path from 'node:path'
import { execa } from 'execa'
import {
  getCodeStyleTools,
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
import { log, uninstallCommand } from '@/lib/utils'
import chalk from 'chalk'

interface Props {
  name: string
  options: Partial<BasicProps> & Partial<Omit<PackageManagersType, 'bun'>>
}

export const createNestJsApp = async (
  props: Props,
): Promise<ResponseStatus> => {
  const projectPath = path.resolve(process.cwd(), props.name)

  const packageManager = await getPackageManagerForNestJs(props.options)
  if (isCancel(packageManager)) return { status: RESPONSE_STATUS.CANCELED }

  const codeStyleTools = await getCodeStyleTools({
    eslintPrettier: props.options.eslintPrettier,
    biome: props.options.biome,
    withPrettier: true,
  })
  if (codeStyleTools.status) return { status: RESPONSE_STATUS.CANCELED }

  try {
    await oraPromise(
      async () => {
        await execa('npm', ['i', '-g', '@nestjs/cli'])
        await execa('nest', [
          'new',
          props.name,
          '--strict',
          '-p',
          packageManager,
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

  chdir(projectPath)

  if (codeStyleTools.biome) {
    await execa(packageManager, [
      uninstallCommand({ packageManager }),
      '@eslint/eslintrc',
      '@eslint/js',
      'eslint',
      'eslint-config-prettier',
      'eslint-plugin-prettier',
      'globals',
      'typescript-eslint',
      'prettier',
    ])

    rmSync(path.join(projectPath, '.prettierrc'))
    rmSync(path.join(projectPath, 'eslint.config.mjs'))

    await installBiome({
      packageManager,
      projectPath,
    })
  }

  if (props.options.git) {
    await pushToRepo({ repoUrl: props.options.git })
  }

  log(chalk.green('Successful creation Nest.js project.'))
  return { status: RESPONSE_STATUS.SUCCESS }
}
