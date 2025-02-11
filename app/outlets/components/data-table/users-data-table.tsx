"use client"
import { useState } from "react"
import {
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import { useQuery } from "@apollo/client"
import { USERS_QUERY } from "@/graphql/accounts/queries"
import { USER_TYPE } from "@/graphql/accounts"

import { format } from "date-fns"
import { DateRange } from "react-day-picker"
import { DataTableContent, DataTablePagination } from "@/components/data-table"
import { columns, TableFilters } from './index'
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import Link from "next/link"



export interface UserFilterState {
    search: string
    gender: string
    isActive: string
    role: number | undefined
    dateRange?: DateRange
}

export const UsersDataTable = () => {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const [filters, setFilters] = useState<UserFilterState>({
        search: '',
        gender: 'ALL',
        isActive: 'ALL',
        role: undefined,
        dateRange: undefined,
    })
    const { toast } = useToast()

    const { loading, data: res, fetchMore } = useQuery(USERS_QUERY, {
        variables: {
            offset: pagination.pageIndex * pagination.pageSize,
            first: pagination.pageSize,
            ...filters,
            gender: filters.gender === 'ALL' ? '' : filters.gender,
            isActive: filters.isActive === 'ACTIVE' ? true : filters.isActive === 'INACTIVE' ? false : undefined,
            createdAtStart: filters.dateRange?.from ? format(filters.dateRange.from, 'yyyy-MM-dd') : undefined,
            createdAtEnd: filters.dateRange?.to ? format(filters.dateRange.to, 'yyyy-MM-dd') : undefined,
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

    const handleFilterChange = (key: keyof UserFilterState) => (value: UserFilterState[typeof key]) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
        }))
    }

    const users: USER_TYPE[] = res?.users?.edges?.map(({ node }: { node: USER_TYPE }) => ({
        id: node.id,
        email: node.email,
        name: node.name,
        role: node.role?.name,
    })) || [];

    const table = useReactTable({
        data: users,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
        manualPagination: true,
        pageCount: Math.ceil((res?.users?.totalCount || 0) / pagination.pageSize),
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
                    <Link href={`/users/add`}>  Add</Link>
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
                columns={columns}
            />

            {/* Pagination - Make it responsive reuse */}
            <DataTablePagination
                table={table}
                totalCount={res?.users?.totalCount}
                pagination={pagination}
                setPagination={setPagination}
            />
        </div>
    );
};

export default UsersDataTable;