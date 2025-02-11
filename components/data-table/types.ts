import { ColumnDef, Table } from "@tanstack/react-table"
import { DateRange } from "react-day-picker"

export interface FilterState {
  search: string
  gender: string
  isActive: string
  role: string
  dateRange?: DateRange
}

export interface DataTableContentProps<TData> {
  loading: boolean
  table: Table<TData>
  columns: ColumnDef<TData>[]
}

export interface PaginationProps<TData> {
  table: Table<TData>
  totalCount: number
  pagination: {
    pageIndex: number
    pageSize: number
  }
  setPagination: (pagination: { pageIndex: number; pageSize: number }) => void
}

export interface TableFiltersProps {
  filters: FilterState
  onFilterChange: <K extends keyof FilterState>(
    key: K
  ) => (value: FilterState[K]) => void
} 