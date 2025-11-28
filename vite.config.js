import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        host: '0.0.0.0',
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
        minify: 'terser',
        chunkSizeWarningLimit: 1600,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                    i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
                    animation: ['framer-motion']
                }
            }
        }
    },
    preview: {
        port: 3000,
        host: '0.0.0.0'
    }
})
