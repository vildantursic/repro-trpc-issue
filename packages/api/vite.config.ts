import path from "path"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            api: path.resolve(__dirname, "src"),
        },
    },
})
