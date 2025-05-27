import type { PropsPackageManagersType } from './types'

export const log = console.log

export function uninstallCommand(props: PropsPackageManagersType) {
  return props.packageManager === 'yarn' ? 'remove' : 'uninstall'
}
