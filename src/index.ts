#!/usr/bin/env node
import { Command } from 'commander'
import { aboutAuthor } from './commands/about.js'
import { createNextJsApp } from './commands/create-nextjs-app.js'
import { createReactApp } from './commands/create-react-app.js'
import { createHono } from './commands/create-hono.js'
import { init } from './commands/init.js'
import { createNestJsApp } from './commands/create-nestjs-app.js'
import { RESPONSE_STATUS } from './lib/constants'
import { log } from './lib/utils.js'
import { renderTitle } from './lib/render-title.js'
import { createVueJs } from './commands/create-vuejs.js'

const program = new Command()

program
  .name('pic')
  .description('Less than 30s your time, and project already for building 🚀.')
  .version('0.2.0')

program.action(async () => {
  renderTitle()
  await init({})
})

program
  .command('about-author')
  .description('A little information about the author.')
  .action(aboutAuthor)

program
  .command('init')
  .option(
    '-c, --cwd <path>',
    'The working directory, default to the current directory.',
  )
  .description('Just create your future.')
  .action(async (options) => {
    renderTitle()
    await init({ options })
  })

program
  .command('nextjs <name>')
  .description('Create a Next.js app.')
  .option('-s, --shadcn', 'Connect the Shadcn UI library.')
  .option('-t, --tailwind', 'Install the Tailwind CSS.')
  .option('-p, --turbopack', 'Add Turbopack.')
  .option(
    '-g, --git <repository>',
    'Connect and commit to the GitHub repository.',
  )
  .option('--npm', 'Package manager NPM.')
  .option('--pnpm', 'Package manager PNPM.')
  .option('--yarn', 'Package manager YARN.')
  .option('--bun', 'Package manager BUN.')
  .option(
    '-c, --cwd <path>',
    'The working directory, default to the current directory.',
  )
  .option('--biome', 'Use Biome to format and lint your code.')
  .option('--eslint', 'Use Eslint to lint your code.')
  .action(async (name, options) => {
    renderTitle()
    const res = await createNextJsApp({ name, options })
    if (res.packageManagerNotFound) {
      log('Package manager not found!')
    }
    if (res.status === RESPONSE_STATUS.CANCELED) return process.exit(1)
    return process.exit(0)
  })

program
  .command('react-app <name>')
  .description('Create a React.js app.')
  .option('-t, --tailwind', 'Install the Tailwind CSS.')
  .option(
    '-g, --git <repository>',
    'Connect and commit to the GitHub repository.',
  )
  .option('-s, --shadcn', 'Connect the Shadcn UI library.')
  .option('--biome', 'Use Biome to format and lint your code.')
  .option('--eslint', 'Use ESlint to lint your code.')
  .option(
    '-c, --cwd <path>',
    'The working directory, default to the current directory.',
  )
  .option('--npm', 'Package manager NPM.')
  .option('--pnpm', 'Package manager PNPM.')
  .option('--yarn', 'Package manager YARN.')
  .option('--bun', 'Package manager BUN.')
  .action(async (name, options) => {
    renderTitle()
    const res = await createReactApp({ name, options })
    if (res.packageManagerNotFound) {
      log('Package manager not found!')
    }
    if (res.status === RESPONSE_STATUS.CANCELED) return process.exit(1)
    return process.exit(0)
  })

program
  .command('hono <name>')
  .description(
    'Create a Hono app with my own template. NPM is used by default.',
  )
  .option('--npm', 'Package manager NPM.')
  .option('--pnpm', 'Package manager PNPM.')
  .option('--yarn', 'Package manager YARN.')
  .option('--bun', 'Package manager BUN.')
  .option(
    '-g, --git <repository>',
    'Connect and commit to the GitHub repository.',
  )
  .option('--biome', 'Use Biome to format and lint your code.')
  .option(
    '--eslint-prettier',
    'Use ESlint to lint your code and use Prettier to format your code.',
  )
  .option(
    '-c, --cwd <path>',
    'The working directory, default to the current directory.',
  )
  .action(async (name, options) => {
    renderTitle()
    const res = await createHono({ name, options })
    if (res.packageManagerNotFound) {
      log('Package manager not found!')
    }
    if (res.status === RESPONSE_STATUS.CANCELED) return process.exit(1)
    return process.exit(0)
  })

program
  .command('nestjs <name>')
  .description(
    'Create a Hono app with my own template. NPM is used by default.',
  )
  .option('--npm', 'Package manager NPM.')
  .option('--pnpm', 'Package manager PNPM.')
  .option('--yarn', 'Package manager YARN.')
  .option(
    '-c, --cwd <path>',
    'The working directory, default to the current directory.',
  )
  .option(
    '-g, --git <repository>',
    'Connect and commit to the GitHub repository.',
  )
  .option('--biome', 'Use Biome to format and lint your code.')
  .option(
    '--eslint-prettier',
    'Use ESlint to lint your code and use Prettier to format your code.',
  )
  .action(async (name, options) => {
    renderTitle()
    const res = await createNestJsApp({ name, options })
    if (res.packageManagerNotFound) {
      log('Package manager not found!')
    }
    if (res.status === RESPONSE_STATUS.CANCELED) return process.exit(1)
    return process.exit(0)
  })

program
  .command('vue <name>')
  .description('Create a Vue app with my own template. NPM is used by default.')
  .option('--npm', 'Package manager NPM.')
  .option('--pnpm', 'Package manager PNPM.')
  // .option('--yarn', 'Package manager YARN.')
  .option('--bun', 'Package manager BUN.')
  .option('--jsx', 'Add JSX support.')
  .option('--vue-router', 'Add Vue router.')
  .option('--tailwind', 'Add Tailwind CSS.')
  .option(
    '-c, --cwd <path>',
    'The working directory, default to the current directory.',
  )
  .option(
    '-g, --git <repository>',
    'Connect and commit to the GitHub repository.',
  )
  .action(async (name, options) => {
    renderTitle()
    const res = await createVueJs({ name, options })
    if (res.packageManagerNotFound) {
      log('Package manager not found!')
    }
    if (res.status === RESPONSE_STATUS.CANCELED) return process.exit(1)
    return process.exit(0)
  })

program.parse(process.argv)
