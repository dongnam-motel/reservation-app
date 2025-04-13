import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: '.', // 👉 명시적으로 루트를 현재 디렉토리로 설정
  plugins: [react()],
})
