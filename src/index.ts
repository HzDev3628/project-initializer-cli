#!/usr/bin/env node
import { Command } from 'commander'
import { about } from './commands/about.js'
import { createNextJsApp } from './commands/create-nextjs-app.js'
import { createReactApp } from './commands/create-react-app.js'
import { createHono } from './commands/create-hono.js'
import { init } from './commands/init.js'
import { createNestJsApp } from './commands/create-nestjs-app.js'
import { RESPONSE_STATUS } from './lib/constants'
import { monorepo } from './commands/monorepo.js'

const program = new Command()

// @TODO: rewrite descriptions.
// @TODO: rewrite error messages.

program
  .name('speed-cli')
  .description('CLI to some JavaScript string utilities')
  .version('0.0.1')

program.command('about').action(about)

program
  .command('init')
  .description('Just create your future.')
  .action(async () => await init())

program
  .command('nextjs <name>')
  .description(
    'Create a Next.js app with my own template. NPM is used by default.',
  )
  .option('-s, --shadcn', 'Connect the Shadcn UI library.')
  .option('-t, --tailwind', 'Install the Tailwind CSS.')
  .option('-p, --turbopack', 'Add Turbopack.')
  .option(
    '-g, --git <repository>',
    'Connect and commit to the GitHub repository.',
  )
  .option(
    '--npm',
    'Explicitly tell the CLI to bootstrap the application using bun.',
  )
  .option(
    '--pnpm',
    'Explicitly tell the CLI to bootstrap the application using pnpm.',
  )
  .option(
    '--yarn',
    'Explicitly tell the CLI to bootstrap the application using yarn.',
  )
  .option(
    '--bun',
    'Explicitly tell the CLI to bootstrap the application using bun.',
  )
  .option('--biome', 'Use Biome to format and lint your code.')
  .option('--eslint', 'use eslint to lint your code.')
  .action(async (name, options) => {
    const res = await createNextJsApp({ name, options })
    if (res.status === RESPONSE_STATUS.CANCELED) return process.exit(1)
    return process.exit(0)
  })

program
  .command('react-app <name>')
  .description(
    'Create a React app with my own template. NPM is used by default.',
  )
  .option('-t, --tailwind', 'Install the Tailwind CSS.')
  .option(
    '-g, --git <repository>',
    'Connect and commit to the GitHub repository.',
  )
  .option('--biome', 'Use Biome to format and lint your code.')
  .option('--eslint', 'Use ESlint to lint your code.')
  .option(
    '--npm',
    'Explicitly tell the CLI to bootstrap the application using bun.',
  )
  .option(
    '--pnpm',
    'Explicitly tell the CLI to bootstrap the application using pnpm.',
  )
  .option(
    '--yarn',
    'Explicitly tell the CLI to bootstrap the application using yarn.',
  )
  .option(
    '--bun',
    'Explicitly tell the CLI to bootstrap the application using bun.',
  )
  .action(async (name, options) => {
    const res = await createReactApp({ name, options })
    if (res.status === RESPONSE_STATUS.CANCELED) return process.exit(1)
    return process.exit(0)
  })

program
  .command('hono <name>')
  .description(
    'Create a Hono app with my own template. NPM is used by default.',
  )
  .option(
    '--npm',
    ' Explicitly tell the CLI to bootstrap the application using bun.',
  )
  .option(
    '--pnpm',
    ' Explicitly tell the CLI to bootstrap the application using pnpm.',
  )
  .option(
    '--yarn',
    ' Explicitly tell the CLI to bootstrap the application using yarn.',
  )
  .option(
    '--bun',
    ' Explicitly tell the CLI to bootstrap the application using bun.',
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
    const res = await createHono({ name, options })
    if (res.status === RESPONSE_STATUS.CANCELED) return process.exit(1)
    return process.exit(0)
  })

program
  .command('nestjs <name>')
  .description(
    'Create a Hono app with my own template. NPM is used by default.',
  )
  .option(
    '--npm',
    'Explicitly tell the CLI to bootstrap the application using bun.',
  )
  .option(
    '--pnpm',
    'Explicitly tell the CLI to bootstrap the application using pnpm.',
  )
  .option(
    '--yarn',
    'Explicitly tell the CLI to bootstrap the application using yarn.',
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
    const res = await createNestJsApp({ name, options })
    if (res.status === RESPONSE_STATUS.CANCELED) return process.exit(1)
    return process.exit(0)
  })

program
  .command('monorepo <name>')
  .description('')
  .option(
    '--npm',
    'Explicitly tell the CLI to bootstrap the application using bun.',
  )
  .option(
    '--pnpm',
    'Explicitly tell the CLI to bootstrap the application using pnpm.',
  )
  .option(
    '--yarn',
    'Explicitly tell the CLI to bootstrap the application using yarn.',
  )
  .option('--biome', 'Use Biome to format and lint your code.')
  .option('--eslint', 'Use ESlint to lint your code.')
  .option('--backend-hono', '')
  .option('--backend-nest', '')
  .option('--remove-ui-package', '')
  .action(async (name, options) => {
    const res = await monorepo({ name, options })
    if (res.status === RESPONSE_STATUS.CANCELED) return process.exit(1)
    return process.exit(0)
  })

program.parse(process.argv)
