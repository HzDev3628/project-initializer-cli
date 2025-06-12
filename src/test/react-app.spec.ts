import { createReactApp } from '@/commands/create-react-app'
import { RESPONSE_STATUS, TEST_DIRECTORY, TIMEOUT } from '@/lib/constants'
import { describe, expect, test } from '@jest/globals'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { chdir } from 'node:process'

describe('React.js', () => {
  ;(async () => {
    await mkdir(path.resolve(process.cwd(), TEST_DIRECTORY.react))
  })()

  test(
    'NPM Vite',
    async () => {
      const res = await createReactApp({
        name: 'test-react-app-npm-vite',
        options: {
          npm: true,
          biome: true,
          tailwind: false,
          cwd: TEST_DIRECTORY.react,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  test(
    'BUN Vite',
    async () => {
      chdir(path.resolve(process.cwd(), '..'))
      const res = await createReactApp({
        name: 'test-react-app-bun-vite',
        options: {
          bun: true,
          biome: true,
          tailwind: false,
          cwd: TEST_DIRECTORY.react,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  test(
    'YARN Vite',
    async () => {
      chdir(path.resolve(process.cwd(), '..'))
      const res = await createReactApp({
        name: 'test-react-app-yarn-vite',
        options: {
          yarn: true,
          biome: true,
          tailwind: false,
          cwd: TEST_DIRECTORY.react,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  test(
    'PNPM Vite',
    async () => {
      chdir(path.resolve(process.cwd(), '..'))
      const res = await createReactApp({
        name: 'test-react-app-pnpm-vite',
        options: {
          pnpm: true,
          biome: true,
          tailwind: false,
          cwd: TEST_DIRECTORY.react,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  test(
    'BUN Vite with ESlint',
    async () => {
      chdir(path.resolve(process.cwd(), '..'))
      const res = await createReactApp({
        name: 'test-react-app-bun-vite-with-eslint',
        options: {
          bun: true,
          eslint: true,
          tailwind: false,
          cwd: TEST_DIRECTORY.react,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  //@TODO: write test with shadcn and tailwind
})
