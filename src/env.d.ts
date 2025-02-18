declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string
    VUE_ROUTER_MODE: 'hash' | 'history' | 'abstract' | undefined
    VUE_ROUTER_BASE: string | undefined
  }
}

interface ImportMetaEnv {
  readonly VITE_BACKEND_API_URL: string
  readonly VITE_METAR_API_URL: string
  readonly VITE_AVWX_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
