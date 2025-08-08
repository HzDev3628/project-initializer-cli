import { promises as fs } from 'node:fs'
import { oraPromise } from '@/lib/ora-promise'
import { execa } from 'execa'
import type { PropsPackageManagersType } from '@/lib/types'

export const installTailwindVue = async (
  props: PropsPackageManagersType & {
    projectPath: string
  },
) => {
  await oraPromise({
    text: 'Installing and setting up Tailwind CSS...',
    successText: 'Tailwind CSS set up successfully.',
    fn: async () => {
      await execa(props.packageManager, [
        props.packageManager === 'pnpm' ? 'add' : 'install',
        'tailwindcss',
        '@tailwindcss/vite',
      ])

      const viteConfig = await fs.readFile(
        `${props.projectPath}/vite.config.ts`,
        'utf-8',
      )

      const mainCss = await fs.readFile(
        `${props.projectPath}/src/assets/main.css`,
        'utf-8',
      )

      const updatedViteConfig =
        "import tailwindcss from '@tailwindcss/vite' \n" +
        viteConfig.replace(
          `  plugins: [
    vue(),
    vueDevTools(),
  ],`,
          'plugins: [vue(), vueDevTools(), tailwindcss()],',
        )

      const updateMainCss = mainCss.replace(
        `@import './base.css';`,
        '@import "tailwindcss";',
      )

      await fs.writeFile(
        `${props.projectPath}/vite.config.ts`,
        updatedViteConfig,
      )
      await fs.writeFile(
        `${props.projectPath}/src/assets/main.css`,
        updateMainCss,
      )
      await fs.rm(`${props.projectPath}/src/assets/base.css`)
    },
  })
}

export async function installTailwindReactVite(
  props: PropsPackageManagersType & {
    projectPath: string
  },
) {
  await oraPromise({
    text: 'Installing and setting up Tailwind CSS...',
    successText: 'Tailwind CSS set up successfully.',
    fn: async () => {
      await execa(props.packageManager, [
        props.packageManager === 'pnpm' || props.packageManager === 'yarn'
          ? 'add'
          : 'install',
        'tailwindcss',
        '@tailwindcss/vite',
      ])

      const config = await fs.readFile(
        `${props.projectPath}/vite.config.ts`,
        'utf-8',
      )

      const updatedViteConfig =
        "import tailwindcss from '@tailwindcss/vite' \n" +
        config.replace(
          'plugins: [react()]',
          'plugins: [react(), tailwindcss()]',
        )

      const updatedIndexCss = `@import "tailwindcss";`

      const updatedAppPage = `export default function App() {
return <div className="text-6xl font-bold">Initializer Project CLI</div>
  }`

      await fs.writeFile(
        `${props.projectPath}/vite.config.ts`,
        updatedViteConfig,
      )
      await fs.rm(`${props.projectPath}/src/App.css`)
      await fs.writeFile(`${props.projectPath}/src/App.tsx`, updatedAppPage)
      await fs.writeFile(`${props.projectPath}/src/index.css`, updatedIndexCss)
    },
  })
}