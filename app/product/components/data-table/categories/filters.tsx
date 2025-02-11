import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { X } from "lucide-react"
import { useQuery } from "@apollo/client"
import { CATEGORIES_QUERY, CATEGORY_TYPE } from "@/graphql/product"
import Combobox from "@/components/input/combobox"


export interface FilterState {
  search: string;
  isCategory: 'ALL' | 'category'
  isActive: 'ALL' | 'ACTIVE' | 'INACTIVE',
  parent: string
}

interface FiltersProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(
    field: K
  ) => (value: FilterState[K]) => void;
}




export function TableFilters({ filters, onFilterChange }: FiltersProps) {
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search)


  const { data: categories_data, loading: categories_loading } = useQuery(CATEGORIES_QUERY, {
    variables: {
      offset: 0,
      isCategory: true,
    },
  })

  const categories = categories_data?.categories?.edges?.map((node: { node: CATEGORY_TYPE }) => ({
    value: node.node.id,
    label: node.node.name,
  }))

  const handleFilterChange = (key: keyof FilterState) => (value: FilterState[typeof key]) => {
    onFilterChange(key)(value)
  }

  const handleSearchChange = (value: string) => {
    setDebouncedSearch(value)
  }

  const handleClearFilters = () => {
    onFilterChange('search')('')
    onFilterChange('isActive')('ALL')
    onFilterChange('isCategory')('ALL')
    setDebouncedSearch('')
    onFilterChange('parent')('')
  };


  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange("search")(debouncedSearch)
    }, 500)
    return () => clearTimeout(timer)
  }, [debouncedSearch, onFilterChange])



  return (
    <>
      <div className="grid grid-cols-1 mt-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        <div className="space-y-2">
          <Input
            placeholder="Search by name"
            value={debouncedSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Select
            value={filters.isActive}
            onValueChange={handleFilterChange('isActive')}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Category</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Select
            value={filters.isCategory}
            onValueChange={handleFilterChange('isCategory')}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="category">Category</SelectItem>
              <SelectItem value="ALL">All</SelectItem>
            </SelectContent>
          </Select>
        </div>


        <div className="space-y-2">
          <Combobox
            options={categories || []}
            value={filters.parent}
            label="Category"
            onChangeOptions={handleFilterChange('parent')}
            isLoading={categories_loading}
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