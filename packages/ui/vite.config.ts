import path from "node:path"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            "ui": path.resolve(__dirname, "src"),
        },
    },
    plugins: [svgr(), react()],
})
