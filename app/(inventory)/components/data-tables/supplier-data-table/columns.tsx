import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { ActionsDropdown } from "./actions-dropdown";
import { SUPPLIER_TYPE } from "@/graphql/supplier/types";

export const supplierColumns: ColumnDef<SUPPLIER_TYPE>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "phoneNumber",
        header: "Phone Number",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("phoneNumber")}</div>
        ),
    },
    {
        accessorKey: "whatsappNumber",
        header: "WhatsApp Number",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("whatsappNumber") || "N/A"}</div>
        ),
    },
    {
        accessorKey: "emailAddress",
        header: "Email Address",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("emailAddress") || "N/A"}</div>
        ),
    },
    {
        accessorKey: "address",
        header: "Address",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("address") || "N/A"}</div>
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

export default supplierColumns;
