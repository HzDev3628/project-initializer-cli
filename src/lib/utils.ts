import path from 'node:path'
import os from 'node:os'
import type { PropsPackageManagersType } from './types'

export const log = console.log

export function uninstallCommand(props: PropsPackageManagersType) {
  return props.packageManager === 'yarn' ? 'remove' : 'uninstall'
}

export function resolvePath(p: string) {
  if (p.startsWith('~')) {
    return path.resolve(p.replace('~', os.homedir()))
  }
  return path.resolve(p)
}
