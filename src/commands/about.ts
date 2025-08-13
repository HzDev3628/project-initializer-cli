import chalk from 'chalk'
import { log } from '@/lib/utils'

export function aboutAuthor() {
  return log(
    `
${chalk.bold('Full Name:')} Artem Kharhcuk
${chalk.bold('Nickname:')} HzDev
${chalk.bold('Email:')} artem.khar5uk@gmail.com
${chalk.bold('Social Media Links:')} https://artem-khar.vercel.app/links
`,
  )
}
