import { z } from "zod"

const SemaphoreStatus = {
    green: "green",
    yellow: "yellow",
    red: "red",
    grey: "grey",
} as const
export const SemaphoreStatusEnum = z.nativeEnum(SemaphoreStatus)
export type SemaphoreStatus = z.infer<typeof SemaphoreStatusEnum>

//////////////////////////////

const SeverityStatus = {
    warning: "warning",
    error: "error",
    info: "info",
    success: "success",
} as const
export const SeverityStatusEnum = z.nativeEnum(SeverityStatus)
export type SeverityStatus = z.infer<typeof SeverityStatusEnum>

//////////////////////////////

export const GetCheckEngineLight = z.object({
    isActive: z.boolean(),
    severity: z.nullable(SeverityStatusEnum),
})

export const GetSemaphoreStatus = z.object({
    name: SemaphoreStatusEnum,
    type: z.unknown(),
})

export const GetMachineModel = z.object({
    name: z.string(),
    type: z.unknown(),
})

export const MachineDataResponseSchema = z.object({
    getCheckEngineLight: GetCheckEngineLight,
    getSemaphoreStatus: GetSemaphoreStatus,
    getMachineModel: GetMachineModel,
})
export type MachineDataResponse = z.infer<typeof MachineDataResponseSchema>
