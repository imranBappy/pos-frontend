import { ColumnDef } from "@tanstack/react-table"
import { ORDER_TYPE, } from "@/graphql/product/types"
import moment from "moment"
import { Badge } from "@/components/ui/badge"
import { COUNT_TYPE } from "@/graphql/types"
import { getStatusStyle, toFixed, underscoreToSpace } from "@/lib/utils"
import PaymentModal from "../../order-payment/payment-modal"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ORDER_STATUSES } from "@/constants/order.constants"
import InvoiceGenerate from "@/components/invoice-generate"


export const columns: ColumnDef<ORDER_TYPE>[] = [
    {
        accessorKey: "orderId",
        header: "Order Id",
        cell: ({ row }) => (
            <Button variant="link">
                <Link className="w-full" href={`/orders/${row.original.id}`}>{row.getValue("orderId")}</Link>
            </Button>
        ),
    },
    {
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => {
            const user = row.getValue("user") as { name: string };
            return <div className="capitalize">{user?.name || 'Walk-in Customer'}</div>;
        },
    },
    {
        accessorKey: "finalAmount",
        header: "Total Price",
        cell: ({ row }) => (
            <div className="capitalize">{toFixed(row.getValue("finalAmount"))}</div>
        ),
    },
    {
        accessorKey: "due",
        header: "Due Amount",
        cell: ({ row }) => <div className="capitalize">{toFixed(row.getValue('due'))}</div>,
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
            <div className="capitalize">{underscoreToSpace(row.getValue("type"))}</div>
        )
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
        accessorKey: "items",
        header: "Total Items",
        cell: ({ row }) => (
            <div className="capitalize">{(row.getValue("items") as COUNT_TYPE)?.totalCount}</div>
        ),
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => (
            <div className="capitalize">{`${moment(row.getValue("createdAt")).format("DD-MM-YYYY")} - ${moment(row.getValue("createdAt")).fromNow()}`}</div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const order = row.original as unknown as ORDER_TYPE
            if (row.getValue('status') === ORDER_STATUSES.COMPLETED) {
                return <InvoiceGenerate order={order} />
            }
            return (

                <div className=" flex gap-2 items-center justify-end">
                    <PaymentModal
                        openBtnClassName="w-[102px] "
                        variant="outline"
                        openBtnName="Payment"
                        orderId={row.original.id}
                    />
                    {
                        row.getValue('status') !== ORDER_STATUSES.PENDING ? <InvoiceGenerate order={order} /> : <Button variant={'secondary'}
                            disabled={row.getValue('status') !== ORDER_STATUSES.PENDING}
                        >
                            <Link href={`/orders/pos?id=${row.original.id}&orderId=${row.original.orderId.replace("#", "")}`}>
                                Edit
                            </Link>
                        </Button>
                    }

                </div>
            )


        },
    },
]

export default columns