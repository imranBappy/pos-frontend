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
import { supplierInvoiceColumns, SupplierInvoiceTableFilters, } from './index' // Import SupplierInvoice components
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SUPPLIER_INVOICES_QUERY } from "@/graphql/supplier-invoice/queries" // Import SupplierInvoice query
import { SUPPLIER_INVOICE_TYPE } from "@/graphql/supplier-invoice/types" // Import SupplierInvoice type
import { SupplierInvoiceFilterState } from "../supplier-payment-data-table"



export const SupplierInvoiceDataTable = () => {
    const { toast } = useToast()
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const [filters, setFilters] = useState<SupplierInvoiceFilterState>({
        search: '',
    })

    const { loading, data: res, fetchMore } = useQuery(SUPPLIER_INVOICES_QUERY, { // Use SupplierInvoice query
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

    const supplierInvoices: SUPPLIER_INVOICE_TYPE[] = res?.supplierInvoices?.edges?.map(({ node }: { node: SUPPLIER_INVOICE_TYPE }) => ({ // Use SUPPLIER_INVOICE_TYPE
        id: node.id,
        due: node.due,
        duePaymentDate: node.duePaymentDate,
        invoiceNumber: node.invoiceNumber,
        amount: node.amount,
        status: node.status,
        supplier: node.supplier,
        createdAt: node.createdAt,
        updatedAt: node.updatedAt,
        paidAmount: node.paidAmount,
    })) || [];

    const table = useReactTable({
        data: supplierInvoices, // Use supplierInvoices data
        columns: supplierInvoiceColumns, // Use supplierInvoice columns
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            pagination,
        },
        manualPagination: true,
        pageCount: Math.ceil((res?.supplierInvoices?.totalCount || 0) / pagination.pageSize), // Use supplierInvoices count
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

    const handleFilterChange = (key: keyof SupplierInvoiceFilterState) => (value: SupplierInvoiceFilterState[typeof key]) => {
        setFilters((prev: SupplierInvoiceFilterState) => ({
            ...prev,
            [key]: value,
        }))
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-5">
                <h1 className=" text-xl">Supplier Invoices</h1>
                <Button variant={'secondary'} className="w-[95px] mr-2">
                    <Link href={`/supplier-invoices/add`}> Add</Link>
                </Button>
            </div>

            {/* Data Filter */}
            <SupplierInvoiceTableFilters
                filters={filters}
                onFilterChange={handleFilterChange}
            />

            {/* Table - Add horizontal scroll wrapper -> reuse */}
            <DataTableContent
                table={table}
                loading={loading}
                columns={supplierInvoiceColumns} // Use supplierInvoice columns
            />

            {/* Pagination - Make it responsive reuse */}
            <DataTablePagination
                table={table}
                totalCount={res?.supplierInvoices?.totalCount} // Use supplierInvoices count
                pagination={pagination}
                setPagination={setPagination}
            />
        </div>
    );
};

export default SupplierInvoiceDataTable;