import { RESPONSE_STATUS } from '@/lib/constants'
import { oraPromise } from '@/lib/ora-promise'
import {
  getCodeStyleTools,
  getDirectory,
  getPackageManager,
  installBiome,
} from '@/lib/services'
import type {
  BasicProps,
  PackageManagersType,
  ResponseStatus,
} from '@/lib/types'
import { confirm, isCancel } from '@clack/prompts'
import { execa } from 'execa'
import { chdir } from 'node:process'

interface Props {
  name: string
  options: Partial<BasicProps> &
    Partial<PackageManagersType> &
    Partial<{
      jsx: boolean
      vueRouter: boolean
    }>
}

export const createVueJs = async (props: Props): Promise<ResponseStatus> => {
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

  const jsxSupport =
    props.options.jsx ?? (await confirm({ message: 'Add support for JSX ?' }))
  if (isCancel(jsxSupport)) return { status: RESPONSE_STATUS.CANCELED }

  const vueRouterSupport =
    props.options.vueRouter ?? (await confirm({ message: 'Add Vue router ?' }))
  if (isCancel(vueRouterSupport)) return { status: RESPONSE_STATUS.CANCELED }

  const codeStyleTools = await getCodeStyleTools({
    eslintPrettier: props.options.eslintPrettier,
    biome: props.options.biome,
    withPrettier: true,
  })

  try {
    if (workDirectory) chdir(workDirectory)
    await oraPromise({
      text: 'Initializing Vue.js project...',
      successText: 'Project initializer successfully.',
      fn: async () => {
        await execa(packageManager, [
          'create',
          'vue@latest',
          props.name,
          '--ts',
          '--vitest',
          vueRouterSupport ? '--router' : '',
          codeStyleTools.eslintPrettier ? '--eslint-with-prettier' : '',
        ])
      },
    })
  } catch {
    return { status: RESPONSE_STATUS.CANCELED }
  }

  chdir(projectPath)

  if (codeStyleTools.biome) {
    await installBiome({ packageManager, projectPath })
  }

  return { status: RESPONSE_STATUS.SUCCESS }
}
