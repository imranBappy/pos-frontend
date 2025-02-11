"use client"
import { useState } from "react"
import {
    ColumnDef,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { useQuery } from "@apollo/client"
import { DataTableContent, DataTablePagination } from "@/components/data-table"
import { columns, TableFilters, FilterState } from './index'
import { useToast } from "@/hooks/use-toast"
import { CATEGORIES_QUERY } from "@/graphql/product/queries"
import { CATEGORY_TYPE } from "@/graphql/product/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const CategoriesDataTable = () => {
    const [rowSelection, setRowSelection] = useState({})
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const [filters, setFilters] = useState<FilterState>({
        search: '',
        isCategory: 'ALL',
        isActive: 'ALL',
        parent: '',
    })
    const { toast } = useToast()



    const { loading, data: res, fetchMore } = useQuery(CATEGORIES_QUERY, {
        variables: {
            offset: pagination.pageIndex * pagination.pageSize,
            first: pagination.pageSize,
            ...filters,
            isActive: filters.isActive === 'ALL' ? undefined : filters.isActive === 'ACTIVE',
            isCategory: filters.isCategory === 'ALL' ? undefined : filters.isCategory === 'category',
            parent: filters.parent === '' ? undefined : filters.parent
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

    const handleFilterChange = (key: keyof FilterState) => (value: FilterState[typeof key]) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
        }))
    }

    const products: CATEGORY_TYPE[] = res?.categories?.edges?.map(({ node }: { node: CATEGORY_TYPE }) => ({
        id: node.id,
        name: node.name,
        isActive: node.isActive,
        products: node.products,
        subcategories: node.subcategories,
    })) || [];

    const table = useReactTable({
        data: products,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            rowSelection,
            pagination,
        },
        manualPagination: true,
        pageCount: Math.ceil((res?.categories?.totalCount || 0) / pagination.pageSize),
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
                    <Link href={`/product/category/add`}>
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
                columns={columns as ColumnDef<CATEGORY_TYPE>[]}
            />

            {/* Pagination - Make it responsive reuse */}
            <DataTablePagination
                table={table}
                totalCount={res?.categories?.totalCount}
                pagination={pagination}
                setPagination={setPagination}
            />
        </div>
    );
};

export default CategoriesDataTable;