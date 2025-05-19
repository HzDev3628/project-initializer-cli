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
          npm: true,
          biome: true,
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
          pnpm: true,
          biome: true,
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
          bun: true,
          biome: true,
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
          yarn: true,
          biome: true,
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
          npm: true,
          biome: false,
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
          bun: true,
          biome: true,
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
