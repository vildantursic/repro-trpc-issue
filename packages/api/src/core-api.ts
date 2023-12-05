import { TRPCError } from "@trpc/server"
import { CoreSimParamsProps } from "api/models/general.model"

export const health = (URL: string = process.env.BE_API || "") => {
    try {
        return fetch(`${URL}/isup`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
    } catch (e) {
        return "Failed to check health of core"
    }
}

export interface APIQuery {
    uid: string
    application: string
    entityType: string
    serviceType: string
    serviceName: string
    entityOrg: string
    entityName: string
    serviceParameters?: {
        [key: string]: any
    }
}

export interface APIQueryResponse<T> {
    uid: string
    success: boolean
    error: {
        errorType: string
        errorCode: number
        errorMessage_en: string
    }
    data: {
        [key: string]: T
    }
}

interface QueryBody {
    requester: {
        userOrg: string
        userName: string
    }
    queries: APIQuery[]
}

type DemoData = {
    [key: string]: {
        responses: APIQueryResponse<any>[]
    }
}

export class CoreAPI<T> {
    queries: APIQuery[]
    URL: string
    coreSimParams: CoreSimParamsProps = undefined
    user: { org: string; userName: string } = { org: "", userName: "" }
    response: T | null = null
    responsesRaw: APIQueryResponse<T>[] | null = null
    responses: { [key: string]: T }[] | null = null
    queryBody: QueryBody | null = null
    error: APIQueryResponse<T>["error"] | null = null

    constructor({
        user,
        queries,
        URL,
        coreSimParams,
    }: {
        user: { org: string; userName: string }
        queries: APIQuery[]
        URL?: string
        coreSimParams?: CoreSimParamsProps
    }) {
        this.URL = URL || process.env.BE_API || ""
        this.coreSimParams = coreSimParams || undefined
        this.user = user
        this.queries = queries
        this.queryBody = {
            requester: {
                userOrg: user.org,
                userName: user.userName,
            },
            queries: queries,
        }
    }

    private getAuth = () => {
        if (!process.env.BE_API_TOKEN) {
            throw new Error("BE_API_TOKEN not found")
        }
        return {
            token: process.env.BE_API_TOKEN,
        }
    }

    query = async () => {
        try {
            const response = await fetch(`${this.URL}/query`, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    token: this.getAuth().token,
                },
                body: JSON.stringify(this.queryBody),
            })

            const responseJSON: { responses: APIQueryResponse<T>[] } = await response.json()

            if (response.status === 200 && responseJSON.responses[0].success === true) {
                this.responsesRaw = responseJSON.responses
                this.responses = responseJSON.responses.map((response: APIQueryResponse<T>, index: number) => ({
                    [this.queries[index].serviceName]: response.data[this.queries[index].serviceName],
                }))
                this.response = responseJSON.responses[0].data[this.queries[0].uid]
            } else {
                if (responseJSON?.responses) {
                    this.error = responseJSON.responses[0].error
                } else {
                    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "API couldn't find this endpoint on machine" })
                }
            }
        } catch (err) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Fetch failed due to not being able to contact CORE or your local networking issues",
            })
        }
    }
}
