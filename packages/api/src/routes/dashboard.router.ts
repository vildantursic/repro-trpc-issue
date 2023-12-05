import { TRPCError } from "@trpc/server"
import { CoreAPI } from "api/core-api"
import {
    MachineMetricSchemaArray,
    MachineMetricsPerDay,
} from "api/models/dashboard.model"
import { MachineSchema } from "api/models/general.model"
import { protectedProcedure, router } from "api/trpc"
import { MetricsList } from "api/utils"
import { z } from "zod"

export const dashboardRouter = router({
    machineMetrics: protectedProcedure
        .input(
            z.object({
                date: z.number(),
                timezone: z.optional(z.string()),
                machine: MachineSchema,
                metrics: z.array(z.string().refine((metric) => MetricsList.includes(metric))),
            })
        )
        .query(async (opts): Promise<MachineMetricsPerDay> => {
            const fromDate = opts.input.date

            console.log("fromDate", fromDate)

            const queries = [
                {
                    uid: "getMachineMetricsPerDay",
                    application: opts.ctx.application,
                    entityOrg: opts.input.machine.org,
                    entityType: "Machine",
                    entityName: opts.input.machine.uid,
                    serviceType: "ProcessedData",
                    serviceName: "getMachineMetricsPerDay",
                    serviceParameters: {
                        Metrics: opts.input.metrics.map((metric) => ({
                            name: metric,
                            dateTime: {
                                fromDate: fromDate,
                            },
                        })),
                    },
                },
            ]

            const query = new CoreAPI<MachineMetricsPerDay>({
                user: opts.ctx.user,
                queries: queries,
                URL: opts.input.machine.URL,
                coreSimParams: { method: opts.input.metrics.length === 6 ? "machineMetricsLeft" : "machineMetricsRight", date: { from: opts.input.date } },
            })

            await query.query()

            console.log("RESPONSE", query.response)

            const response = MachineMetricSchemaArray.parse(query.response)

            if (response) {
                return response
            } else {
                throw new TRPCError({ code: "NOT_FOUND" })
            }
        })
})
