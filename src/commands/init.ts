import { isCancel, select, text } from '@clack/prompts'
import { createNextJsApp } from './create-nextjs'
import { createHono } from './create-hono'
import { createReactApp } from './create-react'
import type { ResponseStatus } from '@/lib/types'
import { createNestJsApp } from './create-nestjs'
import { RESPONSE_STATUS } from '@/lib/constants'
import { logPackageNotFound } from '@/lib/utils'
import { createVueJs } from './create-vuejs'
import { createNuxtJs } from './create-nuxtjs'

interface Props {
  options?: Partial<{ cwd: string }>
}

export const init = async (props: Props) => {
  const projectName = await text({ message: 'Project name:' })
  if (isCancel(projectName)) return process.exit(1)

  const projectCwd =
    props.options?.cwd ??
    ((await text({
      message: 'Project directory (press "enter" to skip):',
    })) as string)
  if (isCancel(projectCwd)) return process.exit(1)

  const projectType = await select({
    message: 'Select a framework:',
    options: [
      { value: 'next', label: 'Next.js' },
      { value: 'react', label: 'React.js' },
      { value: 'nuxt', label: 'Nuxt.js' },
      { value: 'vue', label: 'Vue.js' },
      { value: 'nest', label: 'Nest.js' },
      { value: 'hono', label: 'Hono.js' },
    ],
  })

  if (isCancel(projectType)) return process.exit(1)

  async function initFn(name: string): Promise<ResponseStatus> {
    const props = {
      name,
      options: {
        cwd: projectCwd,
      },
    }

    switch (projectType) {
      case 'hono':
        return await createHono(props)
      case 'react':
        return await createReactApp(props)
      case 'nest':
        return await createNestJsApp(props)
      case 'vue':
        return await createVueJs(props)
      case 'nuxt':
        return await createNuxtJs(props)
      default: // Next.js
        return await createNextJsApp(props)
    }
  }

  const resInitFn = await initFn(projectName)

  if (resInitFn.packageManagerNotFound) {
    logPackageNotFound()
  }

  if (resInitFn.status === RESPONSE_STATUS.CANCELED) return process.exit(1)
  return process.exit(0)
}
