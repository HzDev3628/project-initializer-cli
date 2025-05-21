import { confirm, isCancel } from '@clack/prompts'
import type { BasicProps } from '../types'
import { RESPONSE_STATUS } from '../constants'

export async function codeStyleTools(
  props: Partial<Omit<BasicProps, 'git'>> & { withPrettier: boolean },
) {
  let tool: 'biome' | 'eslint-prettier' | 'eslint' | null = props.biome
    ? 'biome'
    : props.eslintPrettier
      ? 'eslint-prettier'
      : props.eslint
        ? 'eslint'
        : null

  if (tool === null) {
    const res = await confirm({
      message: 'What do you like use ?',
      active: 'Biome',
      inactive: props.withPrettier ? 'ESlint & Prettier' : 'ESlint',
    })
    if (isCancel(res)) return { status: RESPONSE_STATUS.CANCELED }

    tool = res ? 'biome' : props.withPrettier ? 'eslint-prettier' : 'eslint'
  }

  return {
    eslintPrettier: tool === 'eslint-prettier',
    biome: tool === 'biome',
    eslint: tool === 'eslint',
  }
}
