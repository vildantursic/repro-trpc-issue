import { z } from "zod"

export type CoreSimParamsProps =
    | {
          method: string
          date?: { from?: number; to?: number }
          [key: string]: any
      }
    | undefined

export type ApplicationsList = "METCO" | "BALZERS"

export enum ApplicationsListEnum {
    METCO = "METCO",
    BALZERS = "BALZERS",
}

export const MachineSchema = z.object({
    uid: z.string(),
    org: z.string(),
    URL: z.string().url(),
    type: z.string().optional(),
    timezone: z.string().optional(),
    role: z
        .object({
            type: z.string(),
            permissions: z
                .array(
                    z.object({
                        action: z.string().or(z.array(z.string())),
                        subject: z.string().or(z.array(z.string())).optional(),
                        fields: z.array(z.string()).optional(),
                        conditions: z.object({
                            license: z.boolean(),
                            maintenance: z.boolean(),
                            timeRange: z.tuple([z.number(), z.number()]),
                        }),
                        inverted: z.boolean().optional(),
                        reason: z.string().optional(),
                    })
                )
                .optional(),
        })
        .optional(),
})
export type Machine = z.infer<typeof MachineSchema>

//////////////////////////////

export const DateRangeSchema = z.object({
    from: z.number().optional(),
    to: z.number().optional(),
})
export type DateRangeInput = z.infer<typeof DateRangeSchema>
