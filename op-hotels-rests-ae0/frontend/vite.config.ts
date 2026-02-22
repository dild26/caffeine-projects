import { fileURLToPath, URL } from 'url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import environment from 'vite-plugin-environment';

export default defineConfig({
    build: {
        emptyOutDir: true,
        sourcemap: false,
        minify: false
    },
    optimizeDeps: {
        esbuildOptions: {
            define: {
                global: 'globalThis'
            }
        }
    },
    server: {
        port: 3032,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:4943',
                changeOrigin: true
            }
        }
    },
    plugins: [
        environment('all', { prefix: 'CANISTER_' }),
        environment('all', { prefix: 'DFX_' }),
        react()
    ],
    resolve: {
        alias: [
            {
                find: '@',
                replacement: fileURLToPath(new URL('./src', import.meta.url))
            }
        ],
        dedupe: ['@dfinity/agent']
    }
});
