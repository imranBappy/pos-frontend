import { ColumnDef } from "@tanstack/react-table"

import { ActionsDropdown } from "./actions-dropdown"
import { CATEGORY_TYPE } from "@/graphql/product";


interface Products {
    totalCount: number;
}

export const columns: ColumnDef<CATEGORY_TYPE>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("name")}</div>
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
        accessorKey: "products",
        header: "Products",
        cell: ({ row }) => (
            <div className="capitalize">{(row.getValue("products") as Products)?.totalCount}</div>
        ),
    },
    {
        accessorKey: "subcategories",
        header: "Subcategories",
        cell: ({ row }) => (
            <div className="capitalize">{(row.getValue("subcategories") as Products)?.totalCount}</div>
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