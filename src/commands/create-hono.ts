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
  getDirectory,
  upOneDirectory,
} from '@/lib/services'
import { checkDir, log } from '@/lib/utils'
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
  const { projectPath, workDirectory } = getDirectory({
    projectName: props.name,
    cwd: props.options.cwd,
  })

  const { isDirAlready } = await checkDir(projectPath)

  if (isDirAlready) {
    log(chalk.red('This project name is already taken.'))
    return { status: RESPONSE_STATUS.CANCELED }
  }

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
    if (workDirectory) chdir(workDirectory)
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
  chdir(upOneDirectory())

  return { status: RESPONSE_STATUS.SUCCESS }
}
