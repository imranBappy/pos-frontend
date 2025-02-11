import { ColumnDef } from "@tanstack/react-table"
import { PAYMENT_TYPE } from "@/graphql/product/types"
import moment from "moment"
import { getStatusStyle } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
// import PaymentModal from "../../order-payment/payment-modal"

export const columns: ColumnDef<PAYMENT_TYPE>[] = [
    {
        accessorKey: "trxId",
        header: "TrxId",
    },
    {
        accessorKey: "paymentMethod",
        header: "Payment Method",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge className={`${getStatusStyle(status)} border-none w-[90px]  flex justify-center items-center`}>
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "amount",
        header: "Amount",
    },
    {
        accessorKey: "order",
        header: "User",
        cell: ({ row }) => {
            const order = row.getValue("order") as { user: { name: string } };
            return <div className="capitalize">{order?.user?.name || 'Walk-in Customer'}</div>;
        },
    },
    {
        accessorKey: "order",
        header: "Order Status",
        cell: ({ row }) => {
            const order = row.getValue("order") as { status: string };
            return (
                <Badge className={`${getStatusStyle(order.status)} border-none w-[90px]  flex justify-center items-center`}>
                    {order.status}
                </Badge>
            )
        },
    },

    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => (
            <div className="capitalize">{`${moment(row.getValue("createdAt")).format("DD-MM-YYYY")} - ${moment(row.getValue("createdAt")).fromNow()}`}</div>
        ),
    },

    // {
    //     id: "actions",
    //     enableHiding: false,
    //     cell: ({ row }) => {
    //         return (<PaymentModal
    //             variant="outline"
    //             openBtnName="Edit"
    //             id={row.original.id}
    //         />)
    //     },
    // },
]


export default columns