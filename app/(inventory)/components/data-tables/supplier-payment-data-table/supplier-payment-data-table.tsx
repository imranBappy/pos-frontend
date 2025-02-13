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
import { supplierPaymentColumns } from './index' // Import SupplierPayment components
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { SUPPLIER_PAYMENTS_QUERY } from "@/graphql/supplier-payment/queries" // Import SupplierPayment query
import { SUPPLIER_PAYMENT_TYPE } from "@/graphql/supplier-payment/types" // Import SupplierPayment type
import { SupplierInvoiceFilterState, SupplierInvoiceTableFilters } from "../supplier-invoice-data-table"



export const SupplierPaymentDataTable = () => {
    const { toast } = useToast()
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    })

    const [filters, setFilters] = useState<SupplierInvoiceFilterState>({ // Use SupplierPaymentFilterState
        search: '',
    })

    const { loading, data: res, fetchMore } = useQuery(SUPPLIER_PAYMENTS_QUERY, { // Use SupplierPayment query
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
    console.log(res?.supplierPayments?.edges);
    
    const supplierPayments: SUPPLIER_PAYMENT_TYPE[] = res?.supplierPayments?.edges?.map(({ node }: { node: SUPPLIER_PAYMENT_TYPE }) => ({ // Use SUPPLIER_PAYMENT_TYPE
        id: node.id,
        supplier: node.supplier,
        invoice: node.invoice,
        paymentMethod: node.paymentMethod,
        referenceNumber: node.referenceNumber,
        trxId: node.trxId,
        status: node.status,
        createdAt: node.createdAt,
        updatedAt: node.updatedAt,
        amount: node.amount,

    })) || [];

    const table = useReactTable({
        data: supplierPayments, // Use supplierPayments data
        columns: supplierPaymentColumns, // Use supplierPayment columns
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            pagination,
        },
        manualPagination: true,
        pageCount: Math.ceil((res?.supplierPayments?.totalCount || 0) / pagination.pageSize), // Use supplierPayments count
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
            <div className="flex  justify-between items-center mb-5">
                <h1 className=" text-xl">Supplier Payments</h1>
                <Button variant={'secondary'} className="w-[95px] mr-2">
                    <Link href={`/supplier-payments/add`}> Add</Link>
                </Button>
            </div>

            {/* Data Filter */}
            <SupplierInvoiceTableFilters // Use SupplierPaymentTableFilters
                filters={filters}
                onFilterChange={handleFilterChange}
            />

            {/* Table - Add horizontal scroll wrapper -> reuse */}
            <DataTableContent
                table={table}
                loading={loading}
                columns={supplierPaymentColumns} // Use supplierPayment columns
            />

            {/* Pagination - Make it responsive reuse */}
            <DataTablePagination
                table={table}
                totalCount={res?.supplierPayments?.totalCount} // Use supplierPayments count
                pagination={pagination}
                setPagination={setPagination}
            />
        </div>
    );
};

export default SupplierPaymentDataTable;