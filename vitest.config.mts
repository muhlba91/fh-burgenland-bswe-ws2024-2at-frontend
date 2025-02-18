import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

process.env.TZ = 'UTC';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: 'test/vitest/setup-file.ts',
    coverage: {
      enabled: true,
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        // exclude all files that are not part of the source code
        'postcss.config.js',
        'quasar.config.ts',
        'vitest.config.mts',
        'eslint.config.js',
        'cypress.config.ts',
        '.quasar/**',
        'dist/**',
        'test/**',
        'src/env.d.ts',
        'src/boot/axios.ts',
        // exclude the entry point of the application, the data models (interfaces, types) and the router
        'src/App.vue',
        'src/model/**',
        'src/router/**',
        // Dialogs, Emits, Notify, Menu and Tooltips are not testable since they are not mounted by the test framework
        // https://github.com/quasarframework/quasar-testing/issues/72
        'src/components/**/*Dialog.vue',
        // MapCard uses leaflet and it is not testable due to Expandable not mounted by the test framework correctly
        'src/components/MapCard.vue'
      ],
      thresholds: {
        lines: 80,
        statements: 80,
        branches: 80,
        functions: 70,
      }
    },
    include: [
      // Matches vitest tests in any subfolder of 'src' or into 'test/vitest/__tests__'
      // Matches all files with extension 'js', 'jsx', 'ts' and 'tsx'
      'src/**/*.vitest.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'test/vitest/__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
  },
  plugins: [
    vue({
      template: { transformAssetUrls },
    }) as Plugin,
    quasar({
      sassVariables: 'src/css/quasar.variables.scss',
    }) as Plugin,
    tsconfigPaths() as Plugin,
  ],
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src')
    }
  }
});
