import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { UserFilterState } from "./users-data-table"
import { useQuery } from "@apollo/client"
import { ROLES_QUERY } from "@/graphql/accounts/queries"
import { ROLE_TYPE } from "@/graphql/accounts"
import { OPTION_TYPE } from "@/components/input"


interface FiltersProps {
  filters: UserFilterState;
  onFilterChange: <K extends keyof UserFilterState>(
    field: K
  ) => (value: UserFilterState[K]) => void;
}

export function TableFilters({ filters, onFilterChange }: FiltersProps) {
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search)
  const [date, setDate] = useState<DateRange | undefined>(undefined)

  const { data: roles_data } = useQuery(ROLES_QUERY)

  const roles: OPTION_TYPE[] = roles_data?.roles?.map((role: ROLE_TYPE) => ({
    value: role.id,
    label: role.name
  }))

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange("search")(debouncedSearch)
    }, 500)

    return () => clearTimeout(timer)
  }, [debouncedSearch, onFilterChange])

  const handleFilterChange = (key: keyof UserFilterState) => (value: UserFilterState[typeof key]) => {
    onFilterChange(key)(value)
  }

  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    setDate(newDateRange);
    onFilterChange('dateRange')(newDateRange)
  };

  const handleSearchChange = (value: string) => {
    setDebouncedSearch(value)
  }

  const handleClearFilters = () => {
    onFilterChange('search')('')
    onFilterChange('gender')('ALL')
    onFilterChange('isActive')('ALL')
    onFilterChange('role')(undefined)
    onFilterChange('dateRange')(undefined)
    setDate(undefined);

  };
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <div className="space-y-2">
          <Label>Search</Label>
          <Input
            placeholder="Search by name or email"
            value={debouncedSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Gender</Label>
          <Select
            value={filters.gender}
            onValueChange={handleFilterChange('gender')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Genders</SelectItem>
              <SelectItem value="MALE">Male</SelectItem>
              <SelectItem value="FEMALE">Female</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Role</Label>
          <Select
            value={filters.role?.toString()}
            onValueChange={handleFilterChange('role')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {
                roles?.map((role) => (<SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>))
              }
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={filters.isActive}
            onValueChange={handleFilterChange('isActive')}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Users</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2   ">
          <Label>Date Range</Label>

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