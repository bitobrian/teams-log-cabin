import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  plugins: [
      react(),
      basicSsl({
        name: 'test',
        certDir: 'temp',
      })
  ],
  envDir: "config",
  server: {
    port: 4999
  }
})
