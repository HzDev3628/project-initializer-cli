import chalk from 'chalk'
import { log } from '../lib/utils.js'

export function about() {
  return log(
    chalk.white(
      `
  ----------------------------------------------------    
  |  ${chalk.bold.blueBright('-- Full Name: Artem Kharchuk')}                    |
  |  ${chalk.bold.green('-- Nickname: HzDev')}                              | 
  |  ${chalk.bold.cyan('-- Website: https://artem-kharchuk.vercel.app')}   | 
  ----------------------------------------------------
`,
    ),
  )
}
