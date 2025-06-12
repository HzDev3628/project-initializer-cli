import { rmSync } from 'node:fs'
import { chdir } from 'node:process'
import path from 'node:path'
import { execa } from 'execa'
import {
  getCodeStyleTools,
  getDirectory,
  getPackageManagerForNestJs,
  installBiome,
  pushToRepo,
  upOneDirectory,
} from '@/lib/services'
import { isCancel } from '@clack/prompts'
import type {
  BasicProps,
  PackageManagersType,
  ResponseStatus,
} from '@/lib/types'
import { MESSAGES_AFTER_INSTALL, RESPONSE_STATUS } from '@/lib/constants'
import { oraPromise } from '@/lib/ora-promise'
import { log, uninstallCommand } from '@/lib/utils'
import chalk from 'chalk'

interface Props {
  name: string
  options: Partial<BasicProps> & Partial<Omit<PackageManagersType, 'bun'>>
}

export const createNestJsApp = async (
  props: Props,
): Promise<ResponseStatus> => {
  const { projectPath, workDirectory } = getDirectory({
    projectName: props.name,
    cwd: props.options.cwd,
  })

  const packageManager = await getPackageManagerForNestJs(props.options)
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
    if (workDirectory) chdir(workDirectory)
    await oraPromise({
      text: 'Installing Nest.js and initializing project...',
      successText: 'Project initialized successfully with Nest CLI.',
      fn: async () => {
        await execa('npm', ['i', '-g', '@nestjs/cli'])
        await execa('nest', [
          'new',
          props.name,
          '--strict',
          '-p',
          packageManager,
        ])
      },
    })
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

  log(chalk.green(MESSAGES_AFTER_INSTALL.NEST))
  chdir(upOneDirectory())

  return { status: RESPONSE_STATUS.SUCCESS }
}
