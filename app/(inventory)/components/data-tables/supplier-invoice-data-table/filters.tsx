"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

export interface SupplierInvoiceFilterState {
  search: string;
}

export interface SupplierFiltersProps {
  filters: SupplierInvoiceFilterState;
  onFilterChange: <K extends keyof SupplierInvoiceFilterState>(
    field: K
  ) => (value: SupplierInvoiceFilterState[K]) => void;
}

export function SupplierInvoiceTableFilters({ filters, onFilterChange }: SupplierFiltersProps) {
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search)

  // const handleFilterChange = (key: keyof SupplierPaymentFilterState) => (value: SupplierPaymentFilterState[typeof key]) => {
  //   onFilterChange(key)(value)
  // }

  const handleSearchChange = (value: string) => {
    setDebouncedSearch(value)
  }

  const handleClearFilters = () => {
    onFilterChange('search')('')
    setDebouncedSearch('')
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange("search")(debouncedSearch)
    }, 500)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  return (
    <>
      <div className="grid grid-cols-1 mt-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <Input
            className="max-w-80"
            placeholder="Search by name"
            value={debouncedSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <div className="
                        flex-1
                        text-sm
                        text-muted-foreground
                        whitespace-nowrap
                        mr-2
                        flex
                        justify-end
                        items-end
                    ">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="text-sm"
          >
            <X />
            Reset
          </Button>
        </div>
      </div>
    </>
  );
}

export default SupplierInvoiceTableFilters;