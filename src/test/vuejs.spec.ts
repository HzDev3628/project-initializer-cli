import { createVueJs } from '@/commands/create-vuejs'
import { RESPONSE_STATUS, TEST_DIRECTORY, TIMEOUT } from '@/lib/constants'
import { describe, test, expect } from '@jest/globals'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { chdir } from 'node:process'

describe('Vue.js', () => {
  ;(async () => {
    await mkdir(path.resolve(process.cwd(), TEST_DIRECTORY.vue))
  })()

  test(
    'NPM',
    async () => {
      const res = await createVueJs({
        name: 'test-vue-npm',
        options: {
          npm: true,
          tailwind: false,
          cwd: TEST_DIRECTORY.vue,
          jsx: true,
          vueRouter: false,
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
      const res = await createVueJs({
        name: 'test-vue-bun',
        options: {
          bun: true,
          tailwind: false,
          cwd: TEST_DIRECTORY.vue,
          jsx: true,
          vueRouter: false,
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
      const res = await createVueJs({
        name: 'test-vue-pnpm',
        options: {
          pnpm: true,
          tailwind: false,
          cwd: TEST_DIRECTORY.vue,
          jsx: true,
          vueRouter: false,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  test(
    'NPM with Tailwind CSS',
    async () => {
      chdir(path.resolve(process.cwd(), '..'))
      const res = await createVueJs({
        name: 'test-vue-npm-with-tailwind-css',
        options: {
          npm: true,
          tailwind: true,
          cwd: TEST_DIRECTORY.vue,
          jsx: true,
          vueRouter: false,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  test(
    'BUN with Tailwind CSS',
    async () => {
      chdir(path.resolve(process.cwd(), '..'))
      const res = await createVueJs({
        name: 'test-vue-bun-with-tailwind-css',
        options: {
          bun: true,
          tailwind: true,
          cwd: TEST_DIRECTORY.vue,
          jsx: true,
          vueRouter: false,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )

  test(
    'PNPM with Tailwind CSS',
    async () => {
      chdir(path.resolve(process.cwd(), '..'))
      const res = await createVueJs({
        name: 'test-vue-pnpm-with-tailwind-css',
        options: {
          pnpm: true,
          tailwind: true,
          cwd: TEST_DIRECTORY.vue,
          jsx: true,
          vueRouter: false,
        },
      })

      expect(res.status).toBe(RESPONSE_STATUS.SUCCESS)
    },
    TIMEOUT,
  )
})
