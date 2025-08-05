import { MESSAGES_AFTER_INSTALL, RESPONSE_STATUS } from '@/lib/constants'
import { oraPromise } from '@/lib/ora-promise'
import {
  getDirectory,
  getPackageManagerForVueJs,
  installTailwindVue,
  pushToRepo,
  tailwindConfirm,
  upOneDirectory,
} from '@/lib/services'
import type {
  BasicProps,
  PackageManagersType,
  ResponseStatus,
} from '@/lib/types'
import { checkDir, log } from '@/lib/utils'
import { confirm, isCancel } from '@clack/prompts'
import chalk from 'chalk'
import { execa } from 'execa'
import { chdir } from 'node:process'

interface VueProps {
  jsx: boolean
  vueRouter: boolean
  tailwind: boolean
}

interface Props {
  name: string
  options: Partial<BasicProps> &
    Partial<PackageManagersType> &
    Partial<VueProps>
}

export const createVueJs = async (props: Props): Promise<ResponseStatus> => {
  const { projectPath, workDirectory } = getDirectory({
    projectName: props.name,
    cwd: props.options.cwd,
  })

  const { isDirAlready } = await checkDir(projectPath)

  if (isDirAlready) {
    log(chalk.red('This project name is already taken.'))
    return { status: RESPONSE_STATUS.CANCELED }
  }

  const packageManager = await getPackageManagerForVueJs(props.options)
  if (isCancel(packageManager)) return { status: RESPONSE_STATUS.CANCELED }

  try {
    await execa(packageManager, ['-v'])
  } catch {
    return { status: RESPONSE_STATUS.CANCELED, packageManagerNotFound: true }
  }

  const tailwind = await tailwindConfirm({ tailwind: props.options.tailwind })
  if (tailwind === RESPONSE_STATUS.CANCELED)
    return { status: RESPONSE_STATUS.CANCELED }

  const jsxSupport =
    props.options.jsx ?? (await confirm({ message: 'Add support for JSX ?' }))
  if (isCancel(jsxSupport)) return { status: RESPONSE_STATUS.CANCELED }

  const vueRouterSupport =
    props.options.vueRouter ?? (await confirm({ message: 'Add Vue router ?' }))
  if (isCancel(vueRouterSupport)) return { status: RESPONSE_STATUS.CANCELED }

  try {
    if (workDirectory) chdir(workDirectory)

    await oraPromise({
      text: 'Initializing Vue.js project...',
      successText: 'Project initializer successfully.',
      fn: async () => {
        await execa(packageManager === 'npm' ? 'npx' : packageManager, [
          ...(packageManager === 'npm'
            ? ['create-vue@latest']
            : ['create', 'vue@latest']),
          props.name,
          '--ts',
          '--vitest',
          '--eslint-with-prettier',
          vueRouterSupport ? '--router' : '',
        ])
      },
    })
  } catch {
    return { status: RESPONSE_STATUS.CANCELED }
  }

  chdir(projectPath)

  if (tailwind) {
    await installTailwindVue({ packageManager, projectPath })
  }

  if (props.options.git) {
    await pushToRepo({ repoUrl: props.options.git })
  }

  chdir(upOneDirectory())
  log(chalk.green(MESSAGES_AFTER_INSTALL.VUE))

  return { status: RESPONSE_STATUS.SUCCESS }
}
