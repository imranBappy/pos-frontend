"use client"
import { useState } from "react"
import {
    ColumnDef,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { useQuery } from "@apollo/client"
import { useToast } from "@/hooks/use-toast"
import { DataTableContent, DataTablePagination } from "@/components/data-table"
import { columns, TableFilters, FilterState } from './index'
import { FLOORS_QUERY, FLOOR_TYPE } from "@/graphql/product"

export const FloorsDataTable = () => {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const [filters, setFilters] = useState<FilterState>({
        search: '',
        isActive: 'ALL',
        orderBy: ""
    })
    const { toast } = useToast()

    const { loading, data: res, fetchMore } = useQuery(FLOORS_QUERY, {
        variables: {
            offset: pagination.pageIndex * pagination.pageSize,
            first: pagination.pageSize,
            ...filters,
            isActive: filters.isActive === 'ALL' ? undefined : filters.isActive === 'ACTIVE',
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

    const floors: FLOOR_TYPE[] = res?.floors?.edges?.map(({ node }: { node: FLOOR_TYPE }) => ({
        id: node.id,
        name: node.name,
        createdAt: node.createdAt,
        floorTables: node.floorTables,
        isActive: node.isActive
    })) || [];

    const table = useReactTable({
        data: floors,
        columns: columns as ColumnDef<FLOOR_TYPE>[],
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            pagination,
        },
        manualPagination: true,
        pageCount: Math.ceil((res?.floors?.totalCount || 0) / pagination.pageSize),
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
            {/* Filters - Updated grid layout */}
            <TableFilters
                filters={filters}
                onFilterChange={handleFilterChange}
            />

            {/* Table - Add horizontal scroll wrapper -> reuse */}
            <DataTableContent
                table={table}
                loading={loading}
                columns={columns as ColumnDef<FLOOR_TYPE>[]}
            />

            {/* Pagination - Make it responsive reuse */}
            <DataTablePagination
                table={table}
                totalCount={res?.floors?.totalCount}
                pagination={pagination}
                setPagination={setPagination}
            />
        </div>
    );
};

export default FloorsDataTable;