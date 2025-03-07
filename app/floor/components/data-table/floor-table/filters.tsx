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
import Combobox from "@/components/input/combobox"
import { useQuery } from "@apollo/client"
import { CATEGORY_TYPE, FLOORS_QUERY } from "@/graphql/product"

export interface FilterState {
  search: string;
  isActive: 'ALL' | 'ACTIVE' | 'INACTIVE'
  orderBy: string;
  floor: string | null
}

interface FiltersProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(
    field: K
  ) => (value: FilterState[K]) => void;
}




export function TableFilters({ filters, onFilterChange }: FiltersProps) {
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search)
  const [floor, setFloor] = useState("")


  const { data: floors_data, loading: floors_loading } = useQuery(FLOORS_QUERY, {
    variables: {
      offset: 0,
    },
  })

  const handleFilterChange = (key: keyof FilterState) => (value: FilterState[typeof key]) => {
    onFilterChange(key)(value)
  }

  const handleSearchChange = (value: string) => {
    setDebouncedSearch(value)
  }

  const handleChangeCategoryOption = (id: string) => {
    setFloor(id)
    onFilterChange("floor")(id)
  }
  const handleClearFilters = () => {
    onFilterChange('search')('')
    onFilterChange('floor')(null)
    onFilterChange('isActive')('ALL')
    setDebouncedSearch('')
    onFilterChange('orderBy')('')
  };


  const categories = floors_data?.floors?.edges?.map((node: { node: CATEGORY_TYPE }) => ({
    value: node.node.id,
    label: node.node.name,
  }))

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange("search")(debouncedSearch)
    }, 500)
    return () => clearTimeout(timer)
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])


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
          <Combobox
            options={categories || []}
            value={floor}
            label="Floor"
            onChangeOptions={handleChangeCategoryOption}
            isLoading={floors_loading}
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
              <SelectItem value="ALL">All Table</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>





        <div className="space-y-2">
          <Select
            value={filters.orderBy}
            onValueChange={handleFilterChange('orderBy')}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Order By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt"> CreatedAt (1-9)</SelectItem>
              <SelectItem value="-createdAt"> -CreatedAt (9-1) </SelectItem>
            </SelectContent>
          </Select>
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