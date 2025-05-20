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
          vite: true,
          biome: true,
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
          vite: true,
          biome: true,
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
          vite: true,
          biome: true,
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
          vite: true,
          biome: true,
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
          vite: true,
          eslint: true,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  test(
    'NPM without Vite',
    async () => {
      const res = await createReactApp({
        name: 'test-react-app-npm-without-vite',
        options: {
          npm: true,
          vite: false,
          biome: true,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  test(
    'BUN without Vite',
    async () => {
      const res = await createReactApp({
        name: 'test-react-app-bun-without-vite',
        options: {
          bun: true,
          vite: false,
          biome: true,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.CANCELED)
    },
    TIMEOUT,
  )

  test(
    'NPM with ESlint without Vite',
    async () => {
      const res = await createReactApp({
        name: 'test-react-app-npm--eslint-without-vite',
        options: {
          npm: true,
          vite: false,
          eslint: true,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )
})
