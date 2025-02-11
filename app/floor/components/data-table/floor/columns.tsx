import { ColumnDef } from "@tanstack/react-table"
import moment from "moment"
import { ActionsDropdown } from "./actions-dropdown"
import { FLOOR_TYPE } from "@/graphql/product";
import { COUNT_TYPE } from "@/graphql/types";
import { StatusBadge } from "@/components/status-badge";


export const columns: ColumnDef<FLOOR_TYPE>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("name")}</div>
        ),
    },

    {
        accessorKey: "floorTables",
        header: "Total Table",
        cell: ({ row }) => (
            <div className="capitalize">{(row.getValue("floorTables") as COUNT_TYPE)?.totalCount}</div>
        ),
    },
    {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => (
            <StatusBadge status={row.getValue("isActive")} />
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