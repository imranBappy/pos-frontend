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
import { WasteFilterState, wasteColumns, WasteTableFilters } from './index' // Import Waste components
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { WASTES_QUERY } from "@/graphql/waste/queries" // Import Waste query
import { WASTE_TYPE } from "@/graphql/waste/types" // Import Waste type



export const WasteDataTable = () => {
    const { toast } = useToast()
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const [filters, setFilters] = useState<WasteFilterState>({ // Use WasteFilterState
        search: undefined,
        totalLossAmount: null,
        totalLossAmountLte: null,
        dateRange: undefined,
        orderBy: '',
    })

    const { loading, data: res, fetchMore } = useQuery(WASTES_QUERY, { // Use Waste query
        variables: {
            offset: pagination.pageIndex * pagination.pageSize,
            first: pagination.pageSize,
            ...filters, // Spread the filters
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

    const wastes: WASTE_TYPE[] =
        res?.wastes?.edges?.map(({ node }: { node: WASTE_TYPE }) => ({
            // Use WASTE_TYPE
            id: node.id,
            date: node.date,
            responsible: node.responsible,
            note: node.notes,
            totalLossAmount: node.estimatedCost,
            createdAt: node.createdAt,
            updatedAt: node.updatedAt,
        })) || [];

    const table = useReactTable({
        data: wastes, // Use wastes data
        columns: wasteColumns, // Use waste columns
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            pagination,
        },
        manualPagination: true,
        pageCount: Math.ceil((res?.wastes?.totalCount || 0) / pagination.pageSize), // Use wastes count
        onPaginationChange: (updater) => {
            const newPagination = typeof updater === 'function'
                ? updater(pagination)
                : updater;
            setPagination(newPagination);

            fetchMore({
                variables: {
                    offset: newPagination.pageIndex * newPagination.pageSize,
                    first: newPagination.pageSize,
                    ...filters, // Pass filters to fetchMore
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) return prev;
                    return fetchMoreResult;
                },
            });
        },
    })

    const handleFilterChange = (key: keyof WasteFilterState) => (value: WasteFilterState[typeof key]) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
        }))
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-5">
                <h1 className=" text-xl">Wastes</h1>
                <Button variant={'secondary'} className="w-[95px] mr-2">
                    <Link href={`/wastes/add`}>  Add</Link>
                </Button>
            </div>

            {/* Data Filter */}
            <WasteTableFilters // Use WasteTableFilters
                filters={filters}
                onFilterChange={handleFilterChange}
            />

            {/* Table - Add horizontal scroll wrapper -> reuse */}
            <DataTableContent
                table={table}
                loading={loading}
                columns={wasteColumns} // Use waste columns
            />

            {/* Pagination - Make it responsive reuse */}
            <DataTablePagination
                table={table}
                totalCount={res?.wastes?.totalCount} // Use wastes count
                pagination={pagination}
                setPagination={setPagination}
            />
        </div>
    );
};

export default WasteDataTable;