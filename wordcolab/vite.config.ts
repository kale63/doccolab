import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path' // <--- Nota el asterisco aquí para evitar errores de TS

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      yjs: path.resolve(__dirname, './node_modules/yjs'),
      
      'y-supabase': path.resolve(__dirname, './node_modules/y-supabase/dist/index.js'),
    },
  },
})