import { ColumnDef } from "@tanstack/react-table";
import { SUPPLIER_PAYMENT_TYPE } from "@/graphql/supplier-payment/types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import moment from "moment";
import { ActionsDropdown } from "./actions-dropdown";
import Link from "next/link";
import { toFixed } from "@/lib/utils";

export const supplierPaymentColumns: ColumnDef<SUPPLIER_PAYMENT_TYPE>[] = [
    {
        accessorKey: "supplier",
        header: "Supplier",
        cell: ({ row }) => {
            const supplier = row.original?.invoice?.supplier;
            return (
                <Button variant={'link'}>
                    <Link href={`/suppliers/${supplier?.id ?? "#"}`} className="capitalize">{supplier?.name || "NA"}</Link>
                </Button>
            );
        },
    },
    {
        accessorKey: "invoice",
        header: "Invoice",
        cell: ({ row }) => {
            const invoice = row.original.invoice;
            if (invoice) {
                return (
                    <Button variant={'link'}>
                        <Link href={`/supplier-invoices/${invoice.id}`} className="capitalize">{invoice.invoiceNumber}</Link>
                    </Button>
                );
            } else {
                return "N/A";
            }
        },
    },
    {
        accessorKey: "amount",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Amount Paid
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => toFixed(row.getValue("amount") ), // Format as needed
    },
    {
        accessorKey: "paymentMethod",
        header: "Payment Method",
        cell: ({ row }) => row.getValue("paymentMethod"),
    },
    {
        accessorKey: "trxId",
        header: "TRX ID",
        cell: ({ row }) => row.getValue("trxId") || "N/A",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => row.getValue("status"),
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="hidden lg:flex"
            >
                Created At
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="hidden lg:block font-medium">
                {moment(row.getValue("createdAt")).format("DD/MM/YYYY")}
            </div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => <ActionsDropdown item={row.original} />,
    },
];

export default supplierPaymentColumns;