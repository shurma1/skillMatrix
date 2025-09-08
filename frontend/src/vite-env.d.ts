/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IS_DEV: string
  readonly VITE_API_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
