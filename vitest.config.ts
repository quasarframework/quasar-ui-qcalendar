import { defineConfig } from 'vitest/config'

export default defineConfig({
  // resolve: {
  //   alias: [
  //     {
  //       find: /^@ui\/([^/]*)$/,
  //       replacement: path.resolve(root, './packages/$1/src/index.ts'),
  //     },
  //   ],
  // },
  test: {
    coverage: {
      include: ['packages/*/src/**/*.ts'],
      provider: 'istanbul',
      reporter: ['clover', 'json', 'lcov', 'text'],
    },
  },
})
