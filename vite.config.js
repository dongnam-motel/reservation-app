// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, 'public/index.html') // ✅ 무조건 이렇게 고정
    }
  }
})
