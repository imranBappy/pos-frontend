"use client"
import { useState } from "react"
import {
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { useQuery } from "@apollo/client"
import { DataTableContent, DataTablePagination } from "@/components/data-table"
import { itemColumns, TableFilters, FilterState } from './index'
import { useToast } from "@/hooks/use-toast"
import { ITEM_TYPE } from "@/graphql/item/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ITEMS_QUERY } from "@/graphql/item/queries"
import { toFixed } from "@/lib/utils"
 

export const ItemDataTable = () => {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const [filters, setFilters] = useState<FilterState>({
        search: '',
        safetyStock: 0,
        stock: 0,
        price: 0,
        category: null,
    });
    const { toast } = useToast()

    const {
        loading,
        data: res,
        fetchMore,
    } = useQuery(ITEMS_QUERY, {
        variables: {
            offset: pagination.pageIndex * pagination.pageSize,
            first: pagination.pageSize,
            ...filters,
            search: filters.search ? filters.search : null,
            safetyStock: filters.safetyStock ? filters.safetyStock : null,
            stock: filters.stock ? filters.stock : null,
            price: filters.price ? filters.price : null,
        },
        onError: (error) => {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        },
    });

    const handleFilterChange = (key: keyof FilterState) => (value: FilterState[typeof key]) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
        }))
    }

    const items: ITEM_TYPE[] =
        res?.items?.edges?.map(({ node }: { node: ITEM_TYPE }) => ({
            id: node.id,
            name: node.name,
            currentStock: toFixed(node.currentStock,2),
            sku: node.sku,
            category: node.category,
            unit: node.unit,
            stock: node.stock,
            safetyStock: node.safetyStock,
            stockLevel: node.stockLevel,
        })) || [];

    const table = useReactTable({
        data: items,
        columns: itemColumns,

        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            pagination,
        },
        manualPagination: true,
        pageCount: Math.ceil((res?.items?.totalCount || 0) / pagination.pageSize),
        onPaginationChange: (updater) => {
            const newPagination = typeof updater === 'function'
                ? updater(pagination)
                : updater;
            setPagination(newPagination);

            fetchMore({
                variables: {
                    offset: newPagination.pageIndex * newPagination.pageSize,
                    first: newPagination.pageSize,
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev;
                    return fetchMoreResult;
                },
            });
        },
    })



    return (
        <div className="w-full">
            <div className="flex justify-end">
                <Button variant={'secondary'} className="w-[95px] mr-2">
                    <Link href={`/items/add`}>
                        Add</Link>
                </Button>
            </div>
            {/* Filters - Updated grid layout */}
            <TableFilters
                filters={filters}
                onFilterChange={handleFilterChange}
            />

            {/* Table - Add horizontal scroll wrapper -> reuse */}
            <DataTableContent
                table={table}
                loading={loading}
                columns={itemColumns}
            />

            {/* Pagination - Make it responsive reuse */}
            <DataTablePagination
                table={table}
                totalCount={res?.items?.totalCount}
                pagination={pagination}
                setPagination={setPagination}
            />
        </div>
    );
};

export default ItemDataTable;