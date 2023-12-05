import { initTRPC, TRPCError } from "@trpc/server"

import { Context } from "./context"

const t = initTRPC.context<Context>().create()

export const middleware = t.middleware
export const router = t.router

const isAuthenticated = middleware((opts) => {
    const { ctx } = opts
    if (!ctx.token) {
        throw new TRPCError({ code: "UNAUTHORIZED" })
    }

    return opts.next({
        ctx: {
            token: ctx.token,
        },
    })
})

// TODO: check issue of fetch (failing on windows)
const isAllowed = middleware(async (opts) => {
    const { ctx } = opts
    const permissions = []
    // check if user has permission to access this route

    // log audit if he has no permission but tried to access this route

    return opts.next({
        ctx: {
            token: ctx.token,
        },
    })
})

const loggerMiddleware = middleware(async (opts) => {
    const start = Date.now()

    const result = await opts.next()

    const durationMs = Date.now() - start
    const meta = { path: opts.path, type: opts.type, durationMs, requesterName: opts.ctx.user.userName, requesterOrg: opts.ctx.user.org }

    // result.ok ? console.log("OK request timing:", meta) : console.error("Non-OK request timing", meta)

    return result
})

export const publicProcedure = t.procedure.use(loggerMiddleware)
export const protectedProcedure = t.procedure.use(isAuthenticated).use(loggerMiddleware)
export const mergeRouters = t.mergeRouters
