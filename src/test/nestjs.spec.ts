import { describe, test } from '@jest/globals'
import { RESPONSE_STATUS, TEST_DIRECTORY, TIMEOUT } from '@/lib/constants'
import { createNestJsApp } from '@/commands/create-nestjs-app'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { chdir } from 'node:process'

describe('Nest.js', () => {
  ;(async () => {
    await mkdir(path.resolve(process.cwd(), TEST_DIRECTORY.nest))
  })()

  test(
    'NPM',
    async () => {
      const res = await createNestJsApp({
        name: 'test-nestjs-npm',
        options: {
          npm: true,
          biome: true,
          cwd: TEST_DIRECTORY.nest,
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
      const res = await createNestJsApp({
        name: 'test-nestjs-pnpm',
        options: {
          pnpm: true,
          biome: true,
          cwd: TEST_DIRECTORY.nest,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  test(
    'YARN',
    async () => {
      chdir(path.resolve(process.cwd(), '..'))
      const res = await createNestJsApp({
        name: 'test-nestjs-yarn',
        options: {
          yarn: true,
          biome: true,
          cwd: TEST_DIRECTORY.nest,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  test(
    'ESlint & Prettier',
    async () => {
      chdir(path.resolve(process.cwd(), '..'))
      const res = await createNestJsApp({
        name: 'test-nestjs-eslint-prettier',
        options: {
          yarn: true,
          eslintPrettier: true,
          cwd: TEST_DIRECTORY.nest,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )
})
