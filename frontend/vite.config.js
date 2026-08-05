import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://movieverse-i0l6.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
