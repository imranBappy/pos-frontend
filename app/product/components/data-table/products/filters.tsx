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
import { format } from "date-fns"
import { CalendarIcon, X } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import Combobox from "@/components/input/combobox"
import { useQuery } from "@apollo/client"
import { CATEGORIES_QUERY, CATEGORY_TYPE } from "@/graphql/product"

export interface FilterState {
  search: string;
  category: number | null | string;
  subcategory: number | null | string;
  kitchen: number | null;
  tag: string;
  price: number;
  priceLte: number | null;
  orderByPrice: string | null;
  dateRange?: DateRange;
  isActive: 'ALL' | 'ACTIVE' | 'INACTIVE'
  orderBy: string;
}

interface FiltersProps {
  filters: FilterState;
  onFilterChange: <K extends keyof FilterState>(
    field: K
  ) => (value: FilterState[K]) => void;
}

const TAGS_CHOOSE = [
  { value: "TOP_RATED", label: "Top Rated" },
  { value: "RECOMMENDED", label: "Recommended" },
  { value: "NEWLY_LAUNCHED", label: "Newly Launched" },
  { value: "DAILY_SPECIAL", label: "Daily Special" },
  { value: "HOT", label: "Hot" },
  { value: "TRENDING", label: "Trending" },
  { value: "BEST_SELLER", label: "Best Seller" },
  { value: "POPULAR", label: "Popular" },
  { value: "FEATURED", label: "Featured" }
]


export function TableFilters({ filters, onFilterChange }: FiltersProps) {
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search)
  const [date, setDate] = useState<DateRange | undefined>(undefined)
  const [category, setCategory] = useState("")
  const [tag, setTag] = useState("")


  const { data: categories_data, loading: categories_loading } = useQuery(CATEGORIES_QUERY, {
    variables: {
      offset: 0,
      isCategory: true
    },
  })

  const handleFilterChange = (key: keyof FilterState) => (value: FilterState[typeof key]) => {
    onFilterChange(key)(value)
  }

  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    setDate(newDateRange);
    onFilterChange('dateRange')(newDateRange)
  };

  const handleSearchChange = (value: string) => {
    setDebouncedSearch(value)
  }

  const handleChangeCategoryOption = (id: string) => {
    setCategory(id)
    onFilterChange("category")(id)
  }

  const handleChangeTagOption = (value: string) => {
    setTag(value)
    onFilterChange("tag")(value)
  }

  const handleClearFilters = () => {
    onFilterChange('search')('')
    onFilterChange('category')(null)
    onFilterChange('subcategory')(null)
    onFilterChange('kitchen')(null)
    onFilterChange('tag')('')
    onFilterChange('price')(0)
    onFilterChange('priceLte')(null)
    onFilterChange('orderByPrice')('')
    onFilterChange('isActive')('ALL')
    onFilterChange('dateRange')(undefined)
    setDate(undefined);
    setDebouncedSearch('')
    setCategory("")
    setTag("")
    onFilterChange('orderBy')('')
  };


  const categories = categories_data?.categories?.edges?.map((node: { node: CATEGORY_TYPE }) => ({
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
      <div className="grid grid-cols-1 mt-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4 mb-6">
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
              <SelectItem value="ALL">All Products</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2   ">
          <div className={"grid gap-2"}>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
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
          <Combobox options={TAGS_CHOOSE}
            value={tag}
            label="Tag"
            onChangeOptions={handleChangeTagOption}
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
              <SelectItem value="price"> Price (1-9)</SelectItem>
              <SelectItem value="-price"> -Price (9-1) </SelectItem>
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