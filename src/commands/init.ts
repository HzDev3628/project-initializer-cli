import { isCancel, select, text } from '@clack/prompts'
import { createNextJsApp } from './create-nextjs-app'
import { createHono } from './create-hono'
import { createReactApp } from './create-react-app'
import type { ResponseStatus } from '@/lib/types'
import { createNestJsApp } from './create-nestjs-app'
import { RESPONSE_STATUS } from '@/lib/constants'
import { log } from '@/lib/utils'

interface Props {
  options: Partial<{ cwd: string }>
}

export const init = async (props: Props) => {
  const projectName = await text({ message: 'Project name:' })
  if (isCancel(projectName)) return process.exit(1)

  const projectType = await select({
    message: 'Select your template',
    options: [
      { value: 'next', label: 'Next' },
      { value: 'react', label: 'React' },
      { value: 'hono', label: 'Hono' },
      { value: 'nest', label: 'Nest' },
    ],
  })
  if (isCancel(projectType)) return process.exit(1)

  async function initFn(name: string): Promise<ResponseStatus> {
    switch (projectType) {
      case 'hono':
        return await createHono({ name, options: { cwd: props.options.cwd } })
      case 'react':
        return await createReactApp({
          name,
          options: { cwd: props.options.cwd },
        })
      case 'nest':
        return await createNestJsApp({
          name,
          options: { cwd: props.options.cwd },
        })
      default: // Next.js
        return await createNextJsApp({
          name,
          options: { cwd: props.options.cwd },
        })
    }
  }

  const resInitFn = await initFn(projectName)

  if (resInitFn.packageManagerNotFound) {
    log('Package manager not found!')
  }

  if (resInitFn.status === RESPONSE_STATUS.CANCELED) return process.exit(1)
  return process.exit(0)
}
