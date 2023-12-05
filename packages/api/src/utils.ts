export const responseListToObject = <T>(responseList: { [key: string]: T }[]) => {
    return responseList.reduce((acc, item: { [key: string]: unknown }) => {
        const dt = Object.entries(item)[0]
        return Object.assign(acc, { [dt[0]]: dt[1] })
    }, {})
}

export type Metrics =
    | "Availability"
    | "OEE"
    | "RPT"
    | "Performance"
    | "Quality"
    | "Reliability"
    | "CoatingRuns"
    | "PartsCount"
    | "CoatingRuns.averageTime"
    | "Downtime"
    | "Electrical.Energy"
    | "Guns.WorkingHour"
    | "Powders.Weights"

export const MetricsList = [
    "Availability",
    "OEE",
    "RPT",
    "Performance",
    "Quality",
    "Reliability",
    "CoatingRuns",
    "PartsCount",
    "CoatingRuns.averageTime",
    "Downtime",
    "Electrical.Energy",
    "Guns.WorkingHour",
    "Powders.Weights",
]
