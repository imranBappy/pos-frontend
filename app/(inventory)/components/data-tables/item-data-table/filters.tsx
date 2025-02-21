"use client"
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
import { ITEM_CATEGORES_QUERY } from "@/graphql/item-category/queries"
import { ITEM_CATEGORY_TYPE } from "@/graphql/item-category/types"

export interface FilterState {
    search: string;
    category: number | null | string;
    stock: number;
    price: number | null;
    safetyStock: number | null;
    orderBy?: string;
}

interface FiltersProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(
    field: K
  ) => (value: FilterState[K]) => void;
}




export function TableFilters({ filters, onFilterChange }: FiltersProps) {
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search)
  const [category, setCategory] = useState("")
  const { data: categories_data, loading: categories_loading } = useQuery(ITEM_CATEGORES_QUERY, {
    variables: {
      offset: 0,
      isCategory: true
    },
  })
  const handleFilterChange = (key: keyof FilterState) => (value: FilterState[typeof key]) => {
    onFilterChange(key)(value)
  }
  const handleSearchChange = (value: string) => {
    setDebouncedSearch(value)
  }

  const handleChangeCategoryOption = (id: string) => {
    setCategory(id)
    onFilterChange("category")(id)
  }


  const handleClearFilters = () => {
    onFilterChange('search')('')
    onFilterChange('category')(null)
    onFilterChange('safetyStock')(0);
    onFilterChange('stock')(0)
    onFilterChange('orderBy')('')
    setDebouncedSearch('')

  };


  const categories = categories_data?.itemCategories?.edges?.map((node: { node: ITEM_CATEGORY_TYPE }) => ({
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
                  <Input
                      placeholder="Stock"
                      value={filters.stock || ''}
                      type="number"
                      min={0}
                      onChange={(e) =>
                          handleFilterChange('stock')(e.target.value)
                      }
                  />
              </div>

              <div className="space-y-2">
                  <Combobox
                      options={categories || []}
                      value={category}
                      label="Category"
                      onChangeOptions={handleChangeCategoryOption}
                      isLoading={categories_loading}
                  />
              </div>

              <div className="space-y-2">
                  <Select
                      value={filters.orderBy}
                      onValueChange={handleFilterChange('orderBy')}
                  >
                      <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="stockLevel">
                              Stock Level ( Hight to Low ) 
                          </SelectItem>
                          <SelectItem value="-stockLevel">
                              -Stock Level ( Low to Hight )
                          </SelectItem>
                      </SelectContent>
                  </Select>
              </div>

              <div
                  className="
                    flex-1
                    text-sm
                    text-muted-foreground
                    whitespace-nowrap
                    mr-2
                    flex
                    justify-end
                    items-end

                    "
              >
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