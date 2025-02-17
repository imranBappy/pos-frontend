"use client"
import { Input } from "@/components/ui";
import { debounce } from "@/lib/utils";
import { Search } from "lucide-react";
import { ReactNode, useCallback } from "react";
interface PropsType {
    onChange: (value: string) => void;
    children: ReactNode,
    valueState: [string, React.Dispatch<React.SetStateAction<string>>]
}

const SearchableFiled = ({ onChange, children, valueState }: PropsType) => {
    const [value, setValue] = valueState
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSetSearch = useCallback(
        debounce((value: unknown) => onChange(value as string), 200),
        [],
    )
    return (
        <div className="max-w-80 relative ">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                autoComplete="off"
                type="search" value={value} className=" max-w-80  pl-8" onChange={(e) => {
                    debouncedSetSearch(e.target.value)
                    setValue(e.target.value)
                }} name="search" placeholder="Search..." />
            {children}
        </div>
    );
};

export default SearchableFiled;
