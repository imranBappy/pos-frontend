import { ColumnDef } from "@tanstack/react-table";
import { SUPPLIER_PAYMENT_TYPE } from "@/graphql/supplier-payment/types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import moment from "moment";
import { ActionsDropdown } from "./actions-dropdown";
import Link from "next/link";

export const supplierPaymentColumns: ColumnDef<SUPPLIER_PAYMENT_TYPE>[] = [
    {
        accessorKey: "supplier",
        header: "Supplier",
        cell: ({ row }) => {
            const supplier = row.original.supplier;
            return (
                <Button variant={'link'}>
                    <Link href={`/suppliers/${supplier.id}`} className="capitalize">{supplier.name}</Link>
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
        accessorKey: "amountPaid",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Amount Paid
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => row.getValue("amountPaid"), // Format as needed
    },
    {
        accessorKey: "paymentMethod",
        header: "Payment Method",
        cell: ({ row }) => row.getValue("paymentMethod"),
    },
    {
        accessorKey: "referenceNumber",
        header: "Reference Number",
        cell: ({ row }) => row.getValue("referenceNumber") || "N/A",
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