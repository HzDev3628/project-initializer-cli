import { chdir } from 'node:process'
import { confirm, isCancel } from '@clack/prompts'
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
import {
  INDEX_ROUTE,
  MESSAGES_AFTER_INSTALL,
  RESPONSE_STATUS,
  USER_ROUTE,
  ZOD_MIDDLEWARE,
} from '@/lib/constants'
import { mkdir, writeFile } from 'node:fs/promises'

interface Props {
  name: string
  options: Partial<BasicProps> &
    Partial<PackageManagersType> &
    Partial<{ zodMiddleware: boolean }>
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

  const zodMiddleware =
    props.options.zodMiddleware ??
    (await confirm({ message: 'Create Zod middleware ?' }))
  if (isCancel(zodMiddleware)) return { status: RESPONSE_STATUS.CANCELED }

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

  try {
    await oraPromise({
      text: 'Setting up Hono.js app...',
      successText: 'Hono.js app set up successfully.',
      fn: async () => {
        await mkdir(`${projectPath}/src/routers`, { recursive: true })
        await writeFile(
          `${projectPath}/src/routers/user.ts`,
          USER_ROUTE,
          'utf-8',
        )

        await writeFile(`${projectPath}/src/index.ts`, INDEX_ROUTE, 'utf-8')

        if (zodMiddleware) {
          await execa(packageManager, [
            packageManager === 'npm' ? 'install' : 'add',
            'zod',
            'zod-validation-error',
          ])

          await mkdir(`${projectPath}/src/middleware`, { recursive: true })
          await writeFile(
            `${projectPath}/src/middleware/zod.middleware.ts`,
            ZOD_MIDDLEWARE,
            'utf-8',
          )
        }
      },
    })
  } catch {
    return { status: RESPONSE_STATUS.CANCELED }
  }

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
