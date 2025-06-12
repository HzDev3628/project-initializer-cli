import { test, expect, describe } from '@jest/globals'
import { createHono } from '@/commands/create-hono'
import { RESPONSE_STATUS, TEST_DIRECTORY } from '@/lib/constants'
import { TIMEOUT } from '@/lib/constants'
import path from 'node:path'
import { mkdir } from 'node:fs/promises'
import { chdir } from 'node:process'

describe('Hono.js', () => {
  ;(async () => {
    await mkdir(path.resolve(process.cwd(), TEST_DIRECTORY.hono))
  })()

  test(
    'NPM',
    async () => {
      const res = await createHono({
        name: 'test-hono-npm',
        options: {
          npm: true,
          biome: true,
          cwd: TEST_DIRECTORY.hono,
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
      const res = await createHono({
        name: 'test-hono-pnpm',
        options: {
          pnpm: true,
          biome: true,
          cwd: TEST_DIRECTORY.hono,
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
      const res = await createHono({
        name: 'test-hono-bun',
        options: {
          bun: true,
          biome: true,
          cwd: TEST_DIRECTORY.hono,
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
      const res = await createHono({
        name: 'test-hono-yarn',
        options: {
          yarn: true,
          biome: true,
          cwd: TEST_DIRECTORY.hono,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  test(
    'With ESlint & Prettier',
    async () => {
      chdir(path.resolve(process.cwd(), '..'))
      const res = await createHono({
        name: 'test-hono-with-eslint-prettier',
        options: {
          yarn: true,
          eslintPrettier: true,
          cwd: TEST_DIRECTORY.hono,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )
})
