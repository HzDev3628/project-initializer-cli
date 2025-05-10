#!/usr/bin/env node
import { Command } from 'commander'
import { about } from './commands/about.js'
import { createNextJsApp } from './commands/create-nextjs-app.js'
import { createReactApp } from './commands/create-react-app.js'

const program = new Command()

program
  .name('speed-cli')
  .description('CLI to some JavaScript string utilities')
  .version('0.0.1')

program.command('about').action(about)

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
  .option('--use-biome', 'Use Biome to format and lint your code.')
  .option(
    '--use-npm',
    ' Explicitly tell the CLI to bootstrap the application using bun.',
  )
  .option(
    '--use-pnpm',
    ' Explicitly tell the CLI to bootstrap the application using pnpm.',
  )
  .option(
    '--use-yarn',
    ' Explicitly tell the CLI to bootstrap the application using yarn.',
  )
  .option(
    '--use-bun',
    ' Explicitly tell the CLI to bootstrap the application using bun.',
  )
  .action(async (name, options) => await createNextJsApp({ name, options }))

program
  .command('react-app <name>')
  .description(
    'Create a React app with my own template. NPM is used by default.',
  )
  .option('-v, --vite', 'Use Vite.')
  .option('--use-biome', 'Use Biome to format and lint your code.')
  .option(
    '--use-npm',
    ' Explicitly tell the CLI to bootstrap the application using bun.',
  )
  .option(
    '--use-pnpm',
    ' Explicitly tell the CLI to bootstrap the application using pnpm. Only for Vite.',
  )
  .option(
    '--use-yarn',
    ' Explicitly tell the CLI to bootstrap the application using yarn.',
  )
  .option(
    '--use-bun',
    ' Explicitly tell the CLI to bootstrap the application using bun. Only for Vite.',
  )
  .action(async (name, options) => await createReactApp({ name, options }))

program.parse(process.argv)
