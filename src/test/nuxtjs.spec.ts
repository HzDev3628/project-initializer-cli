import { createNuxtJs } from '@/commands/create-nuxtjs'
import { RESPONSE_STATUS, TEST_DIRECTORY, TIMEOUT } from '@/lib/constants'
import { test, expect, describe } from '@jest/globals'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { chdir } from 'node:process'

describe('Nuxt.js', () => {
  ;(async () => {
    await mkdir(path.resolve(process.cwd(), TEST_DIRECTORY.nuxt))
  })()

  test(
    'NPM',
    async () => {
      const res = await createNuxtJs({
        name: 'test-nuxt-npm',
        options: {
          npm: true,
          nuxtUI: true,
          cwd: TEST_DIRECTORY.nuxt,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  test(
    'PNPM',
    async () => {
      chdir(path.resolve(process.cwd(), '..'))
      const res = await createNuxtJs({
        name: 'test-nuxt-pnpm',
        options: {
          pnpm: true,
          nuxtUI: true,
          cwd: TEST_DIRECTORY.nuxt,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  test(
    'YARN',
    async () => {
      chdir(path.resolve(process.cwd(), '..'))
      const res = await createNuxtJs({
        name: 'test-nuxt-yarn',
        options: {
          yarn: true,
          nuxtUI: true,
          cwd: TEST_DIRECTORY.nuxt,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )
  test(
    'BUN',
    async () => {
      chdir(path.resolve(process.cwd(), '..'))
      const res = await createNuxtJs({
        name: 'test-nuxt-bun',
        options: {
          bun: true,
          nuxtUI: true,
          cwd: TEST_DIRECTORY.nuxt,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )
})
