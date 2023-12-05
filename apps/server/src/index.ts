import "dotenv/config"

import cors from "@fastify/cors"
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify"
import { appRouter, createContext } from "api"
import fastify from "fastify"

const packageJson = require("../package.json")

const server = fastify({
    maxParamLength: 5000,
})

const FRONTEND = process.env.FRONTEND || "http://localhost:45834"

server.register(cors, {
    origin: [FRONTEND, "https://tauri.localhost", "http://tauri.localhost", "tauri://localhost"],
})

server.get("/isup", (req, res) => {
    res.send("")
})

server.get("/version", (req, res) => {
    res.send({
        version: `${packageJson.version}.${process.env.VERSION}`,
    })
})

server.get("/debug", (req, res) => {
    res.send({
        envs: process.env,
    })
})

server.register(fastifyTRPCPlugin, {
    prefix: "/api",
    trpcOptions: { router: appRouter, createContext },
})
;(async () => {
    try {
        const host = process.env.HOST || "localhost"
        const port: number = process.env.PORT ? parseInt(process.env.PORT) : 45835
        const info = await server.listen({ host, port })
        console.log(info)
    } catch (err) {
        console.error("ERROR", err)
        server.log.error(err)
        process.exit(1)
    }
})()
