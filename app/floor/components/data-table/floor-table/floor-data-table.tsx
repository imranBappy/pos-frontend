'use client'
import { useState } from 'react'
import {
    ColumnDef,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { useQuery } from '@apollo/client'
import { useToast } from '@/hooks/use-toast'
import { FLOOR_TABLES_QUERY, FLOOR_TYPE } from '@/graphql/product'
import { DataTableContent, DataTablePagination } from '@/components/data-table'
import { columns, TableFilters, FilterState } from './index'
import { useDebouncedCallback } from "use-debounce";
import { getPageCount, getTotalCount } from '@/lib/utils'
type FLOOR_NODE_TYPE = {
    node: FLOOR_TYPE
}

export const mapFloorsData = (edges: FLOOR_NODE_TYPE[]): FLOOR_TYPE[] =>
    edges?.map(({ node }: { node: FLOOR_TYPE }) => ({
        id: node.id,
        name: node.name,
        createdAt: node.createdAt,
        floorTables: node?.floorTables,
        isActive: node.isActive,
        isBooked:node.isBooked
    })) || [];


export const FloorTablesDataTable = () => {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })
    const [filters, setFilters] = useState<FilterState>({
        search: '',
        isActive: 'ALL',
        orderBy: '',
        floor: null
    })
    const { toast } = useToast()



    const { loading, data: res, fetchMore } = useQuery(FLOOR_TABLES_QUERY, {
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
    const floorTables: FLOOR_TYPE[] = mapFloorsData(res?.floorTables?.edges)
    const totalCount = getTotalCount(res?.products?.totalCount)
    const handleFilterChange = (key: keyof FilterState) => (value: FilterState[typeof key]) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
        }))
    }

    const handlePaginationChange = useDebouncedCallback((updater) => {
        const newPagination = typeof updater === "function" ? updater(pagination) : updater;
        setPagination(newPagination);
        fetchMore({
            variables: {
                offset: newPagination.pageIndex * newPagination.pageSize,
                first: newPagination.pageSize,
            },
        });
    }, 300);

    const table = useReactTable({
        data: floorTables,
        columns: columns as ColumnDef<FLOOR_TYPE>[],
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: {
            pagination,
        },
        manualPagination: true,
        pageCount: getPageCount(totalCount, pagination.pageSize),
        onPaginationChange: handlePaginationChange,
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
                totalCount={totalCount}
                pagination={pagination}
                setPagination={setPagination}
            />
        </div>
    );
};

export default FloorTablesDataTable;