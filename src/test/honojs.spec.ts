import { test, expect, describe } from '@jest/globals'
import { createHono } from '@/commands/create-hono'
import { RESPONSE_STATUS } from '@/lib/constants'
import { TIMEOUT } from '@/lib/constants'

describe('Hono.js', () => {
  test(
    'NPM',
    async () => {
      const res = await createHono({
        name: 'test-hono-npm',
        options: {
          npm: true,
          biome: true,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  test(
    'PNPM',
    async () => {
      const res = await createHono({
        name: 'test-hono-pnpm',
        options: {
          pnpm: true,
          biome: true,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  test(
    'BUN',
    async () => {
      const res = await createHono({
        name: 'test-hono-bun',
        options: {
          bun: true,
          biome: true,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  test(
    'YARN',
    async () => {
      const res = await createHono({
        name: 'test-hono-yarn',
        options: {
          yarn: true,
          biome: true,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  test(
    'With ESlint',
    async () => {
      const res = await createHono({
        name: 'test-hono-with-eslint',
        options: {
          yarn: true,
          eslint: true,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )
})
