import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { ChevronLeft, ChevronsLeft, ChevronRight, ChevronsRight } from 'lucide-react';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Table } from "@tanstack/react-table"

interface PaginationProps<TData> {
    table: Table<TData>
    totalCount: number,
    pagination: {
        pageIndex: number
        pageSize: number
    }
    setPagination: (pagination: { pageIndex: number; pageSize: number }) => void
}

export const DataTablePagination = <TData,>({ table, totalCount, pagination, setPagination }: PaginationProps<TData>) => {
    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 py-4">
            <div className="flex-1 text-sm text-muted-foreground text-center sm:text-left">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
                {/* Total  */}
                <div className="flex items-center space-x-2 min-w-[120px]">
                    <Label className="text-sm font-medium text-gray-500 whitespace-nowrap">
                        Total rows
                    </Label>
                    <div className="text-sm font-medium">{totalCount}</div>
                </div>

                {/* Page Size Selector */}
                <div className="flex items-center space-x-2 min-w-[100px]">
                    <Select
                        value={pagination.pageSize.toString()}
                        onValueChange={(value) => setPagination({ ...pagination, pageSize: parseInt(value) })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select page size" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="30">30</SelectItem>
                            <SelectItem value="40">40</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Page Navigation */}
                <div className="flex items-center gap-2">
                    <Input
                        className="w-16 text-center"
                        type="number"
                        min={1}
                        max={table.getPageCount()}
                        value={table.getState().pagination.pageIndex + 1}
                        onChange={(e) => table.setPageIndex(parseInt(e.target.value) - 1)}
                    />

                    <div className="flex items-center space-x-2">
                        <Button
                            className="w-8 h-8 p-0"
                            variant="outline"
                            size="sm"
                            onClick={() => table.resetPageIndex()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            className="w-8"
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronLeft />
                        </Button>
                        <Button
                            className="w-8"
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronRight />
                        </Button>
                        <Button
                            className="w-8"
                            variant="outline"
                            size="sm"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronsRight />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataTablePagination;