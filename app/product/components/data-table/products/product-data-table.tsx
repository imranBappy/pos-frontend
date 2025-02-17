"use client"
import { useState } from "react"
import {
    ColumnDef,
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
import { format } from "date-fns"
import { DataTableContent, DataTablePagination } from "@/components/data-table"
import { columns, TableFilters, FilterState } from './index'
import { useToast } from "@/hooks/use-toast"
import { PRODUCTS_QUERY } from "@/graphql/product/queries"
import { PRODUCT_TYPE } from "@/graphql/product/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const ProductsDataTable = () => {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const [filters, setFilters] = useState<FilterState>({
        search: '',
        category: null,
        subcategory: null,
        kitchen: null,
        tag: '',
        price: 0,
        priceLte: null,
        orderByPrice: '',
        isActive: 'ALL',
        orderBy: ""
    })
    const { toast } = useToast()



    const { loading, data: res, fetchMore } = useQuery(PRODUCTS_QUERY, {
        variables: {
            offset: pagination.pageIndex * pagination.pageSize,
            first: pagination.pageSize,
            ...filters,
            isActive: filters.isActive === 'ALL' ? undefined : filters.isActive === 'ACTIVE',
            createdAtStart: filters.dateRange?.from ? format(filters.dateRange.from, 'yyyy-MM-dd') : undefined,
            createdAtEnd: filters.dateRange?.to ? format(filters.dateRange.to, 'yyyy-MM-dd') : undefined,
            tag: filters.tag === 'ALL' ? '' : filters.tag,
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

    const products: PRODUCT_TYPE[] = res?.products?.edges?.map(({ node }: { node: PRODUCT_TYPE }) => ({
        id: node.id,
        name: node.name,
        price: node.price,
        images: node.images,
        sku: node.sku,
        cookingTime: node.cookingTime,
        tag: node.tag,
        isActive: node.isActive,
        createdAt: node.createdAt,
        vat: node.vat,
        kitchen: node.kitchen,
        category: node.category,
        subcategory: node.subcategory,
        ingredients:node.ingredients
    })) || [];

    const table = useReactTable({
        data: products,
        columns: columns as ColumnDef<PRODUCT_TYPE>[],
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
        pageCount: Math.ceil((res?.products?.totalCount || 0) / pagination.pageSize),
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
                    <Link href={`/product/add`}>
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
                columns={columns as ColumnDef<PRODUCT_TYPE>[]}
            />

            {/* Pagination - Make it responsive reuse */}
            <DataTablePagination
                table={table}
                totalCount={res?.products?.totalCount}
                pagination={pagination}
                setPagination={setPagination}
            />
        </div>
    );
};

export default ProductsDataTable;