import { execa } from 'execa'
import { log } from '@/lib/utils'
import { promises as fs } from 'node:fs'
import { DEFAULT_CONFIG_BIOME } from '@/lib/constants'
import chalk from 'chalk'
import { oraPromise } from '@/lib/ora-promise'
import type { PropsPackageManagersType } from '../../types'

export const installBiome = async (
  props: PropsPackageManagersType & {
    projectPath: string
    monorepo?: boolean
  },
) => {
  try {
    await oraPromise({
      text: 'Installing Biome...',
      successText: 'Successfully set up Biome and config file.',
      fn: async () => {
        await execa(props.packageManager, [
          props.packageManager === 'npm' ? 'i' : 'add',
          '-D',
          '-E',
          '@biomejs/biome',
        ])

        await execa(
          props.packageManager === 'bun'
            ? 'bunx'
            : props.packageManager === 'pnpm'
              ? 'pnpm'
              : props.packageManager === 'yarn'
                ? 'yarn'
                : 'npx',
          props.packageManager === 'npm'
            ? ['@biomejs/biome', 'init']
            : [
                props.packageManager === 'pnpm' ||
                props.packageManager === 'yarn'
                  ? 'exec'
                  : '--bun',
                'biome',
                'init',
              ],
        )

        const data = await fs.readFile(
          `${props.projectPath}/biome.json`,
          'utf-8',
        )
        const currentConfig = JSON.parse(data)

        const newConfig = {
          ...DEFAULT_CONFIG_BIOME,
          $schema: currentConfig.$schema,
        }

        await fs.writeFile(
          `${props.projectPath}/biome.json`,
          JSON.stringify(newConfig, null, 2),
          'utf-8',
        )
      },
    })
  } catch (e) {
    log(chalk.red(e))
    return process.exit(1)
  }
}
