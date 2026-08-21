import { resolve } from 'node:path'

import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vite'

const root = resolve(import.meta.dirname, '../..')

export default defineConfig({
  root,
  plugins: [
    vue({ template: { transformAssetUrls } }),
    quasar({
      sassVariables: false,
    }),
  ],
  test: {
    name: 'ui-browser',
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
      screenshotFailures: false,
      viewport: { width: 1280, height: 800 },
    },
    include: ['test/browser/**/*.browser.ts'],
    setupFiles: ['./test/browser/vitest.setup.ts'],
  },
})
