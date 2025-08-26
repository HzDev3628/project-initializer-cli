import { execa } from 'execa'
import { oraPromise } from 'ora'

export const pushToRepo = async ({ repoUrl }: { repoUrl: string }) => {
  await oraPromise(
    async () => {
      await execa('git', ['init'])
      await execa('git', ['branch', '-M', 'main'])
      await execa('git', ['remote', 'add', 'origin', `${repoUrl}`])
      await execa('git', ['add', '.'])
      await execa('git', ['commit', '-m', 'init project'])
      await execa('git', ['push', '--set-upstream', 'origin', 'main'])
    },
    {
      text: 'Connecting Git and pushing to repository',
      successText:
        'Successful connected and pushed to repository. Check your GitHub ✅',
      failText: (e) => e.message,
    },
  )
  return
}
