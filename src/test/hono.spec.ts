import { test, expect, describe } from '@jest/globals'
import { createHono } from '@/commands/create-hono'
import { RESPONSE_STATUS } from '@/lib/constants'

const TIMEOUT = 10000 // 10 sec

describe('Hono', () => {
  test(
    'NPM',
    async () => {
      const res = await createHono({
        name: 'test-hono-npm',
        options: {
          useNpm: true,
          useBiome: true,
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
          usePnpm: true,
          useBiome: true,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
      process.exit(1)
    },
    TIMEOUT,
  )

  test(
    'BUN',
    async () => {
      const res = await createHono({
        name: 'test-hono-bun',
        options: {
          useBun: true,
          useBiome: true,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
      process.exit(1)
    },
    TIMEOUT,
  )

  test(
    'YARN',
    async () => {
      const res = await createHono({
        name: 'test-hono-yarn',
        options: {
          useYarn: true,
          useBiome: true,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
      process.exit(1)
    },
    TIMEOUT,
  )

  test(
    'Without Biome',
    async () => {
      const res = await createHono({
        name: 'test-hono-without-biome',
        options: {
          useYarn: true,
          useBiome: false,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
      process.exit(1)
    },
    TIMEOUT,
  )
})
