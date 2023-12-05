import { inferAsyncReturnType } from "@trpc/server"
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify"

type ContextType = {
    token: string | null
    user: {
        userName: string
        org: string
    }
    application: string
}

export async function createContext({ req, res }: CreateFastifyContextOptions) {
    async function getAuthToken() {
        if (req.headers.authorization) {
            return req.headers.authorization === "offline" ? "offline" : req.headers.authorization
        }
        return null
    }
    function getUser() {
        const user = JSON.parse(req.headers.user as string)
        return {
            userName: user.name,
            org: user.org,
        }
    }

    const token = await getAuthToken()
    let user = getUser()

    return {
        token,
        user,
        application: req.headers.application,
    } as ContextType
}

export type Context = inferAsyncReturnType<typeof createContext>
