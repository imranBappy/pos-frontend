"use client"
import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface FilterState {
  search: string | undefined;
}

interface FiltersProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(
    field: K
  ) => (value: FilterState[K]) => void;
}

export function TableFilters({ filters, onFilterChange }: FiltersProps) {
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search)
  const handleSearchChange = (value: string) => {
    setDebouncedSearch(value)
    onFilterChange("search")(value)
  }

  const handleClearFilters = () => {
    onFilterChange('search')('')
    setDebouncedSearch('')

  };
  return (
    <>
      <div className="flex justify-between flex-wrap mb-5">
        <div className="space-y-2 w-72 ">
          <Label>Search</Label>
          <Input
            placeholder="Search..."
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

export default TableFilters 