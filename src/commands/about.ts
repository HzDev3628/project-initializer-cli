import chalk from 'chalk'
import { log } from '@/lib/utils'

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
