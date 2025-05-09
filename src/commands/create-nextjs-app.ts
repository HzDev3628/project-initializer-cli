import chalk from 'chalk'
import { log, logAlert } from '../lib/utils.js'
import { execa } from 'execa'
import { chdir } from 'node:process'
import { promises as fs } from 'node:fs'
import { DEFAULT_CONFIG_BIOME } from '../lib/constants.js'
import { confirm, isCancel, select } from '@clack/prompts'

interface Props {
  name: string
  options: {
    shadcn: boolean
    tailwind: boolean
    git: string
    usePnpm: boolean
    useYarn: boolean
    useBun: boolean
    useNpm: boolean
    useBiome: boolean
    turbopack: boolean
  }
}

export async function createNextJsApp(props: Props) {
  const projectPath = `/Users/hzdev/Documents/Development/${props.name}`

  const packageManager = props.options.useBun
    ? 'bun'
    : props.options.usePnpm
      ? 'pnpm'
      : props.options.useYarn
        ? 'yarn'
        : props.options.useNpm
          ? 'npm'
          : await select({
              message: 'Select your package manager:',
              options: [
                { value: 'npm', label: 'npm' },
                { value: 'yarn', label: 'yarn' },
                { value: 'pnpm', label: 'pnpm' },
                { value: 'bun', label: 'bun' },
              ],
            })

  if (isCancel(packageManager)) return process.exit(1)

  const turbopack =
    props.options.turbopack ?? (await confirm({ message: 'Add Turbopack ?' }))

  if (isCancel(turbopack)) return process.exit(1)

  const tailwind =
    props.options.tailwind ??
    (await confirm({
      message: 'Add Tailwind CSS ?',
    }))

  if (isCancel(tailwind)) return process.exit(1)

  const isUseBiome =
    props.options.useBiome ?? (await confirm({ message: 'Add Biome ?' }))

  if (isCancel(isUseBiome)) return process.exit(1)

  const shadcn = tailwind
    ? (props.options.shadcn ??
      (await confirm({
        message: 'Add Shadcn UI ?',
      })))
    : false

  if (isCancel(shadcn)) return process.exit(1)

  await execa(
    'npx',
    [
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
      isUseBiome ? '--no-eslint' : '--eslint',
      `--use-${packageManager}`,
    ],
    { stdio: 'inherit' },
  )

  chdir(projectPath)

  if (isUseBiome) {
    //@NOTE: install biome.
    logAlert('Set up Biome 📚')

    packageManager === 'bun'
      ? await execa('bun', ['add', '--dev', '--exact', '@biomejs/biome'])
      : packageManager === 'pnpm'
        ? await execa('pnpm', [
            'add',
            '--save-dev',
            '--save-exact',
            '@biomejs/biome',
          ])
        : packageManager === 'yarn'
          ? await execa('yarn', ['add', '--dev', '--exact', '@biomejs/biome'])
          : await execa(
              'npm',
              ['install', '--save-dev', '--save-exact', '@biomejs/biome'],
              { stdio: 'inherit' },
            )

    await execa(
      packageManager === 'bun'
        ? 'bunx'
        : packageManager === 'pnpm'
          ? 'pnpm'
          : packageManager === 'yarn'
            ? 'yarn'
            : 'npx',
      [packageManager === 'npm' ? '@biomejs/biome' : 'biome', 'init'],
      { stdio: 'inherit' },
    )

    //@NOTE: overwrite biome config.
    try {
      const data = await fs.readFile(`${projectPath}/biome.json`, 'utf-8')
      const currentConfig = JSON.parse(data)

      const newConfig = {
        $schema: currentConfig.$schema,
        ...DEFAULT_CONFIG_BIOME,
      }

      await fs.writeFile(
        `${projectPath}/biome.json`,
        JSON.stringify(newConfig, null, 2),
        'utf-8',
      )
    } catch (e) {
      log(chalk.red(e))
      return process.exit(1)
    }
  }

  if (shadcn) {
    //@NOTE: shadcn ui.
    logAlert('Set up Shadcn UI ✨')
    await execa('npx', ['shadcn@latest', 'init'], { stdio: 'inherit' })
  }

  if (props.options.git) {
    //@NOTE: git.
    logAlert('Connect git repository 📕')
    await execa('git', ['remote', 'add', 'origin', `${props.options.git}`], {
      stdio: 'inherit',
    })
    await execa('git', ['remote', '-v'], { stdio: 'inherit' })

    logAlert('Create commit 👾')
    await execa('git', ['add', '.'], { stdio: 'inherit' })
    await execa('git', ['commit', '-m', 'init project'], {
      stdio: 'inherit',
    })

    logAlert('Push ⚡️')
    await execa('git', ['push', '--set-upstream', 'origin', 'main'], {
      stdio: 'inherit',
    })
  }

  log(
    chalk.green(`
      Successful installation!
      You can found your project at the following path: ${projectPath}
      `),
  )

  return process.exit(1)
}
