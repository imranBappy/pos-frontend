import { ColumnDef } from "@tanstack/react-table";
import { SUPPLIER_INVOICE_TYPE } from "@/graphql/supplier-invoice/types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import moment from "moment";
import { ActionsDropdown } from "./actions-dropdown"; // If you have an actions dropdown
import Link from "next/link";
import { toFixed } from "@/lib/utils";

export const supplierInvoiceColumns: ColumnDef<SUPPLIER_INVOICE_TYPE>[] = [
    {
        accessorKey: "invoiceNumber",
        header: "Invoice Number",
        cell: ({ row }) => (
            <Button variant={'link'}>
                <Link href={`/supplier-invoices/${row.original.id}`} className="capitalize">{row.getValue("invoiceNumber")}</Link>
            </Button>
        ),
    },
    {
        accessorKey: "supplier",
        header: "Supplier",
        cell: ({ row }) => {
            const supplier = row.original.supplier; // Access the supplier object
            if (supplier) {
                return (
                    <Button variant={'link'}>
                        <Link href={`/supplier-invoices/${supplier.id}`} className="capitalize">{supplier.name}</Link>
                    </Button>
                );
            } else {
                return <p className="ml-4">N/A</p>;
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
                Amount
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => toFixed(row.getValue("amount")), // Format as needed (e.g., currency)
    },
    {
        accessorKey: "paidAmount",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Paid Amount
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => toFixed(row.getValue("paidAmount")), // Format as needed (e.g., currency)
    },
    {
        accessorKey: "due",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Due
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => toFixed(row.getValue("due")), // Format as needed
    },
    {
        accessorKey: "duePaymentDate",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Due Payment Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => {
            const duePaymentDate = row.getValue("duePaymentDate");
            return duePaymentDate ? moment(duePaymentDate).format("DD/MM/YYYY") : "N/A";
        },
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
        cell: ({ row }) => <ActionsDropdown item={row.original} />, // Pass the supplierInvoice object
    },
];

export default supplierInvoiceColumns;