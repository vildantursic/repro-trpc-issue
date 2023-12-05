import { z } from "zod"

const AlarmColumns = {
    fromUnixtimestampNs: "fromUnixtimestampNs",
    toUnixtimestampNs: "toUnixtimestampNs",
    alarmId: "alarmId",
    severity: "severity",
    device: "device",
    tag: "tag",
    isActive: "isActive",
    processId: "processId",
    processName: "processName",
    shortDescription: "shortDescription",
    causes: "causes",
    solutions: "solutions",
} as const
export const AlarmColumnsEnum = z.nativeEnum(AlarmColumns)

//////////////////////////////

export const AlarmsRawDataSchema = z.object({
    columns: z.array(AlarmColumnsEnum),
    rows: z.array(
        z
            .tuple([
                z.number(),
                z.number().nullish(),
                z.number().nullish(),
                z.string().nullish(),
                z.string().nullish(),
                z.string().nullish(),
                z.boolean().nullish(),
                z.number().nullish(),
                z.string().nullish(),
                z.string().nullish(),
                z.string().nullish(),
                z.string().nullish(),
            ])
            .optional()
    ),
})
export type AlarmsRawData = z.infer<typeof AlarmsRawDataSchema>

//////////////////////////////

const BatchesColumns = {
    fromUnixtimestampNs: "fromUnixtimestampNs",
    toUnixtimestampNs: "toUnixtimestampNs",
    status: "status",
    recipe: "recipe",
    batch: "batch",
} as const
export const BatchesColumnsEnum = z.nativeEnum(BatchesColumns)

//////////////////////////////

export const BatchesRawDataSchema = z.object({
    columns: z.array(BatchesColumnsEnum),
    rows: z.array(z.tuple([z.number().nullish(), z.number().nullish(), z.string().nullish(), z.string().nullish(), z.number().nullish()]).optional()),
})
export type BatchesRawData = z.infer<typeof BatchesRawDataSchema>

//////////////////////////////

export const HighlightsRawDataSchema = z.object({
    type: z.string(),
    columns: z.array(z.enum(["fromUnixtimestampNs", "toUnixtimestampNs", "severity"])),
    rows: z.array(z.tuple([z.number(), z.number(), z.string()]).optional()),
})
export type HighlightsRawData = z.infer<typeof HighlightsRawDataSchema>

//////////////////////////////

export const SignalsResponseSchema = z.object({
    signalName: z.string(),
    columns: z.array(z.string()),
    rows: z.array(z.tuple([z.number(), z.number()]).optional()),
})
export type SignalsResponse = z.infer<typeof SignalsResponseSchema>

//////////////////////////////

export const HistoricalEventsSchema = z.object({
    alarms: AlarmsRawDataSchema.optional(),
    batches: BatchesRawDataSchema.optional(),
    highlights: z.array(HighlightsRawDataSchema).optional(),
    signals: z.array(SignalsResponseSchema).optional(),
})
export type HistoricalEvents = z.infer<typeof HistoricalEventsSchema>

//////////////////////////////

export const SignalSchema = z.object({
    name: z.string(),
    processId: z.number(),
    processName: z.string(),
    isActive: z.boolean(),
})
export const SignalListSchema = z.array(SignalSchema)
export type Signal = z.infer<typeof SignalSchema>
