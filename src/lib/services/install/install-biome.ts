import { execa } from 'execa'
import { log } from '@/lib/utils'
import { promises as fs } from 'node:fs'
import { DEFAULT_CONFIG_BIOME } from '@/lib/constants'
import chalk from 'chalk'
import { oraPromise } from 'ora'
import type { PropsPackageManagersType } from '../../types'

export const installBiome = async (
  props: PropsPackageManagersType & {
    projectPath: string
    monorepo?: boolean
  },
) => {
  try {
    await oraPromise(
      async () => {
        props.packageManager === 'bun'
          ? await execa('bun', ['add', '--dev', '--exact', '@biomejs/biome'])
          : props.packageManager === 'pnpm'
            ? await execa('pnpm', [
                'add',
                '--save-dev',
                '--save-exact',
                '@biomejs/biome',
              ])
            : props.packageManager === 'yarn'
              ? await execa('yarn', [
                  'add',
                  '--dev',
                  '--exact',
                  '@biomejs/biome',
                ])
              : await execa('npm', [
                  'install',
                  '--save-dev',
                  '--save-exact',
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
          [props.packageManager === 'npm' ? '@biomejs/biome' : 'biome', 'init'],
        )

        const data = await fs.readFile(
          `${props.projectPath}/biome.json`,
          'utf-8',
        )
        const currentConfig = JSON.parse(data)

        const newConfig = {
          $schema: currentConfig.$schema,
          ...DEFAULT_CONFIG_BIOME,
        }

        await fs.writeFile(
          `${props.projectPath}/biome.json`,
          JSON.stringify(newConfig, null, 2),
          'utf-8',
        )
      },
      {
        text: 'Installing Biome...',
        successText: 'Successfully set up Biome and config file.',
        failText: 'Something went wrong.',
      },
    )
  } catch (e) {
    log(chalk.red(e))
    return process.exit(1)
  }
}
