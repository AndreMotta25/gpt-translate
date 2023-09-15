import { defineConfig, normalizePath } from "vite"
import { viteStaticCopy } from 'vite-plugin-static-copy'
import {resolve} from 'path'

export default defineConfig({
    build: {
        rollupOptions:{
            input:{
                index: resolve(__dirname, 'index.html'),
                popup:resolve(__dirname, 'src/popup.ts'),
                script: resolve(__dirname, 'src/index.ts'),
            },
            output: {
                assetFileNames: assetInfo => {
                    const [name, type] = assetInfo.name.split('.')
                    if(type === 'css') return `styles/popup[extname]`
                    return "[name][extname]"
                },
                entryFileNames:"assets/[name].js"
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