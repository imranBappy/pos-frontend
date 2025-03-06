"use client";
import React, { useContext, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FilterState } from "@/app/product/components";
import { Search } from "lucide-react";
import OrderItemCategories from "./Item-categories";
import Items from "./items";
import { cn } from "@/lib/utils";
import { SidebarContext } from "@/components/ui/sidebar";
import { useDebouncedValue } from "@/hooks/use-debounced-value";

const OrderItemsAndCategory = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    category: null,
    subcategory: null,
    kitchen: null,
    tag: "",
    priceLte: null,
    orderByPrice: "",
    isActive: "ALL",
    orderBy: "",
  });
  const sidebarContext = useContext(SidebarContext);
  const debouncedSearch = useDebouncedValue(filters.search, 500);


  const handleFilterChange =
    (key: keyof FilterState) => (value: FilterState[typeof key]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    };

  useEffect(() => {
    handleFilterChange("search")(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <div
      className={cn(
        "h-full",
        sidebarContext?.open ? "w-[calc(100vw-654px)]" : "w-[calc(100vw-447px)]"
      )}
    >
      <Card className=" p-3">
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(e) =>
              setFilters((preState) => ({
                ...preState,
                search: e.target.value,
              }))
            }
            placeholder="Search item..."
            className="pl-8"
          />
        </div>
        {/* Categories Section */}
        <OrderItemCategories
          filters={filters}
          handleFilterChange={handleFilterChange}
        />
        <Items
          filters={filters}
  
        />
      </Card>
    </div>
  );
};

export default OrderItemsAndCategory;
