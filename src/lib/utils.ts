import chalk from 'chalk'

export const log = console.log

//@TODO: delete
export const logAlert = (text: string) =>
  log(
    chalk.green(`
 -------------- ${text} --------------       
        `),
  )
