import { CoreAPI } from "api/core-api"
import { MachineSchema } from "api/models/general.model"
import { protectedProcedure, router } from "api/trpc"
import { z } from "zod"

export const generalRouter = router({
    applicationsAndMachines: protectedProcedure.query(async (opts): Promise<any> => {
        return []
    }),
    getMachineTimezone: protectedProcedure
        .input(
            z.object({
                machine: MachineSchema,
            })
        )
        .query(async (opts): Promise<any> => {
            const machineTimezone = "America/New_York"
        }),
    getGPMVersion: protectedProcedure.query(async (opts): Promise<any> => {
        const queries = [
            {
                uid: "getVersion",
                application: opts.ctx.application,
                entityOrg: "ADMN",
                entityName: "GlobalPolicyManager",
                entityType: "Information",
                serviceType: "Software",
                serviceName: "getVersion",
            },
        ]

        const query = new CoreAPI({
            user: opts.ctx.user,
            queries: queries,
        })
        await query.query()

        return query.response
    })
})
