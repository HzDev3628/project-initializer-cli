import chalk from 'chalk'
import { log, logAlert } from '../lib/utils.js'
import { execa } from 'execa'
import { chdir } from 'node:process'
import { promises as fs } from 'node:fs'
import { DEFAULT_CONFIG_BIOME } from '../lib/constants.js'

interface Props {
  name: string
  options: {
    withoutShadcn: boolean
    withoutTailwind: boolean
    git: string
    usePnpm: boolean
    useYarn: boolean
    useBun: boolean
    useBiome: boolean
  }
}

export async function createNextJsApp(props: Props) {
  log(
    chalk.green(`
---------- Creating a project ${props.name} on Next.js ${props.options.withoutShadcn ? 'without' : 'with'} Shadcn UI 🚀 --------`),
  )

  const projectPath = `/Users/hzdev/Documents/Development/${props.name}`

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
      '--turbopack',
      props.options.withoutTailwind ? '--no-tailwind' : '--tailwind',
      props.options.useBiome ? '--no-eslint' : '--eslint',
      props.options.useBun
        ? '--use-bun'
        : props.options.usePnpm
          ? '--use-pnpm'
          : props.options.useYarn
            ? '--use-yarn'
            : '--use-npm',
    ],
    { stdio: 'inherit' },
  )

  chdir(projectPath)

  if (props.options.useBiome) {
    //@NOTE: install biome.
    logAlert('Set up Biome 📚')

    props.options.useBun
      ? await execa('bun', ['add', '--dev', '--exact', '@biomejs/biome'])
      : props.options.usePnpm
        ? await execa('pnpm', [
            'add',
            '--save-dev',
            '--save-exact',
            '@biomejs/biome',
          ])
        : props.options.useYarn
          ? await execa('yarn', ['add', '--dev', '--exact', '@biomejs/biome'])
          : await execa(
              'npm',
              ['install', '--save-dev', '--save-exact', '@biomejs/biome'],
              { stdio: 'inherit' },
            )

    await execa(
      props.options.useBun
        ? 'bunx'
        : props.options.usePnpm
          ? 'pnpm'
          : props.options.useYarn
            ? 'yarn'
            : 'npx',
      [
        props.options.useBun || props.options.usePnpm || props.options.useYarn
          ? 'biome'
          : '@biomejs/biome',
        'init',
      ],
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

  if (!props.options.withoutShadcn) {
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
