import chalk from 'chalk'
import { log } from '@/lib/utils'

export function aboutAuthor() {
  return log(
    `
${chalk.bold('Full Name:')} Artem Kharhcuk
${chalk.bold('Nickname:')} HzDev
${chalk.bold('GitHub:')} https://github.com/HzDev3628 
${chalk.bold('X:')} https://x.com/artem_kharchuk_
`,
  )
}
