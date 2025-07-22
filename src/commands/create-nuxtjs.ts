import { RESPONSE_STATUS } from '@/lib/constants'
import { getDirectory, getPackageManager } from '@/lib/services'
import type {
  BasicProps,
  PackageManagersType,
  ResponseStatus,
} from '@/lib/types'
import { confirm, isCancel } from '@clack/prompts'
import { execa } from 'execa'

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
    props.options.nuxtUI ?? (await confirm({ message: 'Add Shadcn UI ?' }))
  if (isCancel(nuxtUi)) return { status: RESPONSE_STATUS.CANCELED }

  return { status: RESPONSE_STATUS.SUCCESS }
}
