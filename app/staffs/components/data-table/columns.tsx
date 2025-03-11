import { ColumnDef } from "@tanstack/react-table"
import { USER_TYPE } from "@/graphql/accounts"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import moment from "moment"
import { ActionsDropdown } from "./actions-dropdown"
import Link from "next/link"

export const columns: ColumnDef<USER_TYPE>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
            <Button variant={'link'}>
                <Link
                    href={`/staffs/add?staffId=${row.original.id}`}
                    className="capitalize"
                >
                    {row.getValue('name') || 'Unknown'}
                </Link>
            </Button>
        ),
    },
    {
        accessorKey: 'email',
        header: () => 'Email',
        cell: ({ row }) => (
            <div className="hidden md:block lowercase">
                {row.getValue('email')}
            </div>
        ),
    },
    {
        accessorKey: 'phone',
        header: () => 'Phone',
    },
    {
        accessorKey: 'role',
        header: () => <div>Role</div>,
        cell: ({ row }) => {
            return (
                <div className=" font-medium  capitalize">
                    {(row.getValue('role') as string)?.toLowerCase()}
                </div>
            );
        },
    },
    {
        accessorKey: 'isActive',
        header: () => <div className="hidden lg:block">Is Active</div>,
        cell: ({ row }) => {
            return (
                <div className="hidden lg:block font-medium">
                    {row.getValue('isActive') ? 'Yes' : 'No'}
                </div>
            );
        },
    },
    {
        accessorKey: 'isVerified',
        header: () => <div className="hidden xl:block">Is Verified</div>,
        cell: ({ row }) => {
            return (
                <div className="hidden xl:block font-medium">
                    {row.getValue('isVerified') ? 'Yes' : 'No'}
                </div>
            );
        },
    },
    {
        accessorKey: 'createdAt',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                    className="hidden lg:flex"
                >
                    Created At
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <div className="hidden lg:block font-medium">
                    {moment(row.getValue('createdAt')).format('DD/MM/YYYY')}
                </div>
            );
        },
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => <ActionsDropdown user={row.original} />,
    },
];


export default columns