"use client"
import { useState } from "react"
import {
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { useQuery } from "@apollo/client"
import { DataTableContent, DataTablePagination } from "@/components/data-table"
import { FilterState, itemCategoryColumns, TableFilters } from './index'
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ITEM_CATEGORES_QUERY } from "@/graphql/item-category/queries"
import { ITEM_CATEGORY_TYPE } from "@/graphql/item-category/types"




export const ItemCategoryDataTable = () => {
    const { toast } = useToast()
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })
    const [filters, setFilters] = useState<FilterState>({
        search: undefined,
    })


    const { loading, data: res, fetchMore } = useQuery(ITEM_CATEGORES_QUERY, {
        variables: {
            offset: pagination.pageIndex * pagination.pageSize,
            first: pagination.pageSize,
            ...filters
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            })
        }
    }
    );



    const itemCategories: ITEM_CATEGORY_TYPE[] = res?.itemCategories?.edges?.map(({ node }: { node: ITEM_CATEGORY_TYPE }) => ({
        id: node.id,
        name: node.name,
        address: node.description,
    })) || [];

    const table = useReactTable({
        data: itemCategories,
        columns: itemCategoryColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            pagination,
        },
        manualPagination: true,
        pageCount: Math.ceil((res?.itemCategories?.totalCount || 0) / pagination.pageSize),
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

    const handleFilterChange = (key: keyof FilterState) => (value: FilterState[typeof key]) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
        }))
    }

    return (
        <div className="w-full">
            <div className="flex  justify-between items-center mb-5">
                <h1 className=" text-xl">Categories</h1>
                <Button variant={'secondary'} className="w-[95px] mr-2">
                    <Link href={`/item-categories/add`}>  Add</Link>
                </Button>
            </div>
            <TableFilters
                filters={filters}
                onFilterChange={handleFilterChange}
            />
            {/* Table - Add horizontal scroll wrapper -> reuse */}
            <DataTableContent
                table={table}
                loading={loading}
                columns={itemCategoryColumns}
            />

            {/* Pagination - Make it responsive reuse */}
            <DataTablePagination
                table={table}
                totalCount={res?.itemCategories?.totalCount}
                pagination={pagination}
                setPagination={setPagination}
            />
        </div>
    );
};

export default ItemCategoryDataTable;