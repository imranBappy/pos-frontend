"use client"
import { useState } from "react"
import {
    ColumnDef,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { useQuery } from "@apollo/client"
import { DataTableContent, DataTablePagination } from "@/components/data-table"
import { columns, TableFilters, FilterState } from './index'
import { useToast } from "@/hooks/use-toast"
import { ORDERS_QUERY } from "@/graphql/product/queries"
import { ORDER_TYPE } from "@/graphql/product/types"

export const OrdersDataTable = () => {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const [filters, setFilters] = useState<FilterState>({
        search: '',
        status: undefined,
        type: undefined,
        orderBy: undefined,
    })
    const { toast } = useToast()

    const { loading, data: res, fetchMore } = useQuery(ORDERS_QUERY, {
        variables: {
            offset: pagination.pageIndex * pagination.pageSize,
            first: pagination.pageSize,
            ...filters,
            status: filters.status === 'ALL' ? undefined : filters.status,
            type: filters.type === 'ALL' ? undefined : filters.type,
            orderBy: filters.orderBy === 'ALL' ? undefined : filters.orderBy,
            search: filters.search === '' ? undefined : filters.search,
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

    const orders: ORDER_TYPE[] = res?.orders?.edges?.map(({ node }: { node: ORDER_TYPE }) => ({
        id: node.id,
        createdAt: node.createdAt,
        payments: node.payments,
        status: node.status,
        finalAmount: node.finalAmount,
        user: node.user,
        address: node.address,
        items: node.items,
        type: node.type,
        orderId: node.orderId,
        due: node.due || 0,
        outlet: node.outlet,
        amount: node.amount,

    })) || [];


    const table = useReactTable({
        data: orders,
        columns: columns as ColumnDef<ORDER_TYPE>[],
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: { pagination, },
        manualPagination: true,
        pageCount: Math.ceil((res?.orders?.totalCount || 0) / pagination.pageSize),
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
                columns={columns as ColumnDef<ORDER_TYPE>[]}
            />

            {/* Pagination - Make it responsive reuse */}
            <DataTablePagination
                table={table}
                totalCount={res?.orders?.totalCount}
                pagination={pagination}
                setPagination={setPagination}
            />
        </div>
    );
};

export default OrdersDataTable;