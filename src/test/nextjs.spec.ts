import { createNextJsApp } from '@/commands/create-nextjs-app'
import { RESPONSE_STATUS, TIMEOUT } from '@/lib/constants'
import { describe, expect, test } from '@jest/globals'

describe('Next.js', () => {
  test(
    'NPM',
    async () => {
      const res = await createNextJsApp({
        name: 'test-next-js-npm',
        options: {
          useNpm: true,
          useBiome: true,
          turbopack: true,
          tailwind: true,
          shadcn: false,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  test(
    'PNPM',
    async () => {
      const res = await createNextJsApp({
        name: 'test-next-js-pnpm',
        options: {
          usePnpm: true,
          useBiome: true,
          turbopack: true,
          tailwind: true,
          shadcn: false,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  test(
    'BUN',
    async () => {
      const res = await createNextJsApp({
        name: 'test-next-js-bun',
        options: {
          useBun: true,
          useBiome: true,
          turbopack: true,
          tailwind: true,
          shadcn: false,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  test(
    'yarn',
    async () => {
      const res = await createNextJsApp({
        name: 'test-next-js-yarn',
        options: {
          useYarn: true,
          useBiome: true,
          turbopack: true,
          tailwind: true,
          shadcn: false,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  test(
    'NPM without Biome and Turbopack',
    async () => {
      const res = await createNextJsApp({
        name: 'test-next-js-npm-without-biome',
        options: {
          useNpm: true,
          useBiome: false,
          turbopack: true,
          tailwind: true,
          shadcn: false,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  test(
    'BUN without Tailwind',
    async () => {
      const res = await createNextJsApp({
        name: 'test-next-js-bun-without-tailwind',
        options: {
          useBun: true,
          useBiome: true,
          turbopack: true,
          tailwind: false,
          shadcn: false,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )
})
