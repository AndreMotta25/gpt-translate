import { defineConfig, normalizePath } from "vite"
import { viteStaticCopy } from 'vite-plugin-static-copy'
import {resolve} from 'path'

export default defineConfig({
    build: {
        rollupOptions:{
            output: {
                entryFileNames:"assets/script.js"
            },
        }
    },
    outDir: "build",
    target: "ES2022",
    minify:true,
    polyfillModulePreload:false,
    plugins: [
        viteStaticCopy({
            targets:[
                {
                    src:normalizePath("./src/styles/style.css"), dest: normalizePath('./styles/'),
                }
            ]
        })
    ]
})