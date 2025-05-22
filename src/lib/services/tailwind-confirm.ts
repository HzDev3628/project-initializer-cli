import { confirm, isCancel } from '@clack/prompts'
import { RESPONSE_STATUS } from '../constants'

export async function tailwindConfirm(props: { tailwind?: boolean }) {
  const isUseTailwind =
    props.tailwind ??
    (await confirm({
      message: 'Add Tailwind CSS ?',
    }))
  if (isCancel(isUseTailwind)) return RESPONSE_STATUS.CANCELED

  return isUseTailwind
}
