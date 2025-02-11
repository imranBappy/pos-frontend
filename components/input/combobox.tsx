"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"


interface OPTION_TYPE {
    value: string;
    label: string
}
interface PROPS_TYPE {
    options: OPTION_TYPE[];
    value: string;
    label: string;
    onChangeOptions: (id: string) => void;
    isLoading?: boolean;
    disabled?:boolean
    
}



function CommandLoading() {
    return <CommandEmpty>Loading...</CommandEmpty>
}

export function Combobox({ options, value, onChangeOptions, label, isLoading, disabled }: PROPS_TYPE) {
    const [open, setOpen] = React.useState(false)
    return (
        <Popover open={open} onOpenChange={setOpen}  >
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    disabled={disabled}
                >
                    {value
                        ? options.find((item) => item.value === value)?.label
                        : `Select ${label.toLowerCase()}...`}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" >
                <Command >
                    <CommandInput  placeholder={`Search ${label.toLowerCase()}...`} className="h-9" />
                    <CommandList>
                        {isLoading ? <CommandLoading /> : <CommandEmpty>{`No ${label.toLowerCase()} found.`}</CommandEmpty>}
                        <CommandGroup>
                            {options.map((opt) => (
                                <CommandItem
                                    key={opt.value}
                                    value={opt.value}
                                    onSelect={(currentid) => {
                                        onChangeOptions(currentid === value ? "" : currentid)
                                        setOpen(false)
                                    }}
                                >
                                    {opt.label}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === opt.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
export default Combobox;