import chalk from 'chalk'
import { log, logAlert } from '../lib/utils.js'
import { execa } from 'execa'
import { chdir } from 'node:process'
import { promises as fs } from 'node:fs'
import { DEFAULT_CONFIG_BIOME } from '../lib/constants.js'
import { confirm, isCancel } from '@clack/prompts'
import {
  getPackageManager,
  type PackageManagersType,
} from '../lib/services/package-manager.js'
import { pushToRepo } from '../lib/services/push-to-repo.js'
import type { BasicProps } from '../lib/services/basic-props.js'

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
    //@NOTE: install biome.
    logAlert('Set up Biome 📚')

    PACKAGE_MANAGER === 'bun'
      ? await execa('bun', ['add', '--dev', '--exact', '@biomejs/biome'])
      : PACKAGE_MANAGER === 'pnpm'
        ? await execa('pnpm', [
            'add',
            '--save-dev',
            '--save-exact',
            '@biomejs/biome',
          ])
        : PACKAGE_MANAGER === 'yarn'
          ? await execa('yarn', ['add', '--dev', '--exact', '@biomejs/biome'])
          : await execa(
              'npm',
              ['install', '--save-dev', '--save-exact', '@biomejs/biome'],
              { stdio: 'inherit' },
            )

    await execa(
      PACKAGE_MANAGER === 'bun'
        ? 'bunx'
        : PACKAGE_MANAGER === 'pnpm'
          ? 'pnpm'
          : PACKAGE_MANAGER === 'yarn'
            ? 'yarn'
            : 'npx',
      [PACKAGE_MANAGER === 'npm' ? '@biomejs/biome' : 'biome', 'init'],
      { stdio: 'inherit' },
    )

    //@NOTE: overwrite biome config.
    try {
      const data = await fs.readFile(`${PROJECT_PATH}/biome.json`, 'utf-8')
      const currentConfig = JSON.parse(data)

      const newConfig = {
        $schema: currentConfig.$schema,
        ...DEFAULT_CONFIG_BIOME,
      }

      await fs.writeFile(
        `${PROJECT_PATH}/biome.json`,
        JSON.stringify(newConfig, null, 2),
        'utf-8',
      )
    } catch (e) {
      log(chalk.red(e))
      return process.exit(1)
    }
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
