import cliSpinners from 'cli-spinners'
import { oraPromise as ora } from 'ora'

export const oraPromise = async <T>(props: {
  fn: () => Promise<T>
  text: string
  successText: string
}) => {
  return await ora(async () => await props.fn(), {
    text: props.text,
    successText: props.successText,
    failText: (e) => e.message,
    spinner: cliSpinners.bouncingBar,
  })
}
