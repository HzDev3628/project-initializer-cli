import chalk from 'chalk'
import { log, logAlert } from '@/lib/utils'
import { execa } from 'execa'
import { chdir } from 'node:process'
import { confirm, isCancel } from '@clack/prompts'
import {
  getPackageManager,
  type PackageManagersType,
} from '@/lib/services/package-manager'
import { pushToRepo } from '@/lib/services/push-to-repo'
import type { BasicProps } from '@/lib/types/basic-props'
import { installBiome } from '@/lib/services/install-biome'

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

export async function createNextJsApp(props: Props) {
  const PROJECT_PATH = `/Users/hzdev/Documents/Development/${props.name}`

  const PACKAGE_MANAGER = await getPackageManager(props.options)
  if (isCancel(PACKAGE_MANAGER)) return process.exit(1)

  const TURBOPACK =
    props.options.turbopack ?? (await confirm({ message: 'Add Turbopack ?' }))
  if (isCancel(TURBOPACK)) return process.exit(1)

  const TAILWIND =
    props.options.tailwind ??
    (await confirm({
      message: 'Add Tailwind CSS ?',
    }))
  if (isCancel(TAILWIND)) return process.exit(1)

  const IS_USE_BIOME =
    props.options.useBiome ?? (await confirm({ message: 'Add Biome ?' }))
  if (isCancel(IS_USE_BIOME)) return process.exit(1)

  const SHADCN = TAILWIND
    ? (props.options.shadcn ??
      (await confirm({
        message: 'Add Shadcn UI ?',
      })))
    : false

  if (isCancel(SHADCN)) return process.exit(1)

  await execa(
    'npx',
    [
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
    ],
    { stdio: 'inherit' },
  )

  chdir(PROJECT_PATH)

  if (IS_USE_BIOME) {
    await installBiome({
      packageManager: PACKAGE_MANAGER,
      projectPath: PROJECT_PATH,
    })
  }

  if (SHADCN) {
    //@NOTE: shadcn ui.
    logAlert('Set up Shadcn UI ✨')
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

  return process.exit(1)
}
