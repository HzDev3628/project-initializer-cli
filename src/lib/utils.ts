import chalk from 'chalk'

export const log = console.log

export const logAlert = (text: string) =>
  log(
    chalk.green(`
 -------------- ${text} --------------       
        `),
  )
