import { oraPromise } from '@/lib/ora-promise'
import type { PropsPackageManagersType } from '@/lib/types'
import { execa } from 'execa'
import { promises as fs } from 'node:fs'

export const installShadcnVite = async (
  props: PropsPackageManagersType & { projectPath: string },
) => {
  await oraPromise({
    text: 'Connecting Shadcn UI...',
    successText: 'Shadcn UI connected successfully.',
    fn: async () => {
      const tsConfig = JSON.parse(
        await fs.readFile(`${props.projectPath}/tsconfig.json`, 'utf-8'),
      )
      const tsConfigApp = JSON.parse(
        (await fs.readFile(`${props.projectPath}/tsconfig.app.json`, 'utf-8'))
          .replace('/* Bundler mode */', '')
          .replace('/* Linting */', ''),
      )

      const updateTsConfig = JSON.stringify({
        ...tsConfig,
        compilerOptions: {
          baseUrl: '.',
          paths: {
            '@/*': ['./src/*'],
          },
        },
      })

      const updateTsConfigApp = JSON.stringify({
        ...tsConfigApp,
        compilerOptions: {
          ...tsConfigApp.compilerOptions,
          baseUrl: '.',
          paths: {
            '@/*': ['./src/*'],
          },
        },
      })

      await fs.writeFile(
        `${props.projectPath}/tsconfig.json`,
        updateTsConfig,
        'utf-8',
      )
      await fs.writeFile(
        `${props.projectPath}/tsconfig.app.json`,
        updateTsConfigApp,
        'utf-8',
      )

      await execa(props.packageManager, [
        props.packageManager === 'npm' ? 'install' : 'add',
        '-D',
        '@types/node',
      ])

      const viteConfig = await fs.readFile(
        `${props.projectPath}/vite.config.ts`,
        'utf-8',
      )

      const updatedViteConfig =
        'import path from "node:path" \n' +
        viteConfig.replace(
          'plugins: [react(), tailwindcss()]',
          `plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }`,
        )

      await fs.writeFile(
        `${props.projectPath}/vite.config.ts`,
        updatedViteConfig,
        'utf-8',
      )

      await execa('npx', ['shadcn@latest', 'init', '-b', 'neutral'], {
        stdio: 'inherit',
      })
    },
  })
}
