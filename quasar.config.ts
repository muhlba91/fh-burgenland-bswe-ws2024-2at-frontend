// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file

import { defineConfig } from '#q-app/wrappers'

export default defineConfig((/* ctx */) => {
  return {
    preFetch: false,
    boot: ['axios'],
    css: ['app.scss'],
    extras: [
      // 'mdi-v7',
      // 'fontawesome-v6',
      'roboto-font',
      'material-icons'
    ],
    build: {
      target: {
        browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
        node: 'node20'
      },
      typescript: {
        strict: true,
        vueShim: true
        // extendTsConfig (tsConfig) {}
      },
      vueRouterMode: 'history',
      publicPath: '/',
      env: {},
      vitePlugins: [
        [
          'vite-plugin-checker',
          {
            vueTsc: true,
            eslint: {
              lintCommand: 'eslint -c ./eslint.config.js "./src*/**/*.{ts,js,mjs,cjs,vue}"',
              useFlatConfig: true
            }
          },
          { server: false }
        ]
      ]
    },
    devServer: {
      open: true
    },
    framework: {
      config: {},
      // iconSet: 'material-icons',
      // lang: 'en-US',
      // components: [],
      // directives: [],
      plugins: []
    },
    animations: [],
    ssr: {
      prodPort: 3000,
      middlewares: ['render'],
      pwa: false
    },
    pwa: {
      workboxMode: 'GenerateSW'
    },
    cordova: {},
    capacitor: {
      hideSplashscreen: true
    },
    electron: {
      preloadScripts: ['electron-preload'],
      inspectPort: 5858,
      bundler: 'packager',
      packager: {},
      builder: {
        appId: 'weather-app'
      }
    },
    bex: {
      extraScripts: []
    }
  }
})
