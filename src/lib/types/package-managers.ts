export interface PackageManagersType {
  pnpm?: boolean
  yarn?: boolean
  bun?: boolean
  npm?: boolean
}

export interface PropsPackageManagersType {
  packageManager: 'pnpm' | 'yarn' | 'npm' | 'bun'
}
