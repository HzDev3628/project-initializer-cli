export type PackageManagersType = Partial<{
  pnpm: boolean
  yarn: boolean
  bun: boolean
  npm: boolean
}>

export interface PropsPackageManagersType {
  packageManager: 'pnpm' | 'yarn' | 'npm' | 'bun'
}
