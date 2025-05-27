import { oraPromise } from 'ora'
import { promises as fs } from 'node:fs'
import { execa } from 'execa'
import type { PropsPackageManagersType } from '@/lib/types'

export async function installTailwindReactVite(
  props: PropsPackageManagersType & {
    projectPath: string
  },
) {
  await oraPromise(
    async () => {
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

      // @TODO: write template.
      const updatedIndexCss = `@import "tailwindcss";`

      // @TODO: write template.
      const updatedAppPage = `export default function App() {
  return <div className="text-6xl font-bold">SPEED CLI</div>
}`

      await fs.writeFile(
        `${props.projectPath}/vite.config.ts`,
        updatedViteConfig,
      )
      await fs.rm(`${props.projectPath}/src/App.css`)
      await fs.writeFile(`${props.projectPath}/src/App.tsx`, updatedAppPage)
      await fs.writeFile(`${props.projectPath}/src/index.css`, updatedIndexCss)
    },
    {
      text: 'Installing and setting up Tailwind CSS...',
      successText: 'Tailwind CSS set up successfully.',
      failText: 'Something when wrong. Please, try again.',
    },
  )
}
