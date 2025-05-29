import chalk from 'chalk'
import { chdir } from 'node:process'
import path from 'node:path'
import { execa } from 'execa'
import { oraPromise } from '@/lib/ora-promise'
import { log } from '@/lib/utils'
import { confirm, isCancel } from '@clack/prompts'
import {
  getPackageManager,
  pushToRepo,
  installBiome,
  tailwindConfirm,
  getCodeStyleTools,
  installShadcn,
} from '@/lib/services'
import type { BasicProps } from '@/lib/types/basic-props'
import type { PackageManagersType, ResponseStatus } from '@/lib/types'
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
  const projectPath = path.resolve(process.cwd(), props.name)

  const packageManager = await getPackageManager(props.options)
  if (isCancel(packageManager)) return { status: RESPONSE_STATUS.CANCELED }

  const turbopack =
    props.options.turbopack ?? (await confirm({ message: 'Add Turbopack ?' }))
  if (isCancel(turbopack)) return { status: RESPONSE_STATUS.CANCELED }

  const tailwind = await tailwindConfirm({ tailwind: props.options.tailwind })
  if (tailwind === RESPONSE_STATUS.CANCELED)
    return { status: RESPONSE_STATUS.CANCELED }

  const shadcn = tailwind
    ? (props.options.shadcn ??
      (await confirm({
        message: 'Add Shadcn UI ?',
      })))
    : false
  if (isCancel(shadcn)) return { status: RESPONSE_STATUS.CANCELED }

  const codeStyleTool = await getCodeStyleTools({
    eslint: props.options.eslint,
    biome: props.options.biome,
    withPrettier: false,
  })
  if (codeStyleTool.status) return { status: RESPONSE_STATUS.CANCELED }

  try {
    await oraPromise({
      text: 'Initializing Next.js project...',
      successText: 'Project initialized successfully.',
      fn: async () => {
        await execa('npx', [
          'create-next-app@latest',
          projectPath,
          props.name,
          '--ts',
          '--import-alias',
          '@/*',
          '--src-dir',
          'src',
          '--app',
          turbopack ? '--turbopack' : '--no-turbopack',
          tailwind ? '--tailwind' : '--no-tailwind',
          codeStyleTool.biome ? '--no-eslint' : '--eslint',
          `--use-${packageManager}`,
        ])
      },
    })
  } catch {
    return { status: RESPONSE_STATUS.CANCELED }
  }

  chdir(projectPath)

  if (codeStyleTool.biome) {
    await installBiome({
      packageManager,
      projectPath,
    })
  }

  if (shadcn) {
    try {
      await installShadcn()
    } catch {
      return { status: RESPONSE_STATUS.CANCELED }
    }
  }

  if (props.options.git) {
    await pushToRepo({ repoUrl: props.options.git })
  }

  log(
    chalk.green(`
      Successful installation!
      You can found your project at the following path: ${projectPath}
      `),
  )

  return { status: RESPONSE_STATUS.SUCCESS }
}
