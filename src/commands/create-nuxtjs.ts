import {
  MESSAGES_AFTER_INSTALL,
  NUXT_APP_FILE,
  NUXT_INDEX_FILE,
  NUXT_INDEX_FILE_WITH_NUXT_UI,
  NUXT_MAIN_CSS,
  NUXT_MAIN_CSS_WITH_NUXT_UI,
  RESPONSE_STATUS,
} from '@/lib/constants'
import { oraPromise } from '@/lib/ora-promise'
import {
  getDirectory,
  getPackageManager,
  installPrettier,
  pushToRepo,
  upOneDirectory,
} from '@/lib/services'
import type {
  BasicProps,
  PackageManagersType,
  ResponseStatus,
} from '@/lib/types'
import { log } from '@/lib/utils'
import { confirm, isCancel } from '@clack/prompts'
import chalk from 'chalk'
import { execa } from 'execa'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { chdir } from 'node:process'

interface Props {
  name: string
  options: Partial<{ nuxtUI: boolean }> &
    Partial<PackageManagersType> &
    Partial<Omit<BasicProps, 'eslintPrettier'> & Omit<BasicProps, 'eslint'>>
}

export async function createNuxtJs(props: Props): Promise<ResponseStatus> {
  const { projectPath, workDirectory } = getDirectory({
    projectName: props.name,
    cwd: props.options.cwd,
  })

  const packageManager = await getPackageManager(props.options)
  if (isCancel(packageManager)) return { status: RESPONSE_STATUS.CANCELED }

  try {
    await execa(packageManager, ['-v'])
  } catch {
    return { status: RESPONSE_STATUS.CANCELED, packageManagerNotFound: true }
  }

  const nuxtUi =
    props.options.nuxtUI ?? (await confirm({ message: 'Add Nuxt UI ?' }))
  if (isCancel(nuxtUi)) return { status: RESPONSE_STATUS.CANCELED }

  try {
    if (workDirectory) chdir(workDirectory)

    await oraPromise({
      text: 'Initializing Nuxt.js project...',
      successText: 'Project initializer successfully.',
      fn: async () => {
        await execa('npx', [
          'create-nuxt@latest',
          props.name,
          '--gitInit',
          '--packageManager',
          packageManager,
          '--modules',
          `@nuxt/eslint,@nuxt/test-utils,@nuxt/image${nuxtUi ? ',@nuxt/ui' : ''}`,
        ])
      },
    })
  } catch {
    return { status: RESPONSE_STATUS.CANCELED }
  }

  chdir(projectPath)

  try {
    await oraPromise({
      text: 'Setting up Nuxt.js project...',
      successText: 'Nuxt.js project set up successfully.',
      fn: async () => {
        await rm(`${projectPath}/README.md`)
        await installPrettier({ packageManager, projectPath })
        await writeFile(`${projectPath}/app/app.vue`, NUXT_APP_FILE, 'utf-8')
        await mkdir(`${projectPath}/app/pages`, { recursive: true })
        await writeFile(
          `${projectPath}/app/pages/index.vue`,
          nuxtUi ? NUXT_INDEX_FILE_WITH_NUXT_UI : NUXT_INDEX_FILE,
          'utf-8',
        )
        await writeFile(
          `${projectPath}/app/main.css`,
          nuxtUi ? NUXT_MAIN_CSS_WITH_NUXT_UI : NUXT_MAIN_CSS,
        )
        await execa('git', ['branch', '-m', 'main'])
      },
    })
  } catch {
    return { status: RESPONSE_STATUS.CANCELED }
  }

  if (props.options.git) {
    await pushToRepo({ repoUrl: props.options.git })
  }

  chdir(upOneDirectory())
  log(chalk.green(MESSAGES_AFTER_INSTALL.NUXT))

  return { status: RESPONSE_STATUS.SUCCESS }
}
