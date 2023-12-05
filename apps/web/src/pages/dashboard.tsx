import { trpc } from "web/trpc"

import { Card } from "ui/card"

const Dashboard = () => {
    const date = new Date()
    const activeMachine = {
        uid: "test",
        org: "test",
    }

    const [metrics] = trpc.machineMetrics.useSuspenseQuery(
        {
            date: date,
            machine: activeMachine,
            metrics: ["test1", "test2"],
        },
        { trpc: {
            context: {
                useOnline: true,
            },
        }, refetchInterval: 1000 }
    )

    return (
        <Card>
            <pre>{JSON.stringify(metrics)}</pre>
        </Card>
    )
}

export default Dashboard
