import chalk from 'chalk'
import { log } from '../lib/utils.js'
import { execa } from 'execa'
import { chdir } from 'node:process'
import { confirm, isCancel, select } from '@clack/prompts'

interface Props {
  name: string
  options: {
    vite: boolean
    usePnpm: boolean
    useYarn: boolean
    useBun: boolean
    useNpm: boolean
  }
}

export async function createReactApp(props: Props) {
  const projectPath = `/Users/hzdev/Documents/Development/${props.name}` //@TODO: make dynamic.

  log(
    chalk.white.bold(`
    Welcome to the Speed CLI ⚡️
    `),
  )

  const isUseVite =
    props.options.vite ??
    (await confirm({
      message: 'Will we use Vite?',
    }))

  if (isCancel(isUseVite)) return process.exit(1)

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
              options: isUseVite
                ? [
                    { value: 'npm', label: 'npm' },
                    { value: 'yarn', label: 'yarn' },
                    { value: 'pnpm', label: 'pnpm' },
                    { value: 'bun', label: 'bun' },
                  ]
                : [
                    { value: 'npm', label: 'npm' },
                    { value: 'yarn', label: 'yarn' },
                  ],
            })

  if (isCancel(packageManager)) return process.exit(1)

  if (isUseVite) {
    await execa(
      packageManager,
      [
        'create',
        packageManager === 'npm' ? 'vite@latest' : 'vite',
        props.name,
        packageManager === 'npm' ? '--' : '',
        '--template',
        'react-swc-ts',
      ],
      { stdio: 'inherit' },
    ) // @NOTE: Init react app.

    chdir(projectPath) //@NOTE: Enter to the project.

    await execa(packageManager, ['install'], { stdio: 'inherit' }) // @NOTE: Install all packages.

    log(chalk.green('Successful installation!'))

    return process.exit(1)
  }

  if (!isUseVite) {
    if (packageManager === 'bun' || packageManager === 'pnpm')
      return process.exit(1)

    await execa(
      packageManager,
      [
        packageManager === 'npm' ? 'init' : 'create',
        'react-app',
        props.name,
        '--template',
        'typescript',
      ],
      { stdio: 'inherit' },
    )

    log(chalk.green('Successful installation!'))

    return process.exit(1)
  }
}
