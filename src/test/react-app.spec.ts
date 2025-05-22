import { createReactApp } from '@/commands/create-react-app'
import { RESPONSE_STATUS, TIMEOUT } from '@/lib/constants'
import { describe, expect, test } from '@jest/globals'

describe('React.js', () => {
  test(
    'NPM Vite',
    async () => {
      const res = await createReactApp({
        name: 'test-react-app-npm-vite',
        options: {
          npm: true,
          biome: true,
          tailwind: false,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  test(
    'BUN Vite',
    async () => {
      const res = await createReactApp({
        name: 'test-react-app-bun-vite',
        options: {
          bun: true,
          biome: true,
          tailwind: false,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  test(
    'YARN Vite',
    async () => {
      const res = await createReactApp({
        name: 'test-react-app-yarn-vite',
        options: {
          yarn: true,
          biome: true,
          tailwind: false,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  test(
    'PNPM Vite',
    async () => {
      const res = await createReactApp({
        name: 'test-react-app-pnpm-vite',
        options: {
          pnpm: true,
          biome: true,
          tailwind: false,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  test(
    'BUN Vite with ESlint',
    async () => {
      const res = await createReactApp({
        name: 'test-react-app-bun-vite-with-eslint',
        options: {
          bun: true,
          eslint: true,
          tailwind: false,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )
})
