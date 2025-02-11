import { ColumnDef } from "@tanstack/react-table"
import { ActionsDropdown } from "./actions-dropdown"
import { UNIT_TYPE } from "@/graphql/unit/types"

export const columns: ColumnDef<UNIT_TYPE>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => <ActionsDropdown
            unit={row.original}
        />,
    },
]


export default columns