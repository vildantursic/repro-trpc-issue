import path from "path"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            server: path.resolve(__dirname, "src"),
            api: path.resolve(__dirname, "../../packages/api/src"),
        },
    },
})
