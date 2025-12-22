import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        output: {
          format: 'cjs'
        }
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src/renderer'),
        '@shared': path.resolve(__dirname, './src/shared'),
        // Alias para resolver el paquete con problema de exports
        'circular-natal-horoscope-js': path.resolve(__dirname, './node_modules/circular-natal-horoscope-js/dist/index.js')
      },
      // Resolver paquetes con problemas de exports
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.mjs']
    },
    plugins: [react()],
    optimizeDeps: {
      include: ['circular-natal-horoscope-js']
    }
  }
})

