import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { ActionsDropdown } from "./actions-dropdown";
import { ITEM_CATEGORY_TYPE } from "@/graphql/item-category/types";

export const itemCategoryColumns: ColumnDef<ITEM_CATEGORY_TYPE>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("description") || "N/A"}</div>
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
        cell: ({ row }) => <ActionsDropdown item={row.original} />,
    },
];

export default itemCategoryColumns;
