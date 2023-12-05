import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Dashboard from "web/pages/dashboard"
import { trpc } from "web/trpc"

export const getPublicRoutes = () => {
    return [
        {
            path: "/isup",
            element: <div></div>,
        },
        {
            path: "/",
            element: <Dashboard />,
        },
    ]
}


const AppRoutes = () => {
    const router = createBrowserRouter(getPublicRoutes())

    const { data: permissions, isLoading: isLoadingPermissions } = trpc.permissions.useQuery(undefined, {
        trpc: {
            context: {
                useOnline: false,
            },   
        },
        enabled: false,
    })

    if (isLoadingPermissions) {
        return <div>Loading permissions...</div>
    }

    return (
        <div className="h-screen overflow-clip">
            <RouterProvider router={router} />
        </div>
    )
}

export default AppRoutes
