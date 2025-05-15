import chalk from 'chalk'
import { log } from '@/lib/utils'
import { execa } from 'execa'
import { chdir } from 'node:process'
import { confirm, isCancel } from '@clack/prompts'
import { rmSync } from 'node:fs'
import path from 'node:path'
import { installBiome } from '@/lib/services/install-biome'
import {
  getPackageManagerForReactApp,
  type PackageManagersType,
} from '@/lib/services/package-manager'
import { pushToRepo } from '@/lib/services/push-to-repo'
import type { BasicProps } from '@/lib/services/basic-props'

interface Props {
  name: string
  options: Partial<{
    vite: boolean
  }> &
    Partial<PackageManagersType> &
    Partial<BasicProps>
}

export async function createReactApp(props: Props) {
  const PROJECT_PATH = `/Users/hzdev/Documents/Development/${props.name}` //@TODO: make dynamic.

  if (!props.options) return process.exit(1)

  const USE_VITE =
    props.options.vite ??
    (await confirm({
      message: 'Will we use Vite?',
    }))
  if (isCancel(USE_VITE)) return process.exit(1)

  const PACKAGE_MANAGER = await getPackageManagerForReactApp({
    useVite: USE_VITE,
    ...props.options,
  })
  if (isCancel(PACKAGE_MANAGER)) return process.exit(1)

  const USE_BIOME =
    props.options.useBiome ?? (await confirm({ message: 'Add Biome ?' }))
  if (isCancel(USE_BIOME)) return process.exit(1)

  if (USE_VITE) {
    await execa(
      PACKAGE_MANAGER,
      [
        'create',
        PACKAGE_MANAGER === 'npm' ? 'vite@latest' : 'vite',
        props.name,
        PACKAGE_MANAGER === 'npm' ? '--' : '',
        '--template',
        'react-swc-ts',
      ],
      { stdio: 'inherit' },
    ) // @NOTE: Init react app.

    chdir(PROJECT_PATH) //@NOTE: Enter to the project.

    await execa(PACKAGE_MANAGER, ['install'], { stdio: 'inherit' }) // @NOTE: Install all packages.

    if (USE_BIOME) {
      await execa(PACKAGE_MANAGER, [
        'uninstall',
        'eslint',
        '@eslint/js',
        'eslint-plugin-react-hooks',
        'eslint-plugin-react-refresh',
        'typescript-eslint',
        'globals',
      ])

      rmSync(path.join(PROJECT_PATH, 'eslint.config.js'))

      await installBiome({
        packageManager: PACKAGE_MANAGER,
        projectPath: PROJECT_PATH,
      })
    }

    if (props.options.git) {
      await pushToRepo({ repoUrl: props.options.git })
    }

    log(chalk.green('Successful installation!'))

    return process.exit(1)
  }

  if (!USE_VITE) {
    if (PACKAGE_MANAGER === 'bun' || PACKAGE_MANAGER === 'pnpm')
      return process.exit(1)

    await execa(
      PACKAGE_MANAGER,
      [
        PACKAGE_MANAGER === 'npm' ? 'init' : 'create',
        'react-app',
        props.name,
        '--template',
        'typescript',
      ],
      { stdio: 'inherit' },
    ) // @NOTE: Init react app.

    chdir(PROJECT_PATH) //@NOTE: Enter to the project.

    if (USE_BIOME) {
      await installBiome({
        packageManager: PACKAGE_MANAGER,
        projectPath: PROJECT_PATH,
      })
    }

    if (!USE_BIOME) {
      await execa(
        PACKAGE_MANAGER,
        [
          PACKAGE_MANAGER === 'npm' ? 'init' : 'create',
          PACKAGE_MANAGER === 'npm'
            ? '@eslint/config@latest'
            : '@eslint/config',
        ],
        { stdio: 'inherit' },
      )
    }

    if (props.options.git) {
      await pushToRepo({ repoUrl: props.options.git })
    }

    log(chalk.green('Successful installation!'))

    return process.exit(1)
  }
}
