import { confirm, isCancel } from '@clack/prompts'
import type { BasicProps } from '../types'
import { RESPONSE_STATUS } from '../constants'

export async function codeStyleTools(props: Partial<Omit<BasicProps, 'git'>>) {
  let tool: 'biome' | 'eslint' | null = props.biome
    ? 'biome'
    : props.eslint
      ? 'eslint'
      : null

  if (tool === null) {
    const res = await confirm({
      message: 'What do you like use ?',
      active: 'Biome',
      inactive: 'ESlint',
    })
    if (isCancel(res)) return { status: RESPONSE_STATUS.CANCELED }

    tool = res ? 'biome' : 'eslint'
  }

  return {
    eslint: tool === 'eslint',
    biome: tool === 'biome',
  }
}
