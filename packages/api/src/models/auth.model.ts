import { MachineSchema } from "api/models/general.model"
import { z } from "zod"

const AuthorizationSchema = z.object({
    organizations: z.record(
        z.string(),
        z.object({
            applications: z.record(
                z.string(),
                z.object({
                    role: z.object({
                        type: z.string(),
                        permissions: z.array(
                            z.object({
                                action: z.string().or(z.array(z.string())),
                                subject: z.string().or(z.array(z.string())).optional(),
                                fields: z.array(z.string()).optional(),
                                conditions: z
                                    .object({
                                        maintenance: z.boolean().optional(),
                                    })
                                    .optional(),
                                inverted: z.boolean().optional(),
                                reason: z.string().optional(),
                            })
                        ),
                    }),
                    machines: z.array(MachineSchema),
                })
            ),
        })
    ),
})

export type Authorization = z.infer<typeof AuthorizationSchema>
