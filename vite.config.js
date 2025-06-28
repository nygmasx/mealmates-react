import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'https://apimates.testingtest.fr',
                changeOrigin: true,
                secure: true,
            }
        }
    },
    publicDir: 'public',
    build: {
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html')
            },
            output: {
                assetFileNames: (assetInfo) => {
                    const info = assetInfo.name.split('.');
                    const ext = info[info.length - 1];
                    if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
                        return `assets/[name]-[hash].[ext]`;
                    }
                    return `assets/[name]-[hash].[ext]`;
                }
            }
        },
        copyPublicDir: true
    }
});
