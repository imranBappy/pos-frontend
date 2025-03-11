import { ColumnDef } from "@tanstack/react-table";
import { WASTE_TYPE } from "@/graphql/waste/types"; // Import your Waste type
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import moment from "moment";
import Link from "next/link"; // If you want to link to a detail page
import Actions from "./actions";

export const wasteColumns: ColumnDef<WASTE_TYPE>[] = [
    {
        accessorKey: 'date',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }
            >
                Date
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => moment(row.getValue('date')).format('DD/MM/YYYY'), // Format the date
    },
    {
        accessorKey: 'responsible',
        header: 'Responsible',
        cell: ({ row }) => {
            const responsibleUser = row.original.responsible; // Access the user object
            if (responsibleUser) {
                return (
                    <Button variant={'link'}>
                        <Link
                            href={`/users/${responsibleUser.id}`}
                            className="capitalize"
                        >
                            {responsibleUser.name}
                        </Link>
                    </Button>
                );
            } else {
                return 'N/A'; // Or handle the case where no user is assigned
            }
        },
    },
    {
        accessorKey: 'note',
        header: () => 'Note',
        cell: ({ row }) => (
            <div className="line-clamp-2">{row.getValue('note')}</div>
        ), // Optionally truncate long notes
    },
    {
        accessorKey: 'totalLossAmount',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }
            >
                Total Loss
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => row.getValue('totalLossAmount'), // Format as needed
    },
    {
        accessorKey: 'createdAt',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }
                className="hidden lg:flex" // Hide on smaller screens if needed
            >
                Created At
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="hidden lg:block font-medium">
                {moment(row.getValue('createdAt')).format('DD/MM/YYYY')}
            </div>
        ),
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => <Actions item={row.original} />, // Pass the waste object
    },
];

export default wasteColumns;