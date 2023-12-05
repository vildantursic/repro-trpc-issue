import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { httpBatchLink, Operation, splitLink } from "@trpc/client"
import AppRoutes from "web/router/router"
import { trpc } from "web/trpc"

function TRPCWrapper({ children }: { children: React.ReactNode }) {
    const user = {
        name: "test",
        org: "test",
    }
    const activeApp = "APP1" 

    const queryClient = new QueryClient()
    const trpcClient = trpc.createClient({
        links: [
            splitLink({
                condition(opts: Operation): boolean {
                    if (import.meta.env.MODE === "standalone") {
                        return Boolean(opts.context.useOnline)
                    }
                    return true
                },
                true: httpBatchLink({
                    maxURLLength: 4096,
                    url: `${import.meta.env.VITE_ONLINE_API_HOST}/api`,
                    headers: async () => {
                        // const token = await getAccessTokenSilently()
                        return {
                            authorization: "token123",
                            user: JSON.stringify({
                                name: user?.name,
                                org: user?.[""],
                            }),
                            application: activeApp,
                        }
                    },
                }),
                false: httpBatchLink({
                    maxURLLength: 2083,
                    url: `${import.meta.env.VITE_OFFLINE_API_HOST}:${import.meta.env.VITE_OFFLINE_API_PORT}/api`,
                    headers: async () => {
                        return {
                            authorization: "offline",
                            user: JSON.stringify({
                                name: "offline",
                                org: "OFFL",
                            }),
                            application: activeApp,
                        }
                    },
                }),
            }),
        ],
    })

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </trpc.Provider>
    )
}

export const App = () => {
    return (
        <TRPCWrapper>
            <>
                <AppRoutes />
                <ReactQueryDevtools initialIsOpen={false} />
            </>
        </TRPCWrapper>
    )
}
