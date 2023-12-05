import { TRPCError } from "@trpc/server"
import { protectedProcedure, router } from "api/trpc"

export const authRouter = router({
    permissions: protectedProcedure.query(async (opts): Promise<any> => {
        if (!opts.ctx.user.userName || !opts.ctx.user.org) {
            throw new TRPCError({ code: "BAD_REQUEST", message: "Missing user name or organization ID" })
        }

        const permissions = [{
            subject: "all",
            action: "read",
        }]

        if (!permissions) {
            throw new TRPCError({ code: "NOT_FOUND", message: "No permissions found for this user" })
        }

        return permissions
    }),
})
