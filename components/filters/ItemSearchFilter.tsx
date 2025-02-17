"use client"
import { useCallback, useMemo, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import { OPTION_TYPE } from "../input"
import { ITEMS_TYPE } from "@/stores/slices"

function SearchIcon() {
    return (
        <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}

function debounce(func: (...args: unknown[]) => void, wait: number) {
    let timeout: NodeJS.Timeout
    return function executedFunction(...args: unknown[]) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

interface FilterProps {
    placeholder: string,
    items: OPTION_TYPE[],
    selectedItems: ITEMS_TYPE;
    onSelect: (id: string, quantity: number, price: number, item?: string,) => void;
    onRemove: (id: string) => void;
    isForProduct?: boolean
}

const SearchFilter = ({ placeholder = "Search...", isForProduct, onSelect, onRemove, selectedItems, items }: FilterProps) => {
    const [search, setSearch] = useState("")
    const filteredItems = useMemo(
        () => items.filter((item) => item.label.toLowerCase().includes(search.toLowerCase())),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [search],
    )

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSetSearch = useCallback(
        debounce((value: unknown) => setSearch(value as string), 300),
        [],
    )

    return (
        <div className=" !w-full border  rounded">

            <div className="p-3">
                <div className="relative">
                    <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
                        <SearchIcon />
                    </div>
                    <Input onChange={(e) => debouncedSetSearch(e.target.value)} id="search" type="search" placeholder={placeholder} className="w-full rounded   bg-background pl-8" />
                </div>
                <ScrollArea className=" h-46  w-full ">
                    <div className="p-4">
                        {filteredItems.map((item) => (
                            <>
                                <div className="flex gap-10 justify-between">
                                    <div
                                        className="flex items-center space-x-2"
                                    >
                                        <Checkbox
                                            onClick={() => selectedItems.get(item.value) ? null : onSelect(item.value, 1, 1, selectedItems.get(item.value)?.id)}
                                            id={item.value}
                                            checked={selectedItems.has(item.value)}
                                            name={item.value}
                                        />
                                        <label
                                            htmlFor={item.value}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {item.label}
                                        </label>
                                        {
                                            selectedItems.get(item.value) ? <button onClick={() => onRemove(item.value)} type="button"><X className="bg-red-500 rounded" size={18} /></button> : null
                                        }

                                    </div>

                                    <div className=" flex gap-7 ">
                                        {
                                            !isForProduct ? <div className=" flex gap-2 items-center  ">
                                                <label className=" text-sm" htmlFor={`price-${item.value}`}>Price: </label>
                                                <Input
                                                    id={`price-${item.value}`}
                                                    onChange={(e) => onSelect(item.value, selectedItems.get(item.value)?.quantity || 1, Number(e.target.value), selectedItems.get(item.value)?.id)}
                                                    type="number"
                                                    min={0}
                                                    placeholder='Price'
                                                    name='price'
                                                    className='w-24 h-7'
                                                    value={selectedItems.get(item.value)?.price || ""}
                                                    disabled={selectedItems.get(item.value) === undefined}
                                                />
                                            </div> : null
                                        }

                                        <div className="flex gap-3 items-center ">
                                            <label className=" text-sm" htmlFor={`quantity-${item.value}`}>Quantity: </label>
                                            <Input
                                                id={`quantity-${item.value}`}
                                                onChange={(e) => onSelect(item.value, Number(e.target.value), selectedItems.get(item.value)?.price || 1, selectedItems.get(item.value)?.id)}
                                                type="number"
                                                min={1}
                                                placeholder='Quantity'
                                                name='quantity'
                                                className='w-24 h-7'
                                                value={selectedItems.get(item.value)?.quantity || ""}
                                                disabled={selectedItems.get(item.value) === undefined}
                                            />
                                            <p className="  w-24 text-sm uppercase  "> {item.unit}</p>
                                        </div>
                                    </div>
                                </div>
                                <Separator className="my-2" />
                            </>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default SearchFilter;