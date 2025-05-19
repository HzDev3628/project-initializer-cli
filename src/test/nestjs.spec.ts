import { describe, test } from '@jest/globals'
import { RESPONSE_STATUS, TIMEOUT } from '@/lib/constants'
import { createNestJsApp } from '@/commands/create-nestjs-app'

describe('Nest.js', () => {
  test(
    'NPM',
    async () => {
      const res = await createNestJsApp({
        name: 'test-nestjs-npm',
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
      const res = await createNestJsApp({
        name: 'test-nestjs-pnpm',
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
    'YARN',
    async () => {
      const res = await createNestJsApp({
        name: 'test-nestjs-yarn',
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
    'Without Biome',
    async () => {
      const res = await createNestJsApp({
        name: 'test-nestjs-without-biome',
        options: {
          yarn: true,
          biome: false,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )
})
