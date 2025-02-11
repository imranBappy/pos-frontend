import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";



export interface WasteFilterState {
  search: string | undefined;
  totalLossAmount: number | null;
  totalLossAmountLte: number | null; // For "less than or equal to"
  dateRange?: DateRange;
  orderBy: string; // Add orderBy field
}

interface WasteFiltersProps {
  filters: WasteFilterState;
  onFilterChange: <K extends keyof WasteFilterState>(
    field: K
  ) => (value: WasteFilterState[K]) => void;
}


export function WasteTableFilters({ filters, onFilterChange }: WasteFiltersProps) {
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);
  const [date, setDate] = useState<DateRange | undefined>(filters.dateRange); // Initialize with filters.dateRange
  const [totalLossAmount, setTotalLossAmount] = useState("");


  const handleFilterChange = (key: keyof WasteFilterState) => (value: WasteFilterState[typeof key]) => {
    onFilterChange(key)(value);
  };

  const handleDateRangeChange = (newDateRange: DateRange | undefined) => {
    setDate(newDateRange);
    onFilterChange('dateRange')(newDateRange);
  };

  const handleSearchChange = (value: string) => {
    setDebouncedSearch(value);
  };

  const handleTotalLossAmountChange = (value: string) => {
    setTotalLossAmount(value);
    const numValue = value === "" ? null : Number(value); // Handle empty input
    onFilterChange("totalLossAmount")(numValue); // Pass null if input is empty
  };

  const handleClearFilters = () => {
    onFilterChange('search')('');
    onFilterChange('totalLossAmount')(null);
    onFilterChange('totalLossAmountLte')(null);
    onFilterChange('dateRange')(undefined);
    setDate(undefined);
    setDebouncedSearch('');
    setTotalLossAmount("");
    onFilterChange('orderBy')('');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange("search")(debouncedSearch);
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);


  return (
    <>
      <div className="grid grid-cols-1 mt-3 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="space-y-2">
          <Input
            placeholder="Search..."
            value={debouncedSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Input
            placeholder="Total Loss Amount"
            type="number"
            value={totalLossAmount}
            onChange={(e) => handleTotalLossAmountChange(e.target.value)}
          />
        </div>

        <div className="space-y-2   ">
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
          <Select
            value={filters.orderBy}
            onValueChange={handleFilterChange('orderBy')}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Order By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date"> Date (Oldest - Newest)</SelectItem>
              <SelectItem value="-date"> Date (Newest - Oldest) </SelectItem>
              <SelectItem value="totalLossAmount"> Total Loss (Low - High)</SelectItem>
              <SelectItem value="-totalLossAmount"> Total Loss (High - Low) </SelectItem>
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

export default WasteTableFilters;