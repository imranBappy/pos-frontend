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
import { FilterState, supplierColumns, TableFilters } from './index'
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SUPPLIERS_QUERY } from "@/graphql/supplier/queries"
import { SUPPLIER_TYPE } from "@/graphql/supplier/types"




export const SupplierDataTable = () => {
    const { toast } = useToast()
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const [filters, setFilters] = useState<FilterState>({
        search: undefined,
    })
    
    


    const { loading, data: res, fetchMore } = useQuery(SUPPLIERS_QUERY, {
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

    const suppliers: SUPPLIER_TYPE[] = res?.suppliers?.edges?.map(({ node }: { node: SUPPLIER_TYPE }) => ({
        id: node.id,
        name: node.name,
        emailAddress: node.emailAddress,
        whatsappNumber: node.whatsappNumber,
        phoneNumber: node.phoneNumber,
        address: node.address,
    })) || [];

    const table = useReactTable({
        data: suppliers,
        columns: supplierColumns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            pagination,
        },
        manualPagination: true,
        pageCount: Math.ceil((res?.suppliers?.totalCount || 0) / pagination.pageSize),
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
                <h1 className=" text-xl">Suppliers</h1>
                <Button variant={'secondary'} className="w-[95px] mr-2">
                    <Link href={`/suppliers/add`}>  Add</Link>
                </Button>
            </div>
            
            {/* Data Filter */}
            <TableFilters
                filters={filters}
                onFilterChange={handleFilterChange}
            />

            {/* Table - Add horizontal scroll wrapper -> reuse */}
            <DataTableContent
                table={table}
                loading={loading}
                columns={supplierColumns}
            />

            {/* Pagination - Make it responsive reuse */}
            <DataTablePagination
                table={table}
                totalCount={res?.suppliers?.totalCount}
                pagination={pagination}
                setPagination={setPagination}
            />
        </div>
    );
};

export default SupplierDataTable;