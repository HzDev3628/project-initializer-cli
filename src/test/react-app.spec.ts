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
          useNpm: true,
          vite: true,
          useBiome: true,
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
          useBun: true,
          vite: true,
          useBiome: true,
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
          useYarn: true,
          vite: true,
          useBiome: true,
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
          usePnpm: true,
          vite: true,
          useBiome: true,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  test(
    'BUN Vite without Biome',
    async () => {
      const res = await createReactApp({
        name: 'test-react-app-bun-vite-without-biome',
        options: {
          useBun: true,
          vite: true,
          useBiome: false,
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
          useNpm: true,
          vite: false,
          useBiome: true,
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
          useBun: true,
          vite: false,
          useBiome: true,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.CANCELED)
    },
    TIMEOUT,
  )

  test(
    'NPM without Vite and Biome',
    async () => {
      const res = await createReactApp({
        name: 'test-react-app-npm-without-vite-and-biome',
        options: {
          useNpm: true,
          vite: false,
          useBiome: false,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )
})
