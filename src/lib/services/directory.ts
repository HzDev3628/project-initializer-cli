import path from 'node:path'
import { resolvePath } from '../utils'

export const getDirectory = (props: { cwd?: string; projectName: string }) => {
  const workDirectory = props.cwd ? resolvePath(props.cwd) : undefined

  const projectPath = workDirectory
    ? `${workDirectory}/${props.projectName}`
    : path.resolve(process.cwd(), props.projectName)

  return { workDirectory, projectPath }
}

export const upOneDirectory = () => path.resolve(process.cwd(), '..')
