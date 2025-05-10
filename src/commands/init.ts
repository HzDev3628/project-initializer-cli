import { isCancel, select, text } from '@clack/prompts'
import { createNextJsApp } from './create-nextjs-app.js'
import { createHono } from './create-hono.js'
import { createReactApp } from './create-react-app.js'

export const init = async () => {
  const projectName = await text({ message: 'Project name:' })
  if (isCancel(projectName)) return process.exit(1)

  const projectType = await select({
    message: 'Select your template',
    options: [
      { value: 'nextjs', label: 'Next' },
      { value: 'react-app', label: 'React' },
      { value: 'hono', label: 'Hono' },
    ],
  })
  if (isCancel(projectType)) return process.exit(1)

  switch (projectType) {
    case 'nextjs':
      await createNextJsApp({ name: projectName, options: {} })
      break
    case 'hono':
      await createHono({ name: projectName, options: {} })
      break
    case 'react-app':
      await createReactApp({ name: projectName, options: {} })
      break
  }

  return process.exit(1)
}
