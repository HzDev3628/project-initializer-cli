import chalk from 'chalk'
import { chdir } from 'node:process'
import path from 'node:path'
import { execa } from 'execa'
import { oraPromise } from 'ora'
import { log } from '@/lib/utils'
import { confirm, isCancel } from '@clack/prompts'
import {
  getPackageManager,
  type PackageManagersType,
  pushToRepo,
  installBiome,
} from '@/lib/services'
import type { BasicProps } from '@/lib/types/basic-props'
import type { ResponseStatus } from '@/lib/types'
import { RESPONSE_STATUS } from '@/lib/constants'

interface Props {
  name: string
  options: Partial<{
    shadcn: boolean
    tailwind: boolean
    turbopack: boolean
  }> &
    Partial<PackageManagersType> &
    Partial<BasicProps>
}

export async function createNextJsApp(props: Props): Promise<ResponseStatus> {
  const PROJECT_PATH = path.resolve(process.cwd(), props.name)

  const PACKAGE_MANAGER = await getPackageManager(props.options)
  if (isCancel(PACKAGE_MANAGER)) return { status: RESPONSE_STATUS.CANCELED }

  const TURBOPACK =
    props.options.turbopack ?? (await confirm({ message: 'Add Turbopack ?' }))
  if (isCancel(TURBOPACK)) return { status: RESPONSE_STATUS.CANCELED }

  const TAILWIND =
    props.options.tailwind ??
    (await confirm({
      message: 'Add Tailwind CSS ?',
    }))
  if (isCancel(TAILWIND)) return { status: RESPONSE_STATUS.CANCELED }

  const IS_USE_BIOME =
    props.options.useBiome ?? (await confirm({ message: 'Add Biome ?' }))
  if (isCancel(IS_USE_BIOME)) return { status: RESPONSE_STATUS.CANCELED }

  const SHADCN = TAILWIND
    ? (props.options.shadcn ??
      (await confirm({
        message: 'Add Shadcn UI ?',
      })))
    : false

  if (isCancel(SHADCN)) return { status: RESPONSE_STATUS.CANCELED }

  try {
    await oraPromise(
      async () => {
        await execa('npx', [
          'create-next-app@latest',
          PROJECT_PATH,
          props.name,
          '--ts',
          '--import-alias',
          '@/*',
          '--src-dir',
          'src',
          '--app',
          TURBOPACK ? '--turbopack' : '--no-turbopack',
          TAILWIND ? '--tailwind' : '--no-tailwind',
          IS_USE_BIOME ? '--no-eslint' : '--eslint',
          `--use-${PACKAGE_MANAGER}`,
        ])
      },
      {
        text: 'Initializing Next.js project...',
        successText: 'Project initialized successfully.',
        failText: 'Something went wrong. Please, try again.',
      },
    )
  } catch {
    return { status: RESPONSE_STATUS.CANCELED }
  }

  chdir(PROJECT_PATH)

  if (IS_USE_BIOME) {
    await installBiome({
      packageManager: PACKAGE_MANAGER,
      projectPath: PROJECT_PATH,
    })
  }

  if (SHADCN) {
    log(chalk.green('----- Set up Shadcn UI ✨ -----'))
    await execa('npx', ['shadcn@latest', 'init'], { stdio: 'inherit' })
  }

  if (props.options.git) {
    await pushToRepo({ repoUrl: props.options.git })
  }

  log(
    chalk.green(`
      Successful installation!
      You can found your project at the following path: ${PROJECT_PATH}
      `),
  )

  return { status: RESPONSE_STATUS.SUCCESS }
}
