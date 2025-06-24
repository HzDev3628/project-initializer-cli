import { RESPONSE_STATUS } from '@/lib/constants'
import {
  getCodeStyleTools,
  getPackageManager,
  installBiome,
} from '@/lib/services'
import type {
  BasicProps,
  PackageManagersType,
  ResponseStatus,
} from '@/lib/types'
import { confirm, isCancel, select } from '@clack/prompts'
import { execa } from 'execa'
import path from 'node:path'
import { promises as fs } from 'node:fs'
import { oraPromise } from 'ora'
import { chdir } from 'node:process'
import { uninstallCommand } from '@/lib/utils'

interface Props {
  name: string
  options: Partial<BasicProps> &
    Partial<Omit<PackageManagersType, 'bun'>> & {
      backendHono?: boolean
      backendNest?: boolean
      removeUiPackage?: boolean
    }
}

export const monorepo = async (props: Props): Promise<ResponseStatus> => {
  const projectPath = path.resolve(process.cwd(), props.name)

  const packageManager = await getPackageManager(props.options)
  if (isCancel(packageManager)) return { status: RESPONSE_STATUS.CANCELED }

  const codeStyleTool = await getCodeStyleTools({
    eslint: props.options.eslint,
    biome: props.options.biome,
    withPrettier: false,
  })
  if (codeStyleTool.status) return { status: RESPONSE_STATUS.CANCELED }

  const backend = props.options.backendHono
    ? 'hono'
    : props.options.backendNest
      ? 'nest'
      : await select({
          message: 'What do you like to use for the backend ?',
          options: [
            { value: 'hono', label: 'Hono.js' },
            { value: 'nest', label: 'Nest.js' },
          ],
        })
  if (isCancel(backend)) return { status: RESPONSE_STATUS.CANCELED }

  const isRemoveUIPackage =
    props.options.removeUiPackage ??
    (await confirm({ message: 'Do you like remove UI package ?' }))
  if (isCancel(isRemoveUIPackage)) return { status: RESPONSE_STATUS.CANCELED }

  const createCommand =
    packageManager === 'npm'
      ? ['create-turbo@latest']
      : ['dlx', 'create-turbo@latest']

  try {
    await oraPromise(
      async () => {
        await execa(packageManager === 'npm' ? 'npx' : packageManager, [
          ...createCommand,
          props.name,
          '--package-manager',
          packageManager,
        ])
      },
      {
        text: 'Initializing monorepo with Turbo...',
        successText: 'Monorepo initialized successfully.',
        failText: (e) => e.message,
      },
    )
  } catch {
    return { status: RESPONSE_STATUS.CANCELED }
  }

  chdir(projectPath)
  await fs.rm(`${projectPath}/apps/docs`, { recursive: true })

  if (isRemoveUIPackage) {
    try {
      await oraPromise(
        async () => {
          chdir(`${projectPath}/apps/web`)
          await execa(packageManager, [
            uninstallCommand({ packageManager }),
            '@repo/ui',
          ])
          chdir(projectPath)
          await fs.rm(`${projectPath}/packages/ui`, { recursive: true })
        },
        {
          text: 'Removing UI package...',
          successText: 'Drop down UI package successfully.',
          failText: (e) => e.message,
        },
      )
    } catch {
      return { status: RESPONSE_STATUS.CANCELED }
    }
  }

  if (codeStyleTool.biome) {
    try {
      await oraPromise(
        async () => {
          if (!isRemoveUIPackage) {
            await fs.rm(`${projectPath}/packages/ui/eslint-config.mjs`)
          }

          await fs.rm(`${projectPath}/packages/eslint-config`, {
            recursive: true,
          })

          await execa(packageManager, [
            uninstallCommand({ packageManager }),
            'prettier',
          ])

          await fs.rm(`${projectPath}/apps/web/eslint.config.js`)
          chdir(`${projectPath}/apps/web`)

          await execa(packageManager, [
            uninstallCommand({ packageManager }),
            '@repo/eslint-config',
            'eslint',
          ])

          await fs.rm(`${projectPath}/node_modules`, { recursive: true })
          await fs.rm(
            `${projectPath}/${packageManager === 'pnpm' ? 'pnpm-lock.yaml' : 'packages-lock.json'}`,
            { recursive: true },
          )
        },
        {
          text: 'Removing ESlint...',
          successText: 'Uninstall ESlint successfully.',
          failText: (e) => e.message,
        },
      )
    } catch {
      return { status: RESPONSE_STATUS.CANCELED }
    }

    chdir(projectPath)
    await installBiome({ packageManager, projectPath })
  }

  return { status: RESPONSE_STATUS.SUCCESS }
}
