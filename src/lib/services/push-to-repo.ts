import { execa } from 'execa'
import { logAlert } from '@/lib/utils'

export const pushToRepo = async ({ repoUrl }: { repoUrl: string }) => {
  logAlert('Connect git repository 📕')
  await execa('git', ['remote', 'add', 'origin', `${repoUrl}`], {
    stdio: 'inherit',
  })
  await execa('git', ['remote', '-v'], { stdio: 'inherit' })

  logAlert('Create commit 👾')
  await execa('git', ['add', '.'], { stdio: 'inherit' })
  await execa('git', ['commit', '-m', 'init project'], {
    stdio: 'inherit',
  })

  logAlert('Push ⚡️')
  await execa('git', ['push', '--set-upstream', 'origin', 'main'], {
    stdio: 'inherit',
  })
  return
}
