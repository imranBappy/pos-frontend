"use client"
import { useState } from "react"
import {
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
import { PAYMENT_TYPE } from "@/graphql/product/types"
import { PAYMENTS_QUERY } from "@/graphql/product/queries"

export const PaymentsDataTable = () => {
    const [rowSelection, setRowSelection] = useState({})
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const [filters, setFilters] = useState<FilterState>({
        search: undefined,
        status: undefined,
        paymentMethod: undefined,
        orderBy: undefined,
    })
    const { toast } = useToast()

    const { loading, data: res, fetchMore } = useQuery(PAYMENTS_QUERY, {
        variables: {
            offset: pagination.pageIndex * pagination.pageSize,
            first: pagination.pageSize,
            ...filters,
            status: filters.status,
            paymentMethod: filters.paymentMethod,
            orderBy: filters.orderBy,
            search: filters.search,
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

    const payments: PAYMENT_TYPE[] = res?.payments?.edges?.map(({ node }: { node: PAYMENT_TYPE }) => ({
        id: node.id,
        createdAt: node.createdAt,
        paymentMethod: node.paymentMethod,
        status: node.status,
        amount: node.amount,
        user: node.user,
        remarks: node.remarks,
        trxId: node.trxId,
        order: node.order,
    })) || [];


    const table = useReactTable({
        data: payments,
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
        pageCount: Math.ceil((res?.payments?.totalCount || 0) / pagination.pageSize),
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
                columns={columns}
            />

            {/* Pagination - Make it responsive reuse */}
            <DataTablePagination
                table={table}
                totalCount={res?.payments?.totalCount}
                pagination={pagination}
                setPagination={setPagination}
            />
        </div>
    );
};

export default PaymentsDataTable;