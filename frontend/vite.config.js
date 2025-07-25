import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: './src/public',
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/app.css";`,
      },
    },
  },
})
