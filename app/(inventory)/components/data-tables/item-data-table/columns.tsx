import { ColumnDef } from "@tanstack/react-table"

import moment from "moment"
import { ActionsDropdown } from "./actions-dropdown"
import { ITEM_TYPE } from "@/graphql/item/types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import ItemStockStatus from "@/components/item-stock-status";
import { itemStockStatus } from "@/lib/utils";
import Link from "next/link";

interface Category {
    name: string;
}

export const itemColumns: ColumnDef<ITEM_TYPE>[] = [
    {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
            <div className="capitalize flex gap-2 items-center min-w-20 ">
                <Button
                    variant={'link'}
                >
                    <Link
                        href={`/items/${row.original.id}/details?itemId=${row.original.id}`}
                        className=" text-base"
                    >
                        {row.getValue('name')}
                    </Link>
                </Button>
                <ItemStockStatus
                    status={itemStockStatus(
                        row.getValue('currentStock'),
                        row.getValue('safetyStock')
                    )}
                />
            </div>
        ),
    },
    {
        accessorKey: 'stock',
        header: ' Stock',
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue('stock')}</div>
        ),
    },
    {
        accessorKey: 'currentStock',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === 'asc')
                }
                className="hidden lg:flex"
            >
                Current Stock
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue('currentStock')}</div>
        ),
    },
    {
        accessorKey: 'safetyStock',
        header: 'Safety Stock',
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue('safetyStock')}</div>
        ),
    },
    {
        header: 'Stock Lavel',
        accessorKey: 'stockLevel',
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue('stockLevel')}%</div>
        ),
    },
    {
        accessorKey: 'unit',
        header: 'Unit',
        cell: ({ row }) => (
            <div className="capitalize">
                {(row.getValue('unit') as Category)?.name}
            </div>
        ),
    },
    {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => (
            <div className="capitalize">
                {(row.getValue('category') as Category)?.name}
            </div>
        ),
    },
    {
        accessorKey: 'sku',
        header: 'SKU',
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue('sku')}</div>
        ),
    },
    {
        accessorKey: 'createdAt',
        header: 'Created At',
        cell: ({ row }) => (
            <div className="capitalize">{`${moment(
                row.getValue('createdAt')
            ).format('DD/MM/YYYY')} - ${moment(
                row.getValue('createdAt')
            ).fromNow()} `}</div>
        ),
    },
    {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => <ActionsDropdown item={row.original} />,
    },
];


export default itemColumns