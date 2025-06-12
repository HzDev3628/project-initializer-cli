import { createNextJsApp } from '@/commands/create-nextjs-app'
import { RESPONSE_STATUS, TEST_DIRECTORY, TIMEOUT } from '@/lib/constants'
import { describe, expect, test } from '@jest/globals'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { chdir } from 'node:process'

describe('Next.js', () => {
  ;(async () => {
    await mkdir(path.resolve(process.cwd(), TEST_DIRECTORY.next))
  })()

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
          cwd: TEST_DIRECTORY.next,
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
      const res = await createNextJsApp({
        name: 'test-next-js-pnpm',
        options: {
          pnpm: true,
          biome: true,
          turbopack: true,
          tailwind: true,
          shadcn: false,
          cwd: TEST_DIRECTORY.next,
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
      const res = await createNextJsApp({
        name: 'test-next-js-bun',
        options: {
          bun: true,
          biome: true,
          turbopack: true,
          tailwind: true,
          shadcn: false,
          cwd: TEST_DIRECTORY.next,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  test(
    'yarn',
    async () => {
      chdir(path.resolve(process.cwd(), '..'))
      const res = await createNextJsApp({
        name: 'test-next-js-yarn',
        options: {
          yarn: true,
          biome: true,
          turbopack: true,
          tailwind: true,
          shadcn: false,
          cwd: TEST_DIRECTORY.next,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  test(
    'NPM with ESlint without Turbopack',
    async () => {
      chdir(path.resolve(process.cwd(), '..'))
      const res = await createNextJsApp({
        name: 'test-next-js-npm-without-biome',
        options: {
          npm: true,
          eslint: true,
          turbopack: true,
          tailwind: true,
          shadcn: false,
          cwd: TEST_DIRECTORY.next,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  test(
    'BUN without Tailwind',
    async () => {
      chdir(path.resolve(process.cwd(), '..'))
      const res = await createNextJsApp({
        name: 'test-next-js-bun-without-tailwind',
        options: {
          bun: true,
          biome: true,
          turbopack: true,
          tailwind: false,
          shadcn: false,
          cwd: TEST_DIRECTORY.next,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )
})
