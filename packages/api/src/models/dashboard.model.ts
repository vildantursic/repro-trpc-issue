import { SeverityStatusEnum } from "api/models/overview.model"
import { z } from "zod"

import { SignalSchema } from "./raw-data.model"

const ProcessTypes = ["OA", "GON", "CT", "OUA", "OBT"] as const
export const ProcessTypesEnum = z.enum(ProcessTypes)
export type ProcessTypes = z.infer<typeof ProcessTypesEnum>

//////////////////////////////

export const OperationsHistorySchema = z.object({
    columns: z.array(z.enum(["fromUnixtimestampNs", "toUnixtimestampNs", "code"])),
    rows: z.array(z.tuple([z.number(), z.number(), ProcessTypesEnum])),
})
export type OperationsHistory = z.infer<typeof OperationsHistorySchema>

//////////////////////////////

export const MachineMetricSchema = z.object({
    name: z.string(),
    dateTime: z.object({
        fromDate: z.number(),
    }),
    unit: z.string().nullish(),
    value: z.number().nullish(),
})
export const MachineMetricSchemaArray = z.array(MachineMetricSchema)
export type MachineMetric = z.infer<typeof MachineMetricSchema>
export type MachineMetricsPerDay = z.infer<typeof MachineMetricSchemaArray>

//////////////////////////////

export const MachineEventLogsSchema = z.object({
    columns: z.array(z.enum(["fromUnixtimestampNs", "toUnixtimestampNs", "code"])), // FIXME: there should be only 2 columns from and code @Sabin
    rows: z.array(z.tuple([z.number(), z.string()])),
})
export type MachineEventLogs = z.infer<typeof MachineEventLogsSchema>

//////////////////////////////

export const MachineSubDeviceSchema = z.object({
    name: z.string(),
    alarm: z
        .object({
            count: z.number(),
            severity: SeverityStatusEnum,
        })
        .optional(),
})
export type MachineSubDevice = z.infer<typeof MachineSubDeviceSchema>

export const AlarmsSchema = z.object({
    info: z.number(),
    warning: z.number(),
    error: z.number(),
})
export type Alarms = z.infer<typeof AlarmsSchema>

export const DeviceUsageSchema = z.object({
    unit: z.string(),
    active: z.number(),
    gunRuns: z.number(),
    coatingRuns: z.number(),
})
export type DeviceUsage = z.infer<typeof DeviceUsageSchema>

export const MachineDeviceSchema = z.object({
    image: z.string(),
    name: z.string(),
    type: z.string().optional(),
    signals: z.array(SignalSchema).optional(),
    status: z
        .object({
            isActive: z.boolean(),
            isHealthy: z.boolean(),
            severity: SeverityStatusEnum.nullable(),
        })
        .optional(),
    getCheckEngineLight: z
        .object({
            isActive: z.boolean(),
            severity: SeverityStatusEnum.nullable(),
        })
        .optional(),
    usage: z
        .object({
            last7Days: DeviceUsageSchema,
            last30Days: DeviceUsageSchema,
        })
        .optional(),
    devices: z.array(MachineSubDeviceSchema).optional(),
    processes: z.array(z.object({ name: z.string() })).optional(),
    alarms: z.object({
        last7Days: AlarmsSchema,
        last30Days: AlarmsSchema,
    }),
})
export type MachineDevice = z.infer<typeof MachineDeviceSchema>

export const MachineDevicesSchema = z.array(MachineDeviceSchema)
export type MachineDevices = z.infer<typeof MachineDevicesSchema>
