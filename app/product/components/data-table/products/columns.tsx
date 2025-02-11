import { ColumnDef } from "@tanstack/react-table"

import moment from "moment"
import { ActionsDropdown } from "./actions-dropdown"
import { PRODUCT_TYPE } from "@/graphql/product";

interface Category {
    name: string;
}

export const columns: ColumnDef<PRODUCT_TYPE>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "price",
        header: "Price",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("price")}</div>
        ),
    },

    {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("isActive") ? "Active" : "Inactive"}</div>
        ),
    },
    {
        accessorKey: "tag",
        header: "Tag",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("tag")}</div>
        ),
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
            <div className="capitalize">{(row.getValue("category") as Category)?.name}</div>
        ),
    },
    {
        accessorKey: "subcategory",
        header: "Subcategory",
        cell: ({ row }) => (
            <div className="capitalize">{(row.getValue("subcategory") as Category)?.name}</div>
        ),
    },
    {
        accessorKey: "vat",
        header: "VAT",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("vat")}</div>
        ),
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => (
            <div className="capitalize">{`${moment(row.getValue("createdAt")).format("DD/MM/YYYY")} - ${moment(row.getValue("createdAt")).fromNow()} `}</div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => <ActionsDropdown
            item={row.original}
        />,
    },
]


export default columns