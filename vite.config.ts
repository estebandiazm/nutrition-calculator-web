import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base:"/nutrition-calculator-web/",
  plugins: [react()],
  build: {
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
  },
  server: {
    open: true,
  },
})
