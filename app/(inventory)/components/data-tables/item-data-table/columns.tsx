import { ColumnDef } from "@tanstack/react-table"

import moment from "moment"
import { ActionsDropdown } from "./actions-dropdown"
import { ITEM_TYPE } from "@/graphql/item/types";

interface Category {
    name: string;
}

export const itemColumns: ColumnDef<ITEM_TYPE>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "currentStock",
        header: "Current Stock",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("currentStock")}</div>
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
        accessorKey: "unit",
        header: "Unit",
        cell: ({ row }) => (
            <div className="capitalize">{(row.getValue("unit") as Category)?.name}</div>
        ),
    },
    {
        accessorKey: "stock",
        header: " Stock",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("stock")}</div>
        ),
    },
    {
        accessorKey: "alertStock",
        header: "Alert Stock",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("alertStock")}</div>
        ),
    },

    {
        accessorKey: "sku",
        header: "SKU",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("sku")}</div>
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


export default itemColumns