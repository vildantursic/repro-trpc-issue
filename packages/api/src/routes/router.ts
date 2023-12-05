import { dashboardRouter } from "api/routes/dashboard.router"
import { generalRouter } from "api/routes/general.router"
import { authRouter } from "api/routes/auth.router"
import { mergeRouters } from "api/trpc"

export const appRouter = mergeRouters(authRouter, dashboardRouter, generalRouter)

export type AppRouter = typeof appRouter
